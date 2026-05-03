---
title: Multilingual NLP Pipeline
date: Aug 2024
github: https://github.com/srikant-siddhiyoga/multilingual-nlp-pipeline
status: Production
tags: [Python, FastAPI, HuggingFace Transformers, spaCy, Redis, Docker, PostgreSQL, Celery]
---

## Overview

Building a single NLP pipeline that works reliably across a dozen languages is a deceptively hard problem. Models trained on high-resource languages like English degrade sharply on South Asian or Semitic scripts without careful preprocessing and cross-lingual fine-tuning.

This project addresses that gap with a modular, language-agnostic pipeline served as a REST API. The system processes raw text and returns structured annotations — named entities, intent classifications, sentiment scores, and language-detected spans — all within a p99 latency of under 180 ms for requests under 512 tokens.

## Architecture

```
         ┌──────────────────────────────────┐
         │         Nginx + SSL              │
         └────────────┬─────────────────────┘
                      │
         ┌────────────▼─────────────────────┐
         │       FastAPI Application         │
         │  (async, Pydantic v2 schemas)    │
         └───┬──────────┬──────────┬────────┘
             │          │          │
     ┌───────▼──┐ ┌─────▼───┐ ┌───▼──────┐
     │Lang Detect│ │NER Model│ │Classifier│
     │fasttext  │ │mBERT    │ │XLM-RoBERTa│
     └───────┬──┘ └─────┬───┘ └───┬──────┘
             └──────────▼──────────┘
                        │
            ┌───────────▼────────────┐
            │      Redis Cache       │
            │  (SHA-256 input hash)  │
            └───────────┬────────────┘
                        │
            ┌───────────▼────────────┐
            │  PostgreSQL (audit)    │
            └────────────────────────┘
```

## Key Design Decisions

**Async-first FastAPI** — all model inference is offloaded to a `ThreadPoolExecutor` via `asyncio.run_in_executor`, preventing transformer inference from blocking the event loop.

**Two-tier caching** — Short-lived repeated requests are served from Redis using a SHA-256 hash of the normalised input as the cache key (TTL: 1 hour). Analytics are written asynchronously via Celery.

**Model loading** — All transformer models are loaded once at startup into a global `ModelRegistry`. Hot-swapping is supported by loading a candidate model into a shadow slot and atomically swapping the pointer.

**Language routing** — Input is first classified by a lightweight fastText model (< 5 ms). The detected language routes to the correct tokeniser and model variant.

## Implementation

```python
# schemas.py
from pydantic import BaseModel, Field
from typing import Optional

class NLPRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8192)
    tasks: list[str] = Field(default=["ner", "classify", "sentiment"])
    language: Optional[str] = Field(default=None)

class EntitySpan(BaseModel):
    text: str
    label: str
    start: int
    end: int
    confidence: float
```

```python
# cache.py
import hashlib, json
import redis.asyncio as aioredis

def cached_inference(ttl: int = 3600):
    def decorator(func):
        async def wrapper(request, redis_client, *args, **kwargs):
            key = "nlp:" + hashlib.sha256(
                json.dumps(request.dict(), sort_keys=True).encode()
            ).hexdigest()
            cached = await redis_client.get(key)
            if cached:
                return NLPResponse(**json.loads(cached), cached=True)
            result = await func(request, *args, **kwargs)
            await redis_client.setex(key, ttl, result.json())
            return result
        return wrapper
    return decorator
```

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Models > 1 GB each | Quantised to INT8 with `optimum` — 60% size reduction, < 2% accuracy drop |
| Tokeniser mismatch for Arabic/Devanagari | Script-specific pre-normalisation before tokenisation |
| Cold-start latency | Warm-up endpoint called by Kubernetes readiness probe |
| Memory fragmentation under load | Pinned worker memory + `allow_tf32` for matmul ops |

## Results

- **Languages:** 12 (English, Hindi, Arabic, French, Spanish, German, Portuguese, Bengali, Tamil, Urdu, Swahili, Indonesian)
- **p99 latency:** 178 ms (512-token input, GPU inference)
- **Cache hit rate:** ~42% in production
- **Throughput:** ~380 req/s on 2× NVIDIA T4

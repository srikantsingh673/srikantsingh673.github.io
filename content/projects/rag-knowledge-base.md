---
title: RAG-Powered Knowledge Base
date: Jan 2025
github: https://github.com/srikant-siddhiyoga/rag-knowledge-base
status: Production
tags: [Python, FastAPI, LangChain, FAISS, sentence-transformers, Claude API, Docker]
---

## Overview

Internal documentation is notoriously hard to search. Full-text search returns too many irrelevant results; keyword search misses semantic intent; asking a colleague is slow.

This system uses RAG to bridge the gap: documents are chunked, embedded, and indexed so that a developer can ask a natural-language question and receive a grounded, cited answer in under two seconds.

## Architecture

```
  Document Sources (Confluence, Notion, Markdown)
        │
  ┌─────▼──────────────┐
  │   Ingestion Worker  │  (scheduled, incremental)
  │  chunk → embed →   │
  │  upsert FAISS      │
  └─────┬──────────────┘
        │
  ┌─────▼──────────────────────────────┐
  │           FAISS Index               │
  │  (all-mpnet-v2 embeddings)         │
  └─────┬──────────────────────────────┘
        │  top-20 retrieval
  ┌─────▼──────────────┐
  │   Cross-encoder     │  (reranks top-20 → top-5)
  └─────┬──────────────┘
        │
  ┌─────▼──────────────┐
  │   FastAPI /query   │
  └─────┬──────────────┘
        │
  ┌─────▼──────────────┐
  │   Claude API (LLM) │  ← grounded prompt + citations
  └────────────────────┘
```

## Chunking Strategy

Documents are split at paragraph boundaries rather than fixed token windows. The nearest preceding heading is prepended to each chunk before embedding, dramatically improving retrieval precision for function-level queries.

```python
def semantic_chunk(text, source, max_tokens=400, overlap_tokens=64):
    raw_sections = re.split(r'\n{2,}|(?=^#{1,3} )', text, flags=re.MULTILINE)
    chunks, current_heading = [], None
    for section in raw_sections:
        if re.match(r'^#{1,3} ', section):
            current_heading = section.strip()
        tokens = section.split()
        if len(tokens) > max_tokens:
            for i in range(0, len(tokens), max_tokens - overlap_tokens):
                window = tokens[i:i + max_tokens]
                chunks.append(Chunk(
                    text=" ".join(window),
                    source=source,
                    heading=current_heading
                ))
        elif section.strip():
            chunks.append(Chunk(text=section.strip(), source=source, heading=current_heading))
    return chunks
```

## Embedding Model Benchmarks

| Model | MRR@5 | Latency | Size |
|---|---|---|---|
| `all-mpnet-base-v2` | 0.71 | 12 ms | 438 MB |
| `all-MiniLM-L6-v2` | 0.64 | 4 ms | 91 MB |
| `e5-large-v2` | **0.76** | 28 ms | 1.3 GB |

## Results

- **Query response time (p95):** 1.8 s
- **Search time reduction:** 70% vs. prior Confluence full-text search
- **User satisfaction:** 4.4/5 (n = 34 developers)
- **Index size:** 18,000+ chunks across 3 source systems
- **Reranking gain:** MRR@5 from 0.71 → 0.83

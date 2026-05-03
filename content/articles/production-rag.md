---
title: Building a Production-Ready RAG System in Python — Beyond the Tutorial
date: 2025-03-10
tags: [RAG, NLP, LLM, FastAPI, Python]
---

Retrieval-Augmented Generation (RAG) is one of those ideas that looks simple until you try to run it in production. The demo that works in a Jupyter notebook collapses under real usage patterns: varied query intent, long documents, stale indexes, and latency budgets that don't accommodate a 4-second round trip.

This article walks through the decisions that actually matter when you build a RAG system that has to work reliably.

## The Chunking Problem

Your retrieval quality is largely determined before you write a single line of retrieval code. Chunking — how you split source documents into indexable units — is where most RAG systems quietly fail.

### What not to do

The default "split every 512 tokens with 50-token overlap" is a reasonable starting point, but it breaks semantic units. Consider this from an API reference:

> `create_user(email, password, role)` — Creates a new user. The `role` parameter must be one of `["admin", "member", "viewer"]`.

Chunked at a fixed boundary, this might split after "role parameter must be one of" — destroying the relationship between parameter and constraint.

### A better approach: semantic chunking

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
                chunks.append(Chunk(text=" ".join(window), heading=current_heading))
        elif section.strip():
            chunks.append(Chunk(text=section.strip(), heading=current_heading))
    return chunks
```

The critical addition: prepend the heading context to each chunk before embedding. A chunk like "The `role` parameter must be one of..." becomes "create_user function — The `role` parameter must be one of..." — dramatically improving precision for function-level queries.

## The Reranking Layer

FAISS ANN retrieval is fast but approximate. Retrieving 20 candidates and reranking with a cross-encoder consistently improves answer quality for around 40 ms of added latency — a trade-off almost always worth making.

```python
from sentence_transformers import CrossEncoder

_reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank(query: str, chunks: list, top_k: int = 5) -> list:
    pairs = [(query, chunk.text) for chunk in chunks]
    scores = _reranker.predict(pairs)
    ranked = sorted(zip(scores, chunks), key=lambda x: x[0], reverse=True)
    return [chunk for _, chunk in ranked[:top_k]]
```

This single addition raised MRR@5 from 0.71 to 0.83.

## Latency Budget

With a 2-second p95 target:

| Step | Time |
|---|---|
| Query embedding | ~15 ms |
| FAISS ANN search | ~5 ms |
| Cross-encoder rerank | ~40 ms |
| LLM generation | ~1,400 ms |
| Network + serialisation | ~30 ms |
| **Total (p95)** | **~1,850 ms ✓** |

## Failure Modes to Anticipate

**Index staleness** — run an incremental ingestion worker every 30 minutes that hashes each document and re-embeds only changed chunks.

**Hallucination when retrieval fails** — guard with a similarity threshold. If the top retrieved chunks score below 0.45, return "I couldn't find relevant documentation" rather than passing a poor context to the LLM.

**Query intent mismatch** — "How do I delete a user?" and "Can I delete a user?" have similar embeddings but different intents. A lightweight intent classifier upstream can route permission queries to a policy document collection.

## Conclusion

RAG systems are not hard to build, but they are genuinely hard to build well. The gap between a working demo and a reliable production service lives in chunking fidelity, retrieval precision, latency discipline, and graceful handling of retrieval failure.

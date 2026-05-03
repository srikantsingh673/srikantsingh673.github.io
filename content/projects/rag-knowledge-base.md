---
title: RAG-Powered Knowledge Base Chatbot
date: Sep 2024
github: https://github.com/your-repo-link
status: Production
---

## Overview

A production-grade Retrieval-Augmented Generation (RAG) chatbot designed to automate customer support using structured knowledge bases and historical email data. The system leverages vector search (ChromaDB) and LLM synthesis (Claude Haiku) to deliver context-aware, accurate, and source-backed responses.

---

## Architecture
```text
User Query
│
▼
FastAPI Backend (Async API Layer)
│
├────────► Embedding Model
│ (Query Vectorisation)
│
▼
Retriever (ChromaDB)
│
▼
Top-K Relevant Chunks
│
▼
LLM (Claude Haiku)
(Context + Prompt Synthesis)
│
▼
Final Answer + Sources
```

---

## Key Features

- Context-aware chatbot powered by RAG architecture  
- Vector-based semantic search using ChromaDB  
- Source-backed responses with traceable citations  
- Multi-source ingestion (emails + markdown knowledge base)  
- Admin panel for ingestion, monitoring, and KB management  
- Retry and fallback mechanisms for LLM robustness  
- Structured logging and configurable pipeline  

---

## Key Design Decisions

**RAG over fine-tuning**  
Avoided model fine-tuning in favour of retrieval-based augmentation for faster iteration, lower cost, and easier knowledge updates.

**Local vector store (ChromaDB)**  
Ensures fast retrieval and full control over data, suitable for privacy-sensitive support data.

**Claude Haiku for synthesis**  
Chosen for low latency and cost efficiency while maintaining strong instruction-following capabilities.

**Chunk-based retrieval**  
Documents are split into semantically meaningful chunks to improve retrieval precision and reduce hallucination.

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Irrelevant retrieval results | Improved chunking strategy and metadata-based filtering |
| Hallucinated responses | Enforced strict context grounding and source attribution |
| Noisy email data | Preprocessing and cleaning pipeline before ingestion |
| Latency under load | Async FastAPI + optimized retrieval pipeline |

---

## Results

1. Reduced manual support workload by automating a large portion of repetitive queries  
2. Achieved high response relevance through semantic retrieval + LLM synthesis  
3. Enabled near real-time support with low-latency inference pipeline  
4. Improved answer reliability with source-backed responses  
5. Scalable architecture supporting continuous KB updates without retraining  

---
---
title: Multilingual Speech & Dubbing Pipeline
date: Aug 2024
github: https://github.com/srikant-siddhiyoga/multilingual-nlp-pipeline
status: Production
---

## Overview

A production-grade multilingual speech pipeline for automated video dubbing.  
The system integrates Whisper-based ASR, duration-aware LLM translation, and neural voice cloning (XTTS v2 / Qwen3-TTS) to generate high-fidelity dubbed outputs while preserving natural speech timing.

The pipeline runs fully locally, avoids time-stretching, and ensures temporal alignment through controlled padding and truncation strategies.

---

## Architecture (Pipeline Flow)
```text
Input: Video + (Optional SRT)
│
├──► [ASR - Optional]
│ Faster-Whisper (large-v3)
│ → Generates subtitles (.srt)
│
├──► [Translation - Optional]
│ LLM (translategemma:12b via Ollama)
│ → Duration-aware translated subtitles
│
└──► [Dubbing Pipeline]
│
├── Subtitle Processing
├── Duration-Constrained Translation
├── TTS / Voice Cloning (XTTS v2 / Qwen3-TTS)
├── Audio Timeline Assembly
│ (silence padding + truncation)
│
└──► Output: dubbed.mp4
```

---

## System Design

- **Backend**: FastAPI (async orchestration)
- **Video & Audio**: FFMPEG
- **Transaltion**: Ollama (translategemma:12b)
- **TTS**: Qwen3-TTS
- **Deployment**: Local

---

## Key Design Decisions

**No Time-Stretching**  
Audio speed is never modified. Instead, alignment is achieved via silence padding and controlled truncation, preserving natural speech characteristics.

**Fully Local Execution**  
All models run locally (no external APIs), enabling:
- Privacy-sensitive deployments  
- Offline execution  
- Full control over inference  

Tradeoff: higher compute requirements.

**Segment-Level Translation**  
Translation operates per subtitle segment with duration constraints.  
This ensures timing alignment but may reduce cross-sentence fluency.

**LLM-based Translation over Traditional NMT**  
LLMs allow:
- Word-count constraints  
- Duration control  
- Custom prompting  

Tradeoff: slower and less BLEU-optimized than dedicated NMT systems.

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Inconsistent phoneme boundaries in generated speech | Controlled decoding + post-generation trimming |
| Poor voice cloning for very short segments (<1s) | Minimum duration thresholds + fallback synthesis |
| Misalignment in structurally different languages | Duration-aware prompting with per-language constraints |
| False hallucination detection in repetitive text | Dynamic compression thresholds based on segment patterns |

---

## Results

- Fully local dubbing pipeline supporting **9+ languages**
- Eliminates Whisper hallucination issues using **multi-layer filtering**
- Improves subtitle timing alignment via **duration-constrained translation**
- Achieves **~85–92% speaker similarity** with minimal reference audio
- Preserves natural speech without distortion using **timeline-based alignment**

---

## Notes

This system prioritizes **naturalness and control over raw translation accuracy**, making it suitable for:
- Educational content
- Multilingual media
- Voice-preserving dubbing applications
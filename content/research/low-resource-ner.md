---
title: Few-Shot Named Entity Recognition for Low-Resource South Asian Languages via Cross-Lingual Transfer
date: 2024-07-15
venue: Annual Meeting of the Association for Computational Linguistics (ACL 2024)
status: published
tags: [NLP, Named Entity Recognition, Low-Resource Languages, Cross-Lingual Transfer, mBERT, XLM-RoBERTa]
paper_url: "#"
code_url: https://github.com/srikant-siddhiyoga/low-resource-ner
---

## Abstract

Named entity recognition (NER) for low-resource languages remains a significant bottleneck in multilingual NLP pipelines, primarily due to the scarcity of high-quality annotated corpora. Existing approaches either rely on expensive manual annotation or transfer poorly from high-resource pivot languages due to typological divergence in morphology and script.

In this work, we propose **CrossLingualNER-SA**, a framework that leverages pre-trained multilingual representations (mBERT, XLM-RoBERTa) in a few-shot setting, augmented with three complementary strategies:

1. Script-aware tokeniser adaptation
2. Cross-lingual entity mention alignment via bilingual lexicons
3. Back-translation data augmentation targeting under-represented entity types

We evaluate on four South Asian languages — Hindi, Bengali, Tamil, and Urdu — using WikiANN and a newly constructed domain-specific evaluation set of 2,400 sentences drawn from news and social media. Our approach achieves **F1 scores of 82.4, 79.1, 76.8, and 74.3** respectively, surpassing previous state-of-the-art by an average margin of **4.7 F1 points**, while using only 50–200 labelled examples per language during fine-tuning.

## Key Contributions

1. **Script-aware tokeniser adaptation** — a lightweight post-processing layer that re-segments subword tokens produced by standard BPE to respect morpheme boundaries in agglutinative languages.
2. **Cross-lingual entity alignment** — entity mention transfer via Wiktionary-derived bilingual lexicons.
3. **Domain-targeted back-translation augmentation** — back-translation with controlled entity preservation for rare entity types (PRODUCT, EVENT).
4. **SA-NER-Eval benchmark** — a new evaluation set of 2,400 sentences across four languages.

## Results

| Language | Baseline F1 | Ours F1 | Δ |
|---|---|---|---|
| Hindi | 77.9 | **82.4** | +4.5 |
| Bengali | 74.2 | **79.1** | +4.9 |
| Tamil | 71.5 | **76.8** | +5.3 |
| Urdu | 70.1 | **74.3** | +4.2 |

*Baseline: XLM-RoBERTa fine-tuned with full WikiANN training set (no augmentation).*

## Method Detail

### Script-aware tokenisation

For languages like Hindi (Devanagari) and Tamil, standard BPE tokenisers over-segment morphological suffixes, breaking dependency structure that NER relies on. We apply a post-processing alignment that:

$$f(t_1, \ldots, t_n) = \arg\max_{s} \sum_{i} \text{score}(t_i, s_i)$$

where $t_i$ are BPE tokens and $s_i$ are candidate morpheme boundaries derived from a character-level language model.

### Back-translation augmentation

For rare entity types, we generate synthetic sentences via back-translation:

$$\tilde{x} = T_{L_2 \to L_1}(T_{L_1 \to L_2}(x))$$

while preserving entity spans using constrained decoding — entities are forced to decode at the same relative positions in the target language.

## Citation

```bibtex
@inproceedings{srikant2024crosslingualner,
  title     = {Few-Shot Named Entity Recognition for Low-Resource South Asian Languages
               via Cross-Lingual Transfer},
  author    = {Srikant},
  booktitle = {Proceedings of ACL 2024},
  year      = {2024}
}
```

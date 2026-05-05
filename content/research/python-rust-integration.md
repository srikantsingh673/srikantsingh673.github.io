---
title: Benchmarking Python–Rust Integration for High-Performance Computing Tasks
date: 2026-05-25
venue: Under Review — IEEE Transactions on Software Engineering
status: review
tags: [Python, Rust, High-Performance Computing, Benchmarking]
paper_url: "#"
---

## Abstract

High-performance computing (HPC) requirements have dramatically increased in recent years for a wide range of tasks, including data analytics, machine learning, and system optimization. Although Python is a favored language in science and analysis, its dynamic features can cause performance bottlenecks. On the other hand, Rust is a new systems language that guarantees memory safety while offering near-native execution performance, and as such is a prime contender for high-performance applications.

In this paper we conduct a benchmarking study of Python–Rust interoperability, evaluating multiple integration strategies — PyO3 native extensions, ctypes FFI, and subprocess-based pipelines — across representative HPC workloads. We measure throughput, latency, memory safety guarantees, and developer ergonomics to provide actionable guidance for practitioners considering hybrid Python–Rust architectures.

## Key Contributions

1. **Integration taxonomy** — a structured classification of Python–Rust interoperability strategies covering PyO3, Maturin, ctypes, cffi, and subprocess boundaries.
2. **HPC benchmarking suite** — reproducible benchmarks across data-parallel numerical kernels, streaming data pipelines, and concurrent I/O workloads.
3. **Memory safety analysis** — characterisation of memory safety boundaries at the Python–Rust interface and common pitfalls when passing ownership across the FFI boundary.
4. **Ergonomics evaluation** — developer experience assessment covering build tooling (Maturin, setuptools-rust), type annotation interoperability, and debugging support.

## Benchmark Setup

| Parameter | Value |
|---|---|
| OS | Ubuntu 24.04 LTS (WSL2 on Windows 11) |
| Host CPU | Intel Core i7-1185G7 @ 3.00 GHz (1.80 GHz base) |
| Host RAM | 16 GB (15.4 GB usable) |
| WSL CPU cores | 8 |
| WSL RAM | 8 GB (7.46 GB usable) |
| Python version | 3.12.3 |
| Rust toolchain | stable 1.91.0 |
| Integration layer | PyO3 |
| Timing method | `timeit` module via `time.perf_counter()` |
| Workload categories | Arithmetic, string manipulation, list sorting & filtering, file I/O, conditional branching |

## Benchmarking Process

The benchmarking procedure was designed to guarantee both statistical dependability and reproducibility across Python and Rust implementations. The `timeit` module — which internally relies on high-resolution time via `perf_counter()` — was used to time each computational function for accurate wall-clock measurements.

Each function was executed once as a warm-up run before the main timing loop to minimise noise and caching effects. `timeit.repeat()` then carried out the primary benchmarking, generating independent timing samples by running each function with `number=1` for *r* = 5 repetitions.

From the gathered timing samples *t₁, t₂, …, tᵣ*, the mean execution time and standard deviation were computed as:

> **Mean:** t̄ = (1 / r) × Σ tᵢ
>
> **Std dev:** σ = √( (1 / r) × Σ (tᵢ − t̄)² )

These formulas were implemented directly in the Python benchmarking scripts and applied consistently across all workloads — arithmetic operations, string manipulation, list sorting and filtering, file I/O, and conditional branching — via the `benchmark_func()` routine.

## Preliminary Findings

This study looked at how integrating Python and Rust can
improve the performance of Python apps with CPU-heavy
workloads. Testing outcomes show that due to its compiled
and efficient memory management, Embedding Rust shines
in certain areas such as arithmetic operations and loop-based
processing. Embedding Rust was still slower than Python for
operations such as string and list operations that relied on
Python’s powerful built-in functions. File I/O, which showed
varying results, was influenced by the execution environment.
Overall, the performance results show that combining
Python and Rust is a viable approach to improving perfor
mance without compromising Python’s productivity. By dele
gating some performance-intensive tasks to Rust for faster ex
ecution, programmers can continue to use Python for problem
solving tasks. Such an approach is suitable for modern data
intensive and compute-intensive applications as it combines
speed and productivity.

## Citation

```text
S. Singh, "Benchmarking Python–Rust Integration for High-Performance Computing Tasks,"
*IEEE Trans. Softw. Eng.*, Under Review, May 2026.
```

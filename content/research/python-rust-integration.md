---
title: Benchmarking Python–Rust Integration for High-Performance Computing Tasks
date: 2026-08-26
venue: International Journal for Multidisciplinary Research (IJFMR), Vol. 8, Issue 4
status: published
tags: [Python, Rust, PyO3, High-Performance Computing, Benchmarking, Sustainable Software Engineering]
paper_url: "https://www.ijfmr.com/papers/2026/4/86497.pdf"
---

**Authors:** Srikant Singh, Ravi Raj
**Published in:** International Journal for Multidisciplinary Research (IJFMR), Volume 8, Issue 4, July–August 2026 · E-ISSN 2582-2160
**DOI:** [10.36948/ijfmr.2026.v08i04.86497](https://doi.org/10.36948/ijfmr.2026.v08i04.86497)

**Links:** [Journal page](https://www.ijfmr.com/research-paper.php?id=86497) · [Full PDF](https://www.ijfmr.com/papers/2026/4/86497.pdf) · [ResearchGate](https://www.researchgate.net/publication/413640338_Benchmarking_Python-Rust_Integration_for_High-Performance_Computing_Tasks) · [Benchmark code (GitHub)](https://github.com/srikantsingh673/Benchmarking-Python-Rust-HPC)

## Abstract

High-performance computing (HPC) requirements have dramatically increased in recent years for a wide range of tasks, including data analytics, machine learning and system optimization. Although Python is a favored language in science and analysis, its dynamic features can cause performance bottlenecks. On the other hand, Rust is a new systems language that guarantees memory safety while offering near-native execution performance, and as such is a prime contender for high-performance applications.

In this paper we conduct a benchmarking study of Python–Rust interoperability: we benchmark pure Python versions against Python code with embedded Rust routines (using the PyO3 package) for various tasks like arithmetic calculations, string operations, list operations, file operations and conditional statements. We also analyse the impact of effective language integration and reduced run-time on more sustainable software engineering practices: by reducing the overall number of CPU cycles, memory use and energy consumption, hybrid approaches enable more energy-efficient HPC applications. Finally, we discuss when and how Python–Rust co-development can be used to create high-performance and energy-efficient solutions in scientific computing.

**Keywords:** Python–Rust Integration, High-Performance Computing (HPC), PyO3, Performance Benchmarking, Sustainable Software Engineering

## Motivation

Python is the default language for scientific and analytical computing, but its interpreted, dynamically-typed nature — and the Global Interpreter Lock (GIL) in CPython — limit performance on compute-intensive and multi-threaded workloads. Rust offers native-code speed with compile-time memory safety and no garbage collector, and PyO3 lets Rust code be compiled into native extension modules that Python imports directly.

Earlier work has looked at language-level performance or at concurrency gains from sidestepping the GIL. This study fills the gap with a holistic, task-by-task comparison of pure Python against PyO3-based Python–Rust hybrids across general-purpose workloads, using a consistent statistical methodology.

## Experimental Setup

| Parameter | Value |
|---|---|
| OS | Ubuntu 24.04 LTS (WSL on Windows 11) |
| Host CPU | 11th Gen Intel Core i7-1185G7 @ 3.00 GHz (1.80 GHz base) |
| Host RAM | 16 GB (15.4 GB usable) |
| WSL CPU cores | 8 |
| WSL RAM | 8 GB (7.46 GB usable) |
| Python version | 3.12.3 |
| Rust toolchain | 1.91.0 |
| Integration layer | PyO3 |
| Timing method | `timeit` module (backed by `time.perf_counter()`) |

## Integration Workflow

Rust functions are defined in `lib.rs`, compiled into a shared library through PyO3, and imported at runtime into the Python benchmark scripts.

- **Python layer** — defines the test harnesses and calls the Rust functions through PyO3 bindings.
- **Rust layer** — implements the arithmetic, string, list and other compute-heavy routines.
- **Benchmark execution** — runs the Python-native (`raw_python.py`) and Rust-integrated (`embedded_python.py`) versions with identical inputs and iteration counts.

Both versions implement the **same algorithm**, so measured differences reflect language and runtime behaviour, not algorithmic differences.

## Benchmark Workloads

1. **Arithmetic operations** — addition, subtraction, multiplication, division and modulus in a loop over *n* = 1 … *x*.
2. **String manipulation** — concatenating and reversing random strings *n* times.
3. **List manipulation** — generating *n* random integers, sorting, and filtering out even numbers.
4. **If-else logic (number → name)** — returning the English word for a number 0–100 through a chain of conditionals.
5. **File I/O** — repeatedly writing to and reading from a large file.

## Benchmarking Process

Each function was run once as a warm-up to reduce noise and caching effects. `timeit.repeat()` then produced independent timing samples with `number=1` for *r* = 5 repetitions. From the samples *t₁, t₂, …, tᵣ*, the mean and standard deviation were computed as:

$$\bar{t} = \frac{1}{r}\sum_{i=1}^{r} t_i \qquad \sigma = \sqrt{\frac{1}{r}\sum_{i=1}^{r}\left(t_i - \bar{t}\right)^2}$$

The same `benchmark_func()` routine was applied to every workload.

## Results

| Function | Python mean (s) | Python σ | Rust (PyO3) mean (s) | Rust σ | Faster |
|---|---|---|---|---|---|
| Arithmetic operations | 0.971004 | 0.006519 | 0.455470 | 0.001698 | **Rust (~2.1×)** |
| String processing | 0.611439 | 0.004426 | 4.938672 | 0.012465 | Python |
| List manipulation | 0.048115 | 0.000439 | 0.072411 | 0.000854 | Python |
| File I/O | 0.674027 | 0.009163 | 2.539615 | 0.030167 | Python |
| Number to name (if-else) | 3.340496 | 0.007858 | 6.835317 | 0.071374 | Python |

### Analysis

- **Arithmetic / CPU-bound loops** — Rust finished in roughly half the time, benefiting from tight native loops and no interpreter overhead.
- **Strings and lists** — Python won. Its built-ins are heavily optimised C, while the Rust side pays for repeated allocations and Python↔Rust data conversion (string marshalling, vector conversion).
- **Number → name** — the widest gap in Python's favour; the Rust version builds many intermediate strings, while Python benefits from fast string formatting and dictionary operations.
- **File I/O** — favoured Python in this environment, and is highly sensitive to WSL file buffering and disk access.
- **Stability** — Python showed lower variance on most tasks; Rust varied more on file I/O and strings (allocation and WSL system overhead). Both were very stable on arithmetic.

## Conclusion

Embedding Rust through PyO3 pays off for CPU-heavy, arithmetic and loop-based work, thanks to compiled execution and efficient memory management. For operations that lean on Python's optimised built-ins — strings and lists — the cross-language overhead makes embedded Rust slower, and file I/O results depend heavily on the execution environment.

The practical takeaway is **selective hybridisation**: keep Python for orchestration and high-level operations, and move genuine compute bottlenecks to Rust. That keeps Python's productivity while gaining performance and, through fewer CPU cycles, better energy efficiency.

## Future Work

- Go beyond raw benchmarking with profiling, tuning and compiler optimisations.
- Build tooling that automates Python–Rust module generation, dependency tracking and builds.
- Validate the approach in real-world systems — data pipelines, scientific computing, web and automation workloads.
- Re-run on native Linux to rule out WSL overhead, and add memory-consumption and multi-core benchmarks.

## Citation

```text
S. Singh and R. Raj, "Benchmarking Python–Rust Integration for High-Performance Computing Tasks,"
International Journal for Multidisciplinary Research (IJFMR), vol. 8, no. 4, Jul.–Aug. 2026,
doi: 10.36948/ijfmr.2026.v08i04.86497.
```

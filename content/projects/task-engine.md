---
title: Distributed Task Engine
date: Apr 2024
github: https://github.com/srikant-siddhiyoga/distributed-task-engine
status: Production
tags: [Python, Django, Celery, RabbitMQ, Docker Compose, PostgreSQL, Redis, Prometheus, Grafana]
---

## Overview

This project replaces a fragile collection of ad-hoc cron jobs and synchronous API calls that were causing timeout errors and data inconsistency in a multi-tenant SaaS application. The new system processes over 50,000 background tasks daily with guaranteed at-least-once delivery, idempotent execution, and end-to-end observability.

## Architecture

```
  HTTP Request
       │
  ┌────▼──────────┐
  │  Django API   │  ← enqueues tasks
  └────┬──────────┘
       │  AMQP
  ┌────▼──────────┐
  │   RabbitMQ    │  ← durable queues, dead-letter exchange
  └────┬──────────┘
       │
  ┌────▼─────────────────────────────────┐
  │           Celery Workers              │
  │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
  │  │  email  │ │ export  │ │ml-infer ││
  │  └─────────┘ └─────────┘ └─────────┘│
  └────────────────────┬─────────────────┘
                       │
  ┌────────────────────▼──────────────────┐
  │   PostgreSQL (task log & audit trail) │
  └───────────────────────────────────────┘
  Prometheus scrapes workers → Grafana
```

## Key Design Decisions

**Dead-letter exchange** — tasks that fail three times are routed to a dead-letter queue rather than silently dropped, enabling manual re-inspection and replay.

**Idempotency keys** — every task accepts an `idempotency_key`. Before execution, workers check a Redis set; duplicate keys are acknowledged immediately without re-running logic.

**Priority queues** — three queues (`critical`, `default`, `bulk`) bound to separate worker pools so export spikes cannot starve user-facing email dispatch.

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| Worker OOM on large exports | `soft_time_limit` + custom SIGTERM handler |
| Queue saturation on fan-out | `chord` + `rate_limit` on bulk tasks |
| Lost tasks during restart | RabbitMQ durable queues + `acks_late=True` |

## Results

- **Daily task volume:** 52,000+ tasks/day
- **Failure rate:** < 0.3%
- **Mean task latency (p50):** 1.2 s email / 4.8 s ML inference
- **Observability:** Full Grafana dashboard — queue depth, worker saturation, error rate

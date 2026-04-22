---
title: "HLD Prep Plan \u2014 AI Systems Focus"
summary: "A structured 8-week prep plan covering the 13 core HLD topics you listed \u2014 each one reframed through the lens of modern AI infrastructure: LLM inference, RAG pipelines, agentic sys..."
topic: prep-plans
legacyPath: "prep-plans/AI Systems Prep Plan.html"
tags: ["prep", "systems", "interview"]
date: 2026-04-22
updated: 2026-04-22
status: evergreen
pinned: false
public: true
---
# High-Level Design. 
 For AI-native engineers.

A structured 8-week prep plan covering the 13 core HLD topics you listed — each one reframed through the lens of modern AI infrastructure: LLM inference, RAG pipelines, agentic systems, GPU autoscaling, and observability for non-deterministic workloads. Every topic has curated resources (books, blogs, YouTube, papers, docs), an AI-specific angle, and interview questions to self-test against.

## Table of contents

- 01 Language & Concurrency ⌃ AI

- 02 CI/CD for AI Systems ⌃ AI

- 03 Observability & Dashboards ⌃ AI

- 04 Databases — Partition, Shard, Tune ⌃ AI

- 05 Kubernetes & GPU Autoscaling ⌃ AI

- 06 Load Balancers ⌃ AI

- 07 Rate Limiting — Leaky Bucket et al. ⌃ AI

- 08 Idempotency ⌃ AI

- 09 Caching & Invalidation ⌃ AI

- 10 Distributed Systems ⌃ AI

- 11 Event-Driven — Kafka, RabbitMQ ⌃ AI

- 12 DNS & CDN ⌃ AI

- 13 RPC & gRPC ⌃ AI

- 14 AI Add-on — RAG, Serving, Agents ⌃ NEW

- 15 8-Week Schedule ⌃ PLAN

- 16 Practice Problems ⌃ MOCK

## The plan, in four phases

Treat this like a curriculum. Don't jump ahead — each phase assumes comfort with the previous. Phase 1 gives you the vocabulary; Phase 2 gives you the plumbing; Phase 3 makes it scale; Phase 4 is where you combine everything into full AI systems you can defend in an interview.

Concurrency is the first filter in HLD interviews. Expect questions on goroutines vs threads, async/await, GIL behaviour, channels, mutexes, context cancellation, and how your language model handles backpressure. For AI systems specifically: async I/O matters enormously because LLM calls are slow (seconds) and parallel tool calls are common.

- Processes vs threads vs coroutines

- Shared memory vs message passing

- Mutex, semaphore, RWLock, atomic ops

- Channels (Go), Futures (Rust), Promises (JS)

- Actor model (Erlang, Akka)

- Context cancellation, deadlines, timeouts

- Deadlock, livelock, starvation

- Race conditions, memory visibility, reordering

- Thread pool exhaustion under slow I/O

- Python GIL — when it hurts, when it doesn't

- Async-over-sync contamination ("coloured functions")

- Goroutine leaks from un-cancelled contexts

- Book Concurrency in Go — Katherine Cox-Buday O'REILLY →

- Book Designing Data-Intensive Applications, Ch. 7 & 8 — Martin Kleppmann DDIA →

- Video Rob Pike — Concurrency Is Not Parallelism YOUTUBE →

- Blog What Color Is Your Function? — Bob Nystrom (on async) READ →

- Docs Python asyncio patterns & pitfalls DOCS →

- Hands-on Build: concurrent LLM fan-out with timeouts + semaphore + error aggregation YOUR CODE

Classic CI/CD is well-trodden. The AI twist is: what do you test when the output is probabilistic? Canary by eval score, shadow deployments, prompt versioning, model rollbacks, and feature-flagged prompts are all fair game.

- Build, test, lint, SAST, SCA stages

- Matrix builds, caching, artefact stores

- Trunk-based vs GitFlow

- PR-preview environments

- Blue/green, canary, rolling, recreate

- Feature flags (LaunchDarkly, Unleash)

- GitOps with ArgoCD / Flux

- Progressive delivery (Flagger, Argo Rollouts)

- Book Continuous Delivery — Humble & Farley (the canonical text) SITE →

- Blog Google SRE Workbook — chapter on canarying releases READ →

- Blog Martin Fowler — Continuous Delivery for ML (CD4ML) READ →

- Blog Chip Huyen — CI/CD for machine learning HUYENCHIP →

- Video ArgoCD GitOps in 100 seconds & full walkthrough — TechWorld with Nana YOUTUBE →

- Docs Argo Rollouts — analysis-based promotion DOCS →

- Hands-on Build: GitHub Actions pipeline that runs LLM evals on PR & blocks merge on regression YOUR CODE

The three pillars: metrics, logs, traces. Interviewers want to hear you say Prometheus + Grafana for metrics, OpenTelemetry for traces, Loki / ELK for logs. For AI: you also need per-request token counts, TTFT, p95 generation latency, KV-cache utilisation, and quality metrics (hallucination rate, groundedness). Lookover's whole thesis sits here.

- Book Observability Engineering — Majors, Fong-Jones, Miranda (Honeycomb) O'REILLY →

- Blog Zerodha — Monitoring stack with Prometheus, Grafana, VictoriaMetrics READ →

- Blog Monitor LLM inference with Prometheus & Grafana (vLLM, TGI, llama.cpp) READ →

- Video Prometheus + Grafana crash course — TechWorld with Nana YOUTUBE →

- Docs OpenTelemetry — concepts & semantic conventions for GenAI DOCS →

- Docs Langfuse — open-source LLM observability DOCS →

- Hands-on Build: vLLM + Prometheus + Grafana locally; design a dashboard for one model YOUR CODE

This is a multi-topic, high-yield area. You need to distinguish partitioning (logical split within one DB) from sharding (horizontal split across nodes), speak fluently about tuning, and for AI systems specifically — vector databases, hybrid search, and why pgvector-on-Postgres vs a dedicated vector DB matters.

- Range (date-based — most common)

- List (discrete values: region, tenant)

- Hash (uniform distribution)

- Composite (range + hash)

- Partition pruning — query only relevant chunks

- Parallel query plans

- Drop old partitions for archival (fast!)

- Index size stays manageable

Key decisions: shard key (avoid hotspots), resharding strategy (consistent hashing vs range splits), cross-shard queries (scatter-gather or avoid). Know Vitess (MySQL), Citus (Postgres), MongoDB native sharding, and how Discord reshards.

You asked specifically for the Zerodha Postgres blog. Here it is, plus more.

- Blog Zerodha — Scaling with common sense — Kailash Nadh READ →

- Blog Zerodha — Working with PostgreSQL (the definitive tuning post) READ →

- Blog Zerodha — 7M Postgres tables reporting hack READ →

- Video Kailash Nadh — Scaling 7M+ Postgres Tables (talk) YOUTUBE →

- Book Designing Data-Intensive Applications, Ch. 5 & 6 — Martin Kleppmann DDIA →

- Blog Use the Index, Luke — the practical SQL index guide READ →

- Blog Discord — How we reshard trillions of messages READ →

- Docs pgvector — HNSW & IVFFlat index docs GITHUB →

- Paper HNSW: Efficient & robust approximate nearest neighbour search — Malkov & Yashunin ARXIV →

- Hands-on Build: partition a time-series table in pg, run EXPLAIN ANALYZE before/after YOUR CODE

Classic K8s topics: Deployments, Services, Ingress, ConfigMaps, probes, HPA. For AI: GPU scheduling, MIG (multi-instance GPU), KEDA for scale-to-zero, and DCGM metrics. This is the hottest intersection in interviews right now — GPU-aware autoscaling is a real skill gap in the market.

- Pod / Deployment / StatefulSet / DaemonSet

- Service types: ClusterIP, NodePort, LoadBalancer

- Ingress + ingress controllers (nginx, traefik)

- Liveness, readiness, startup probes

- Resource requests vs limits, QoS classes

- RollingUpdate strategy, maxSurge, maxUnavailable

- Pod Disruption Budgets (PDBs)

- PodAntiAffinity for HA

- NetworkPolicies for zero-trust

- ServiceAccounts + RBAC

- Secrets (sealed-secrets or external-secrets)

- Graceful shutdown + preStop hooks

For practice, minikube or kind is sufficient — but if you want to touch GPUs locally, use kind with the NVIDIA device plugin or just run vLLM in Docker with --gpus all. For production-like labs, GKE, EKS and AKS all have free-tier-ish GPU nodes.

HPA scales on CPU/memory. For AI, that's useless. Your LLM pod is GPU-bound and queue-bound. You need KEDA with Prometheus-based triggers.

- Book Kubernetes in Action — Marko Lukša (the definitive book) MANNING →

- Video Kubernetes full course — TechWorld with Nana (free, 4+ hours) YOUTUBE →

- Blog Deploying LLMs on Kubernetes: vLLM, Ray Serve & GPU scheduling (2026) READ →

- Blog Autoscaling K8s GPU workloads — a complete production guide MEDIUM →

- Blog Auto-scaling GPU inference pods with KEDA + cost guards READ →

- Docs KEDA — scalers catalogue (Prometheus, Kafka, HTTP, RabbitMQ…) DOCS →

- Docs NVIDIA DCGM exporter — GPU metrics for Prometheus GITHUB →

- Hands-on Build: deploy vLLM on minikube/kind with HPA on a custom metric YOUR CODE

L4 vs L7. Algorithms (round-robin, least-conns, weighted, consistent hashing, EWMA). Health checks. Session affinity. For AI: least-request balancing is rarely right for LLM servers — you need KV-cache-aware routing because directing a conversation continuation to a worker that already has the prefix cached is an order-of-magnitude latency win.

- L4 (TCP/UDP) — HAProxy, AWS NLB

- L7 (HTTP) — nginx, Envoy, Traefik, AWS ALB

- DSR (direct server return)

- GSLB — global/geo-based (covered in DNS)

- Service mesh sidecar LB (Envoy via Istio/Linkerd)

- Round-robin, weighted round-robin

- Least connections, least response time

- IP hash / consistent hashing (sticky)

- Power-of-two-choices (P2C)

- EWMA (exponentially-weighted moving average)

- Blog Cloudflare — Load balancing at the edge (technical deep dive) BLOG →

- Blog Netflix — Rethinking Netflix's Edge Load Balancing READ →

- Video System Design — L4 vs L7 Load Balancers — ByteByteGo YOUTUBE →

- Docs Envoy Proxy — HTTP load balancing configuration DOCS →

- Blog The New Stack — Six frameworks for efficient LLM inferencing (covers routing) READ →

- Paper The Power of Two Choices in Randomized Load Balancing — Mitzenmacher PDF →

Know all five classic algorithms: fixed window, sliding window, sliding window log, token bucket, leaky bucket. Know where you apply them (client, edge, service, DB). For AI systems, rate-limit by tokens, not just requests — otherwise one 100k-token prompt can starve a thousand small ones.

- Blog Stripe — Scaling your API with rate limiters READ →

- Blog Figma — An alternative approach to rate limiting READ →

- Video Rate Limiting Fundamentals — System Design Interview (Alex Xu/ByteByteGo) YOUTUBE →

- Blog Cloudflare — How we built rate limiting capable of scaling to millions READ →

- Docs OpenAI cookbook — how to handle rate limits COOKBOOK →

- Hands-on Build: token-bucket rate limiter in Redis that rate-limits by estimated LLM tokens YOUR CODE

Idempotency keys, dedup windows, retries with exponential backoff + jitter, at-least-once vs exactly-once semantics. Every payment system you've built at DodoPayments lives or dies by this. For AI: agents retry tool calls constantly, and a non-idempotent "send email" tool is a disaster waiting to happen.

- Generate idempotency-key on the client

- Include in request header (e.g. Idempotency-Key )

- Retry with same key on failure

- Dedup store (Redis, DynamoDB) with TTL

- Unique constraint at DB level as backstop

- Outbox pattern for transactional publishing

- Transactional inbox for consumers

- Blog Stripe — Designing robust and predictable APIs with idempotency READ →

- Blog Brandur Leach — Implementing Stripe-like idempotency keys in Postgres READ →

- Blog Microservices.io — Transactional outbox & inbox patterns READ →

- Video Designing for failure: exactly-once semantics explained — Arjan Codes / ByteByteGo YOUTUBE →

Read-through, write-through, write-behind, cache-aside. TTL vs LRU vs LFU eviction. Stampede (thundering herd) prevention. For AI: two massive wins — prompt caching (Anthropic & OpenAI both expose it) and semantic caching (embed the query, look up near-matches, return cached response if cosine similarity > threshold).

The two hardest things in CS are cache invalidation, naming things, and off-by-one errors. Strategies: TTL (lazy), event-driven invalidation (publish change events), versioned keys (bump version on write), write-through (trivially consistent but slow).

- Book Designing Data-Intensive Applications, Ch. 3 — Martin Kleppmann DDIA →

- Blog Facebook — Scaling Memcache at Facebook (classic paper-blog) READ →

- Blog Redis — Client-side caching & invalidation DOCS →

- Blog Anthropic — Prompt caching (official guide) DOCS →

- Blog Semantic caching in LLM pipelines — Redis blog READ →

- Video Cache patterns explained — ByteByteGo YOUTUBE →

- Hands-on Build: semantic cache with Redis + pgvector, measure hit rate on real prompts YOUR CODE

The broadest topic. CAP, PACELC, consistency models, consensus (Raft, Paxos), leader election, replication, 2PC/3PC/sagas, vector clocks, CRDTs. This is the "speak the language fluently" topic — you won't be asked to implement Raft, but you must reason about what breaks when a network partitions during your RAG write.

- CAP & PACELC theorem

- Consistency: linearizable, sequential, causal, eventual

- Consensus: Raft, Paxos, ZAB (roughly, when to use)

- Leader election vs leaderless (Dynamo-style)

- Quorum reads/writes (W + R > N)

- Sagas (orchestration vs choreography)

- Two-phase commit & why it's rare

- Outbox pattern & change data capture (CDC)

- Distributed tracing & clock skew (Lamport, vector clocks)

- Partition tolerance strategies: retries, hedging, fallback

- Book Designing Data-Intensive Applications — Martin Kleppmann (the entire book) DDIA →

- Book Understanding Distributed Systems — Roberto Vitillo SITE →

- Video MIT 6.824 Distributed Systems lectures — Robert Morris (free on YT) YOUTUBE →

- Paper In Search of an Understandable Consensus Algorithm (Raft) PDF →

- Paper Dynamo: Amazon's Highly Available Key-value Store PDF →

- Blog Jepsen — consistency analyses (the gold standard) JEPSEN →

- Docs Temporal — durable execution for agents & workflows DOCS →

Kafka and RabbitMQ solve different problems. Kafka is a distributed log — durable, replayable, high throughput, good for streams and CDC. RabbitMQ is a message broker — flexible routing, lower throughput, good for task queues. For AI workloads: Kafka for ingestion & evaluation streams, RabbitMQ (or SQS) for inference task queues.

- Book Kafka: The Definitive Guide — Shapira et al. (O'Reilly) O'REILLY →

- Blog Confluent — Kafka fundamentals & design patterns CONFLUENT →

- Video Apache Kafka in 6 minutes + deep dives — ByteByteGo YOUTUBE →

- Blog RabbitMQ vs Kafka — when to use which — Jack Vanlightly READ →

- Docs RabbitMQ — work queues tutorial DOCS →

- Blog Uber — Real-time data infrastructure with Kafka READ →

- Hands-on Build: RAG ingestion pipeline — upload → RabbitMQ → worker → pgvector YOUR CODE

DNS: recursive resolvers, authoritative, TTL, DNS-based load balancing (GeoDNS), anycast. CDNs: edge vs origin, cache-control, origin shield, signed URLs, Workers/edge functions. For AI: edge inference is becoming real (Cloudflare Workers AI, Vercel AI SDK on edge). Know it.

- Record types (A, AAAA, CNAME, MX, TXT, SRV)

- Recursive vs iterative resolution

- TTL trade-offs (low = flexibility, high = resilience)

- GeoDNS / latency-based routing (Route53, NS1)

- Anycast for global presence

- Cache-Control, Surrogate-Control, ETag

- Origin shield, tiered caching

- Stale-while-revalidate, stale-if-error

- Signed URLs for private assets

- Edge functions (Cloudflare Workers, CloudFront Functions)

- Video DNS explained in depth — Julia Evans (zines + blog) READ →

- Blog Cloudflare Learning Center — DNS, CDN, anycast (free, excellent) LEARN →

- Blog High Scalability — How CDNs work at scale BLOG →

- Docs Cloudflare Workers AI — LLMs at the edge DOCS →

- Video CDN Design — ByteByteGo YOUTUBE →

REST vs gRPC vs GraphQL vs tRPC. Know when gRPC wins: internal service-to-service, streaming, strict typing, polyglot. Protobuf schema evolution. Interceptors, deadlines, metadata. For AI: server-sent events (SSE) and gRPC streams for token streaming; Model Context Protocol (MCP) is the new standard for tool calls.

- Book gRPC: Up and Running — Kasun Indrasiri (O'Reilly) O'REILLY →

- Video gRPC vs REST — which one should you use? — ByteByteGo YOUTUBE →

- Docs gRPC official — concepts, streaming, interceptors DOCS →

- Docs Model Context Protocol (MCP) — Anthropic spec MCP →

- Blog Netflix — gRPC at Netflix (service mesh + observability) READ →

You said "tweak the plan around AI" — this entire section is the tweak. GenAI/LLM system design is now a standalone interview category at OpenAI, Anthropic, Google, Meta, and every startup hiring AI engineers. Three sub-topics: LLM serving, RAG, and agents.

Know the landscape: vLLM (open-source, PagedAttention, highest throughput), TensorRT-LLM (NVIDIA, best perf on their hardware), Hugging Face TGI (ecosystem integration), SGLang (structured generation, prefix caching), llama.cpp / Ollama (local & edge). Key concepts: continuous batching, PagedAttention, speculative decoding, tensor parallelism, prefill/decode disaggregation.

End-to-end pipeline: parse → chunk → embed → store → retrieve → rerank → prompt → generate. For each stage, know 2–3 options and their trade-offs. Chunking strategy is where most RAG systems die — semantic chunking beats fixed-size for most document types but costs more. Always implement hybrid search (BM25 + vector) + reranking.

An agent is an LLM with an execution loop, tools, memory, and guardrails. The LLM is ~20% of the system — the rest is infrastructure: orchestrator (LangGraph, custom), tool registry, sandbox, policy engine, observability. This is squarely in Lookover's wheelhouse — and your Claude dossier on the LangGraph automation stack reflects exactly the right mental model.

- Book Designing Machine Learning Systems — Chip Huyen (O'Reilly, 2022) O'REILLY →

- Book AI Engineering: Building Applications with Foundation Models — Chip Huyen (O'Reilly, 2024) O'REILLY →

- Blog Chip Huyen — huyenchip.com (entire blog) BLOG →

- Blog Eugene Yan — Patterns for building LLM-based systems & products READ →

- Blog Lilian Weng — LLM Powered Autonomous Agents (the canonical post) READ →

- Blog Anthropic — Building effective agents ANTHROPIC →

- Blog Generative AI System Design Interview Guide 2026 — PracHub READ →

- Blog IGotAnOffer — GenAI system design interview (examples & framework) READ →

- Blog Agentic AI System Design Interview Guide 2026 MEDIUM →

- Docs vLLM documentation — PagedAttention, continuous batching, serving DOCS →

- Blog Best LLM Inference Engines 2026 — vLLM, TensorRT-LLM, TGI, SGLang READ →

- Paper Efficient Memory Management for LLM Serving with PagedAttention — Kwon et al. (vLLM paper) ARXIV →

- Paper Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks — Lewis et al. ARXIV →

- Paper ReAct: Synergizing Reasoning and Acting in Language Models ARXIV →

- Video Andrej Karpathy — Let's build a GPT + Deep Dive into LLMs YOUTUBE →

- Video Full-stack LLM Bootcamp — Charles Frye et al. (free) FSDL →

- Hands-on Build: end-to-end RAG on your Lookover compliance docs — measure precision@k YOUR CODE

## The 8-week schedule

Aim for ~10 hours a week: 5 hours reading/watching, 3 hours hands-on building, 2 hours mock interviewing (out loud, whiteboard on paper). If 10h/week is too much, stretch to 12 weeks — don't compress below 8.

- Read DDIA ch. 7–8

- Watch Rob Pike concurrency

- Build: concurrent LLM fan-out

- Mock: "design a URL shortener"

- Start MIT 6.824 lectures 1–4

- Read CAP, PACELC, Dynamo paper

- gRPC tutorial + MCP spec

- Mock: "design a chat system"

- Zerodha Postgres blog trio

- DDIA ch. 5–6 (replication, partitioning)

- pgvector hands-on

- Mock: "design news feed storage"

- Stripe rate limits & idempotency posts

- Facebook memcache paper

- Build: semantic cache prototype

- Mock: "design payment processor"

- Nana K8s crash course

- PreMAI LLM-on-K8s guide

- Build: vLLM on minikube + HPA

- Mock: "design YouTube video upload"

- Martin Fowler CD4ML

- Observability Engineering (skim)

- Kafka fundamentals

- Mock: "design Twitter/X timeline"

- Chip Huyen — AI Engineering ch. 4–8

- vLLM paper + docs

- Build: RAG over your own docs

- Mock: "design a doc-QA chatbot"

- Lilian Weng agents post

- Anthropic building-effective-agents

- 5× 45-min mock interviews

- Write your own Lookover design doc

## 30 practice problems

Drill these over weeks 4–8. Pick one, give yourself 45 minutes, whiteboard it, talk it out loud (record yourself if possible), then compare against a reference answer. The AI-specific ones marked ⌃ are the highest-yield for the roles you're targeting.

### Classic HLD warm-ups (weeks 1–4)

- Design a URL shortener (bit.ly). Handle 100B URLs.

- Design a distributed rate limiter using Redis. Support sliding window & token bucket.

- Design a news feed system (Twitter/X style).

- Design a payment processor with strict idempotency.

- Design a typeahead/autocomplete service.

- Design a notification system (email + push + SMS, retries, dedup).

- Design a metrics/monitoring system like Datadog at small scale.

- Design a distributed cache (write-through, invalidation, consistency).

- Design a job scheduler like cron-at-scale.

- Design a chat system with read receipts & presence.

### AI-focused designs (weeks 5–8) ⌃ HIGH YIELD

- Design an LLM inference serving layer for an open-source 70B model. Target 1000 concurrent users, p95 TTFT < 1s.

- Design a RAG system over 10M enterprise documents. Handle daily updates.

- Design a semantic cache in front of the OpenAI API. Target 30% cost reduction.

- Design an agentic workflow orchestrator (Temporal-style) for LLM agents with tool use.

- Design an LLM evaluation & observability platform (i.e. Lookover). Cover tracing, evals, alerts.

- Design a multi-tenant vector search service with per-tenant isolation and quotas.

- Design a fine-tuning pipeline: data prep → training job → eval → deploy.

- Design a prompt management system with versioning, A/B testing, and rollback.

- Design an image-generation service (Midjourney-lite). Handle queues, priority tiers, NSFW filtering.

- Design an AI-powered code review bot that scales to 1000 repos.

- Design a real-time voice assistant with sub-500ms round-trip latency.

- Design a GPU cluster autoscaler that balances cost vs latency for fluctuating traffic.

- Design a guardrails system that sits between users & an LLM. PII redaction, jailbreak detection, output filtering.

- Design an LLM gateway/proxy with rate limiting, key rotation, and cost tracking across providers.

- Design an EU AI Act compliance evidence-collection pipeline (hi there, Lookover).

- Design an embeddings refresh system — detect drift, re-embed, migrate indexes without downtime.

- Design a distributed training job scheduler for multi-node LLM fine-tunes.

- Design an LLM-as-a-service API platform (OpenRouter/Fireworks style).

- Design an AI workflow testing framework — deterministic replay of LLM interactions.

- Design a model registry with lineage, evals, and staged promotion (staging → canary → prod).

## Three rules that'll separate you

- "~1000 QPS" not "high traffic"

- "p95 latency < 200ms" not "fast"

- "$2/1k tokens input, $6/1k output" not "expensive"

- "KV cache ≈ 2 × num_layers × hidden_size × seq_len × bytes" → know approximate memory for 7B / 70B

- "Using semantic cache — trades freshness for cost & latency"

- "Prefill/decode disaggregation — more complex but better throughput"

- "KEDA scale-to-zero — saves cost but adds cold start"

- "Hybrid search — better recall but higher latency and cost"

# EchoCourt — An Adversarial Multi-Agent Legal Research Platform with Verifiable Citation Provenance

## What It Does & The Real-World Problem

Legal research AI tools (Harvey, CoCounsel, Paxton) have a dirty secret: they hallucinate citations. A 2023 Stanford study found general-purpose LLMs hallucinate legal information 58–82% of the time, and even "legal-specific" tools hallucinate 17–33% of queries. The *Mata v. Avianca* fiasco — where a lawyer was sanctioned for citing fake ChatGPT cases — is now a teaching staple, and it keeps happening in 2025–2026.

**EchoCourt** is a multi-agent legal research system that answers complex legal questions by running two adversarial agent teams — a **Prosecution agent** and a **Defense agent** — that must each build arguments grounded in real case law, then face off before a **Judge agent** that scores their reasoning. Every single citation is verified against the actual CourtListener / Caselaw Access Project corpus before it can be used. If an agent tries to cite a case that doesn't exist, or misrepresents its holding, the citation is rejected in-flight and the agent must reason again.

The killer feature: **verifiable citation provenance**. Every claim in the final memo is linked to (a) the exact paragraph of the source opinion, (b) a similarity score between the claim and the source, and (c) a "faithfulness" eval result. The user gets a legal memo they can actually trust — and an auditable trail of *why* to trust it.

This solves a concrete problem: small law firms and solo practitioners can't afford $100/seat/month Harvey subscriptions, and even if they could, they still can't trust the output. EchoCourt is the "show your work" version.

## Why This Stands Out in 2026

Most AI-engineering portfolio projects in 2025 were RAG-over-PDFs chatbots. In 2026, hiring managers have seen thousands of those. EchoCourt is different because it hits four things that are genuinely hard and genuinely in demand:

1. **Adversarial multi-agent orchestration** (not just "chain a few prompts" — actual competing agents with separate memory, tool access, and scoring).
2. **Grounded generation with hallucination guardrails** enforced at the tool layer, not the prompt layer.
3. **A real eval harness** that measures faithfulness, citation accuracy, and legal reasoning quality — not just "did it run."
4. **LLMOps rigor**: tracing, cost attribution per agent, eval-gated deploys, drift detection.

## Hugging Face Tasks Integrated

- **Sentence Similarity** — for matching user queries and agent claims to paragraphs in case opinions (using `nlpaueb/legal-bert-base-uncased` or `law-ai/InLegalBERT` as the embedding backbone for a legal-domain-tuned retriever).
- **Text Ranking** — a cross-encoder reranker (e.g., `BAAI/bge-reranker-v2-m3`) sits on top of the initial pgvector recall to push the most jurisdictionally-relevant opinions to the top.
- **Zero-Shot Classification** — to route queries into legal domains (contracts / torts / IP / employment / constitutional) so the right sub-corpus and the right specialist agent prompt is loaded.
- **Question Answering** (extractive) — a fine-tuned `deepset/roberta-base-squad2`-style head is used *inside the citation verifier*: given a claim and a candidate source paragraph, does the paragraph actually support the claim? This is the hallucination gate.
- **Summarization** — a legal-tuned summarizer (e.g., `pegasus-legal` or a fine-tuned `bart-large-cnn`) produces the final memo and executive summary from the judge's ruling.
- **Token Classification (NER)** — extracts case names, statute citations, judge names, and dates from agent output so they can be cross-checked against the ground-truth corpus.

## Recommended Tech Stack

**Orchestration & Agents**
- **LangGraph** for the adversarial state machine (Prosecution → Defense → Rebuttal → Judge). LangGraph's explicit state graph is a better fit than LangChain agents here because the control flow is deterministic and cyclical.
- **LangChain** only for retriever and tool primitives — not for orchestration.
- Separate agent "personas" with isolated short-term memory and shared read-only case-law memory.

**Retrieval**
- **PostgreSQL + pgvector** as the primary vector store — 10M+ opinion paragraphs. Chosen over Pinecone because legal work needs hybrid search (vector + structured filters on jurisdiction, court level, date, citation count) and pgvector + SQL wins decisively here. Cost also matters for a solo-dev portfolio project.
- **BM25 (via Postgres `tsvector` or OpenSearch)** running in parallel — reciprocal rank fusion combines lexical and semantic hits. Legal research is notoriously bad for pure semantic search because exact statute numbers matter.
- **Cross-encoder reranker** as stage 2.
- **LlamaIndex** for ingestion pipelines only (its document parsers and hierarchical node structures are genuinely good for court opinions with nested headers, footnotes, and dissents).

**Models**
- Claude Opus 4.7 or GPT-5 for the Judge agent (needs strongest reasoning).
- Claude Sonnet 4.6 for Prosecution/Defense (faster, cheaper, still sharp).
- Haiku 4.5 for routing, NER, and citation-verification calls (high-volume, latency-sensitive).
- Local Hugging Face models for embeddings, reranking, and extractive QA (runs on a single GPU, keeps inference cost near zero).

**Data Sources (real APIs)**
- **CourtListener API** (Free Law Project) — 9M+ US federal and state opinions, citation graph included.
- **Caselaw Access Project** (Harvard) — 6.7M historical cases.
- **CourtListener RECAP** — federal filings.
- **GovInfo API** — statutes and regulations.

**Evaluation & LLMOps**
- **Ragas** for faithfulness, answer relevancy, context precision/recall.
- **DeepEval** for custom legal-reasoning metrics (citation accuracy, holding accuracy, jurisdictional correctness).
- **LangSmith** or **Phoenix (Arize)** for distributed tracing across agents. (Given your Lookover work, this is a natural place to dogfood your own observability layer — a strong narrative for interviews.)
- **Giskard** for red-teaming the agents with adversarial legal prompts.
- **A custom eval set** of 200 hand-curated legal questions with ground-truth citations — this is the unsexy work that makes the project credible.

**Infrastructure**
- **Modal** or **Runpod** for GPU inference of the HF models.
- **Supabase** for auth, Postgres (pgvector), and realtime (you already use this).
- **DodoPayments** for the monetized tier (you already use this).
- **GitHub Actions** for eval-gated CI — if faithfulness drops below 0.85 on the regression set, the PR fails.

## How This Maps to Real 2026 AI Engineering JDs

Pulling from actual current postings at Anthropic, Harvey, Scale, Hebbia, and mid-stage AI startups:

- *"Experience with RAG systems at scale"* → Hybrid retrieval over 10M+ documents with reranking.
- *"Multi-agent orchestration"* → LangGraph adversarial state machine with judge arbitration.
- *"LLM evaluation frameworks"* → Ragas + DeepEval + custom legal metrics + eval-gated CI.
- *"Hallucination mitigation"* → Tool-layer citation verification via extractive QA, not just "add a disclaimer."
- *"Production LLMOps"* → Distributed tracing, per-agent cost attribution, drift detection, regression eval harness.
- *"Domain-specific fine-tuning or adaptation"* → Legal-BERT embeddings + domain reranker.
- *"Work with real-world messy data"* → CourtListener opinions are a genuinely nasty corpus (scanned OCR, inconsistent formatting, nested dissents).

## Resume-Ready Impact Metrics

Design the project so you can credibly report numbers like these — the eval harness makes them real, not vibes:

- "Reduced citation hallucination rate from 31% (GPT-4 baseline) to <2% via tool-layer verification against a 9M-opinion corpus."
- "Built hybrid retrieval (pgvector + BM25 + cross-encoder reranker) achieving 0.87 context precision@5 on a 200-question legal benchmark — 34% better than dense-only baseline."
- "Orchestrated a 4-agent adversarial workflow in LangGraph with per-agent cost attribution; average query resolved in 47s at $0.23 blended cost vs. $1.10 for a single Opus call at comparable quality."
- "Shipped eval-gated CI with Ragas faithfulness + custom legal metrics; caught 12 regressions across 40 PRs before merge."
- "Designed a 10M-vector pgvector schema with jurisdictional metadata filters, sustaining p95 retrieval latency of 180ms."

## Portfolio Value & Narrative

For a SWE pivoting in, this project tells a story no bootcamp grad can tell: *"I don't just call LLMs — I build systems that make LLMs trustworthy in a domain where being wrong has real consequences."* The adversarial-agents framing is memorable in interviews (it's a 30-second pitch), the eval harness demonstrates engineering maturity, and the CourtListener integration shows you can work with real, messy data rather than a toy corpus.

## Feasibility for 1–3 Months Solo

Rough cut, assuming ~15 hrs/week:

Weeks 1–2: CourtListener ingestion, pgvector schema, hybrid retrieval baseline.
Weeks 3–4: Single-agent RAG with citation verifier; build the 200-question eval set (this is the boring-but-critical week).
Weeks 5–6: LangGraph multi-agent workflow — Prosecution, Defense, Judge.
Weeks 7–8: Reranker, domain router, NER verifier, Ragas + DeepEval integration.
Weeks 9–10: LangSmith tracing, cost attribution, eval-gated CI, simple Next.js frontend.
Weeks 11–12: Polish, write a technical blog post, record a 3-minute demo video, ship.

Aggressive but doable, especially given your existing LangGraph familiarity from the Lookover agent stack — you'd be reusing patterns, not learning from scratch.

---

Want me to go deeper on any piece — the eval harness design, the LangGraph state machine, the citation-verifier architecture, or the ingestion pipeline for CourtListener? The eval harness is usually where these projects live or die, and it's also the part that most portfolio projects skip, so it's the highest-leverage place to invest.

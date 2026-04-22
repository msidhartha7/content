---
title: "EU AI Act \u00b7 Article 9 Compliance \u00b7 LangGraph/LangChain Proposal"
summary: "A technical proposal for building a continuous, documented risk management system into LangGraph and LangChain agents \u2014 satisfying all ten paragraphs of Article 9 of Regulation (EU..."
topic: ai-regulation
legacyPath: "ai-regulation/EU AI Act Article 9 Langgraph Proposal.html"
tags: ["ai-act", "langgraph", "compliance"]
date: 2026-04-12
updated: 2026-04-12
status: evergreen
pinned: true
public: true
---
# EU AI ACT 
 ARTICLE 9 
 FOR LANGGRAPH

A technical proposal for building a continuous, documented risk management system into LangGraph and LangChain agents — satisfying all ten paragraphs of Article 9 of Regulation (EU) 2024/1689.

## What Article 9 Actually Requires

Article 9 mandates that every high-risk AI system must have a continuously running, documented, and maintained risk management system spanning its full lifecycle — from design through post-market. It is not a one-time audit. It is an ongoing engineering process. Compliance deadline: August 2, 2026.

### Risk Management System Must Be Documented

A formal RMS must be established, implemented, documented and maintained. Not a single report — an operational, living system.

### Four-Step Iterative Loop

The system must: (a) identify/analyze risks to health, safety, fundamental rights, (b) estimate/evaluate those risks, (c) evaluate risks from post-market monitoring data, and (d) adopt targeted mitigation measures.

### Only Mitigable Risks In Scope

Article 9 only covers risks that can be reasonably mitigated or eliminated through design, development, or adequate technical information to deployers.

### Consider Combined Requirements

Risk measures must consider interaction effects across the full set of requirements in Chapter III — not each requirement in isolation. Balance, don't over-engineer.

### Residual Risk Must Be Judged Acceptable

After mitigation, the residual risk of each hazard and overall system residual risk must be judged acceptable. Requires a formal acceptability determination framework.

### Pre-Deployment Testing Against Defined Metrics

High-risk AI must be tested throughout development and before deployment. Testing must use predefined metrics and probabilistic thresholds appropriate to the intended purpose.

### Testing at Any Point + Pre-Launch Mandatory

Testing must happen as appropriate at any time during development, and without exception before placing the system on the market or putting it into service.

### Continuous Feedback Loop from Live Data

The RMS must incorporate post-market monitoring data (per Article 61) to re-evaluate and update risks. The system is never "finished."

### Special Consideration: Minors and Vulnerable Users

When the system's intended purpose may impact persons under 18 or other vulnerable groups, providers must give specific consideration to adverse impact vectors.

### May Merge With Existing RMS Under Other EU Law

If the organization already has risk management processes mandated by other EU laws (finance, medical, etc.), Art. 9 requirements can be integrated into those procedures.

## Why LangGraph/LangChain Don't Natively Comply

LangGraph state checkpointing is functional, not regulatory. There is no native concept of a "risk event," a "mitigation decision," or a "residual risk score" per graph execution.

LangChain callbacks log execution events, but do not produce structured documentation that satisfies Article 9 §1's requirement for a maintained risk management system.

LangSmith evaluators measure performance (quality, latency, accuracy) but are not structured around Article 9 §6's "prior defined metrics and probabilistic thresholds" for risk categories.

Production traces in LangSmith are not automatically routed into a risk re-evaluation system. §8 requires this loop to be operational, not optional.

LangGraph nodes are individually testable, but §4 requires risk assessment at the combined application level. Multi-agent graphs have emergent risk that node-level testing misses.

LangGraph has interrupt/approval node patterns. These can be mapped to Article 14 (human oversight) requirements and partly address §5 residual risk acceptability via human review gates.

## The Proposed Compliance Architecture

Build a Risk Management Middleware Layer that wraps your LangGraph agent. It adds four capabilities — risk context injection, structured event logging, evaluation gates, and post-market feedback routing — without modifying your core agent graph logic. Think of it as a compliance sidecar.

## Four Pillars of the Solution

Extend LangGraph's StateGraph schema with a mandatory risk_context field. This carries risk metadata — user segment, hazard classes, active mitigations, invocation purpose — through every node. Makes risk a first-class citizen of agent state, not an afterthought.

A LangChain callback handler that intercepts every node transition, tool call, and LLM invocation, emitting structured risk events to a persistent store. Events include hazard ID, mitigation applied, residual risk score, and operator decision. Produces the documented audit trail Article 9 demands.

A pre-deployment test suite built on LangSmith evaluators, structured around pre-defined risk metrics and probabilistic thresholds (not just accuracy). Tests include: harmful output rate, fundamental-rights proxy scores, bias probes, and consistency-under-distribution-shift. Blocks deployment if thresholds breached.

A production feedback pipeline that ingests LangSmith traces, flags anomalous risk events, and routes them back to the risk identification step. Triggers automatic risk re-evaluation when drift is detected. Closes the lifecycle loop that §2(c) and §8 explicitly require.

## Component-Level Build Specification

Extend TypedDict -based LangGraph state with required fields: risk_context (hazard_classes, user_segment, intended_purpose), active_mitigations (list of applied controls), risk_events (append-only list), residual_risk_score (float, updated by scoring node). Add a dedicated risk_assessment_node that runs at graph entry and after any tool call with side effects.

Subclass BaseCallbackHandler (or AsyncCallbackHandler). Override on_llm_end, on_tool_end, on_chain_end to emit structured RiskEvent objects to a message queue or database. Each event carries: timestamp, node_id, hazard_id, mitigation_applied, residual_score, run_id (for traceability). Store events in append-only log (PostgreSQL / DynamoDB / BigQuery) for regulator access.

A YAML/JSON-defined taxonomy of hazard classes relevant to your agent's domain. Each hazard entry carries: hazard_id, description, fundamental_rights_vector (which EU rights could be affected), likelihood_prior, severity_rating, and linked mitigation controls. This taxonomy is the documented output of the §2(a) "identification and analysis" step and must be versioned alongside code.

A graph node (or callable injected into the should_continue condition) that computes a composite residual risk score after mitigation controls have been applied. Compares score against pre-defined acceptability thresholds (set per intended purpose per §6). If residual risk exceeds threshold, routes to a human_review_node (interrupt) before execution continues. Satisfies §5 residual risk acceptability requirement.

A LangSmith evaluator suite with custom metrics tied to the hazard taxonomy: (1) HarmfulOutputRate — proportion of runs triggering HAZ-class events, (2) FundamentalRightsProxy — LLM-graded assessment of output against a rights rubric, (3) BiasProbe — structured demographic parity tests, (4) ConsistencyUnderDrift — re-run with distribution-shifted inputs. Suite is run in CI/CD. Deployment is blocked if thresholds breach. Results are documented as §6/§7 evidence.

An async service (cron-based or event-driven) that pulls production RiskEvent logs, aggregates anomaly signals, and triggers a risk re-evaluation run when drift is detected — e.g. HarmfulOutputRate exceeds baseline by >2σ. Writes a timestamped risk re-evaluation report to the RMS datastore, closing the §2(c)/§8 feedback loop. Implements the Article 9 requirement that the RMS is "regularly reviewed and updated."

## Skeleton: Risk-Aware LangGraph State

## Article 9 Paragraph → Solution Component Mapping

## Three-Phase Build Plan

### Foundation — Risk State & Taxonomy

Extend your LangGraph StateGraph with Article9State. Author the HazardTaxonomy YAML for your specific agent domain — mapping hazard classes to fundamental rights vectors, likelihood priors, and mitigation controls. Wire up RiskEventCallback to an append-only event store. At the end of Phase 1, your agent produces a structured risk event log on every run. This alone satisfies §1 (documented, maintained) and §2(a/b) (identification/estimation).

### Enforcement — Scoring, Thresholds & Eval Gates

Build the ResidualRiskScorer node and wire it into your graph's conditional edges. Define acceptability thresholds per hazard class in risk_thresholds.yaml. Build the RegulatoryEvalSuite in LangSmith with HarmfulOutputRate, FundamentalRightsProxy, and BiasProbe metrics. Integrate the suite as a required CI/CD gate — deployment to production is blocked if any threshold is breached. Document all test runs as §6/§7 evidence artifacts.

### Lifecycle Closure — Post-Market Monitoring & Documentation

Deploy the PostMarketMonitor as an async service. Configure drift detection thresholds per hazard class. Build the risk re-evaluation pipeline that triggers when drift is detected and writes timestamped re-evaluation reports to the RMS store. Generate a technical documentation bundle (Article 11) from RMS data — this is your compliance evidence package. Finally, validate §10 integration if other sectoral EU law applies: map RMS events into GDPR DPIA, DORA ICT risk log, or MDR QMS as appropriate.

This proposal addresses Article 9 in isolation. A full high-risk AI system compliance program also requires: Article 10 (data governance), Article 11 (technical documentation), Article 12 (automatic logging), Article 13 (transparency), Article 14 (human oversight), and Article 15 (accuracy/cybersecurity). The components proposed here — particularly RiskEventCallback, the RMS DataStore, and the RegulatoryEvalSuite — are intentionally designed as foundations that future Articles 10–15 work can build on. This is not legal advice.

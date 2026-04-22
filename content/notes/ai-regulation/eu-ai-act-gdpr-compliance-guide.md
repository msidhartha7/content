---
title: "EU AI Act & GDPR \u2014 Compliance Atlas + Compliant AI Agent Blueprint"
summary: "A comprehensive reference of every key article across the EU AI Act and GDPR \u2014 with real-world use cases, violation examples, and a full blueprint for a law-compliant AI agent"
topic: ai-regulation
legacyPath: "ai-regulation/EU AI Act GDPR Compliance Guide.html"
tags: ["ai-act", "gdpr", "compliance"]
date: 2026-04-12
updated: 2026-04-12
status: evergreen
pinned: false
public: true
---
# EU AI ACT 
 & GDPR 
 COMPLIANCE 
 BLUEPRINT

A comprehensive reference of every key article across the EU AI Act and GDPR — with real-world use cases, violation examples, and a full blueprint for a law-compliant AI agent.

## EU Artificial Intelligence Act

The world's first comprehensive legal framework for artificial intelligence — classifying AI systems by risk and imposing obligations on providers, deployers, and importers across the EU.

## Scope, Definitions & Prohibited Practices

Articles 1–5 — The foundational scope of the regulation and absolute prohibitions on certain AI systems.

- An EU company developing an AI tool for document review knows they must comply before market placement

- A US company exporting an AI hiring tool to Germany is made subject to these rules

- A hospital deploying a diagnostic AI confirms it is in scope before procurement

- Claiming a product is "just software" to escape AI Act scope when it uses ML models

- A non-EU developer ignoring the regulation because they are based outside the EU

- A UK AI startup selling to EU clients is captured under extraterritorial scope

- An open-source AI framework used commercially in the EU is in scope for deployers

- EU military AI systems are explicitly excluded and handled separately

- A US firm deploying facial recognition in EU airports claiming extraterritorial exemption

- A deployer misclassifying as a "distributor" to avoid provider-level obligations

- A regulator uses Art. 3's definition to determine whether a rule-based system qualifies as an "AI system"

- A company determines they are a "deployer" (not provider) because they use a third-party AI system

- Legal teams use the "general-purpose AI" definition to understand GPT-4 class model obligations

- Misclassifying a system that adapts outputs based on training as "non-AI" to avoid compliance

- Calling yourself a "distributor" to evade provider obligations when you substantially modify an AI system

- Real-time biometric ID by law enforcement with prior judicial authorisation in serious crime cases

- Post-hoc biometric analysis of a recorded crime scene by police with authorisation

- Emotion detection for safety-critical workplace monitoring with worker consent and oversight

- A retail chain scraping social media images to build a customer emotion database

- A government deploying social credit scoring to restrict citizens' access to services

- An insurer using subliminal audio cues in claims calls to influence customer decisions

- A school deploying emotion AI to profile students' attentiveness without consent

- Real-time facial recognition in public spaces without law enforcement justification

## High-Risk AI Systems — Classification & Obligations

Articles 6–49 — The core compliance regime for AI systems in high-risk categories including biometrics, critical infrastructure, employment, education, credit, law enforcement, and justice.

- An AI CV-screening tool used in hiring decisions is classified as high-risk (Annex III)

- An AI medical device component triggers both MDR and AI Act obligations

- An AI credit-scoring model used for mortgage decisions is high-risk

- AI in autonomous vehicles is high-risk under Annex I machinery safety

- Labelling a high-risk hiring AI as "decision support only" without the required governance

- Deploying a biometric access AI in a workplace without Annex III classification assessment

- A financial AI company documents a risk register with residual risk acceptance for each identified harm

- A healthcare AI provider continuously monitors post-deployment outputs for risk drift

- An AI hiring tool provider updates its risk assessment when adding a new job category

- Performing a one-time pre-launch risk assessment and never updating it

- Failing to assess risks arising from interaction of the AI system with other systems

- Accepting residual risks without documenting reasoning or testing mitigation measures

- A credit AI provider audits training data for racial under-representation before deployment

- A medical AI company validates test data against diverse demographic subgroups

- An NLP provider documents data sources and pre-processing pipelines for each model version

- Training a recidivism prediction AI on historically biased criminal justice data without bias mitigation

- Using scraped internet data without filtering for known errors, hate speech, or outliers

- Failing to document the proportion of demographic groups in training sets

- A startup documents model architecture, training data, and known limitations in an Annex IV package

- A notified body reviews technical documentation to certify a high-risk AI before CE marking

- An AI provider keeps versioned documentation to trace changes across model updates

- Providing only a marketing brochure instead of Annex IV technical documentation

- Failing to update technical documentation when a model undergoes substantial modification

- A law enforcement AI logs every query, operator, and output timestamp for audit trails

- A medical AI logs confidence scores alongside decisions for each patient interaction

- An HR AI preserves decision logs for disputed hiring or promotion decisions

- Deleting AI decision logs after 30 days for storage cost reasons

- Logging outputs but not logging the inputs that triggered each decision

- An AI tool for judges includes documentation noting demographic groups where accuracy drops

- A credit AI's instructions clearly state it should not be used for insurance pricing

- A medical imaging AI documents performance benchmarks across imaging device types

- Providing "black box" AI to a bank with no documentation on feature importance

- Claiming 99% accuracy without disclosing this applies only to a specific demographic

- A benefits assessment AI always routes final decisions to a human case worker

- A parole AI gives officers an override button with mandatory reason documentation

- An autonomous drone has a remote pilot kill-switch with a dead-man timeout

- Designing an AI so fast that humans cannot realistically review decisions before they execute

- Presenting AI recommendations as "final decisions" to eliminate perceived human liability

- Training operators only to accept AI outputs and never to question or override them

- A fraud detection AI is tested against adversarial examples before deployment

- A medical AI undergoes robustness testing under corrupted or noisy input conditions

- A credit AI reports confidence intervals alongside each score to flag uncertain decisions

- Deploying a hiring AI that can be fooled by simple keyword stuffing in CVs

- Using a model that was not tested against adversarial inputs in a law enforcement context

- A medical AI startup builds an ISO 9001-aligned QMS with AI-specific controls

- A fintech documents its model lifecycle from data collection to post-deployment monitoring

- A provider implements a formal change management process for model updates

- Pushing model updates to production without a documented change assessment

- No formal process for handling user-reported AI errors or bias complaints

- A local authority completes a Fundamental Rights Impact Assessment before deploying predictive policing

- An employer notifies workers that an AI monitors productivity and routes disputes to HR

- A bank assigns a responsible officer to review AI credit decisions weekly

- A public hospital using an AI triage tool without telling patients it influences their care pathway

- A firm using an AI hiring tool outside its documented intended purpose (e.g. for promotion decisions)

- A credit AI undergoes internal conformity assessment with a signed Declaration of Conformity

- A biometric verification system contracts a notified body for third-party review

- An AI provider repeats conformity assessment when making a "substantial modification" to the model

- Affixing a CE mark without completing the required conformity assessment procedure

- Claiming self-assessment sufficiency for a real-time facial recognition system at a border

- An AI diagnostic tool's DoC references Annex IV technical documentation and EN ISO 13485

- A regulator pulls the DoC to verify compliance during a post-market inspection

- A distributor checks the DoC before agreeing to carry a high-risk AI product

- Signing a Declaration of Conformity without the underlying technical documentation being complete

- Not updating the DoC when the AI system is substantially modified

## Transparency Obligations & General-Purpose AI Models

Articles 50–55 — Transparency requirements for limited-risk AI, and the governance framework for foundation models / general-purpose AI (GPAI) including systemic risk models.

- A customer service chatbot displays "You are chatting with an AI assistant" at the start of each session

- A news agency's AI-generated video is watermarked with IPTC C2PA provenance metadata

- A virtual therapist app discloses at onboarding that the therapist is an AI

- A call centre bot pretending to be a human named "Sarah" without disclosure

- A political campaign releasing AI-generated candidate videos without any disclosure label

- A media company removing AI watermarks from synthetic news images

- OpenAI's GPT-4 and similar frontier models are subject to systemic-risk GPAI obligations

- A smaller open-source model (e.g., 7B parameters, low compute) falls under standard GPAI rules only

- The EU AI Office uses the FLOP threshold to objectively trigger systemic risk review

- A GPAI provider underreporting training compute to fall below the 10^25 FLOP threshold

- A foundation model API provider failing to notify the AI Office of a new high-compute model release

- A GPAI provider publishes a detailed model card covering training data, capabilities, and known limitations

- An API provider implements usage policies refusing misuse cases (e.g., CSAM generation)

- A frontier lab conducts red-team adversarial testing and submits results to the AI Office

- A GPAI provider releasing a model with no model card or documentation of training data sources

- Failing to report a serious incident involving GPAI misuse for critical infrastructure attacks

- Not having copyright clearance processes for training data scraped from the internet

- Anthropic conducts structured red-teaming before each Claude major release per Art. 55

- A GPAI provider reports a prompt-injection incident that caused harmful output to the EU AI Office within 72 hours

- A lab partners with external safety evaluators for standardised capability benchmarking

- A frontier model provider not reporting a serious misuse incident that caused financial harm at scale

- Claiming red-teaming was performed without adequate documentation of methodology

## Market Surveillance, Sanctions & Governance

Articles 56–99 — The enforcement machinery: market surveillance authorities, the EU AI Office, post-market monitoring, serious incident reporting, codes of conduct, and financial penalties.

- A credit AI provider monitors quarterly accuracy drift across demographic segments post-deployment

- A healthcare AI developer collects clinician feedback reports as part of post-market surveillance

- An AI provider publishes annual post-market performance summaries to market surveillance authorities

- Considering compliance complete at launch and never revisiting model performance

- Not establishing a feedback loop from deployers to providers about AI system errors

- A hospital AI misdiagnosis causing patient harm triggers a 72-hour incident report

- An AI safety system failure in an autonomous vehicle is reported within 15 days

- A predictive policing error leading to wrongful arrest is escalated as a serious incident

- A provider concealing an AI-related patient death to avoid regulatory scrutiny

- Reporting after 30 days because the internal review process was too slow

- A startup in a regulatory sandbox benefits from reduced penalties for first-time violations

- Voluntary disclosure of a compliance gap before enforcement can reduce penalty severity

- Demonstrated good-faith QMS and post-market monitoring mitigates financial exposure

- Deploying an unacceptable-risk AI (social scoring) commercially — €35M / 7% turnover

- A Fortune 500 AI provider with 3% penalty exposure = potentially €600M+ fine

- Providing false information during a market surveillance investigation

- A startup tests a healthcare AI on live patient data within a supervised sandbox without full conformity requirements

- A city partners with an AI provider to trial a traffic management system in a designated sandbox zone

- A sandbox participant is shielded from certain penalties while testing a novel high-risk AI

- Using sandbox status to deploy commercially beyond the approved test boundary

- Not maintaining the required monitoring and documentation even while in the sandbox

## General Data Protection Regulation (GDPR)

The foundational data protection law governing collection, processing, storage, and transfer of personal data — critically relevant to any AI system that processes information about natural persons.

## Lawful Processing, Consent & Core Data Principles

Articles 5–11 — The foundational obligations: the seven GDPR principles, lawful bases, consent requirements, and special category data rules.

Art. 5(1)(a) — Data must be processed lawfully, fairly, and in a transparent manner to the data subject.

Art. 5(1)(b) — Data collected for specified, explicit, legitimate purposes and not further processed incompatibly.

Art. 5(1)(c) — Data must be adequate, relevant, and limited to what is necessary for the processing purpose.

Art. 5(1)(d) — Personal data must be accurate and kept up to date; inaccurate data must be erased or rectified.

Art. 5(1)(e) — Data kept in identifiable form only as long as necessary for the stated purpose.

Art. 5(1)(f) — Processed with appropriate security, protecting against unauthorised access or accidental loss.

Art. 5(2) — The controller is responsible for demonstrating compliance with all of the above principles.

Art. 9 — Extra restrictions on health, genetic, biometric, racial, political, religious, and sexual orientation data.

- An AI recommendation engine processes purchase history under Art. 6(1)(b) — performance of contract

- A healthcare AI processes patient records under Art. 6(1)(c) — legal obligation (medical records law)

- A fraud detection AI is justified under Art. 6(1)(f) — legitimate interest (fraud prevention outweighs individual impact)

- Using purchase data to train an unrelated marketing AI without a lawful basis

- Claiming legitimate interest for profiling without completing a Legitimate Interest Assessment

- Processing employee personal data for AI training on the basis of employment contract without specific consent

- An AI personalisation platform shows a clear opt-in checkbox, separate from terms of service

- A mental health app requests separate consent for anonymised data use in AI model training

- A user withdraws consent; the company deletes their data from the training pipeline within 30 days

- Burying AI training consent in a 47-page privacy policy with a pre-ticked box

- Conditioning access to a service on consent to AI training data use

- An employer asking employees to consent to biometric AI monitoring (consent not freely given)

- A hospital uses patient health data to train a diagnostic AI under Art. 9(2)(h) — medical treatment justification

- A research institution trains an AI on de-identified genetic data under Art. 9(2)(j) — scientific research exception

- An employer uses fingerprint authentication under Art. 9(2)(b) — employment law obligation (with consent backup)

- A retailer using facial recognition to infer customer emotions (biometric + health data) without explicit consent

- An insurer training AI on inferred health conditions from purchase data

- A political party using social media profiling to infer political opinions for targeting

- An AI trained on fully anonymised census data may not require the same GDPR protections as identifiable datasets

- A company uses differential privacy techniques to ensure individual re-identification is computationally infeasible

- Claiming anonymisation when data can be re-identified by cross-referencing with other datasets (Netflix re-identification case precedent)

- Applying Art. 11 exemptions when the AI system can infer individual identity from "anonymised" inputs

## Rights of the Data Subject in the Age of AI

Articles 12–22 — The rights individuals hold over their personal data, critically including the right not to be subject to solely automated decisions (Art. 22).

- An AI recruitment platform's privacy notice explains that CV ranking is automated and describes the logic

- A chatbot discloses at the start that conversations are used to improve its AI model, with opt-out link

- A lender's privacy notice explains that credit scoring is automated and describes the main factors used

- A company mentioning AI processing only in footnote 47 of a 60-page privacy policy

- Failing to disclose that voice interactions are used to train a speech recognition AI

- A user asks an AI credit company for the features that influenced their credit score — company provides a feature importance report

- A candidate requests all personal data held by an AI hiring platform and receives it within 30 days

- A bank's AI fraud system provides a redacted explanation of why a transaction was flagged

- Telling a rejected applicant "the AI decided" with no further information

- Taking 3 months to respond to a Subject Access Request

- Providing raw data without any explanation of AI processing as required by Art. 15(1)(h)

- A company implements machine unlearning to remove a user's data influence from a trained model after erasure request

- A search company removes personal data references from index and requests downstream cache clearing

- A healthcare AI deletes patient records and retrains affected model components on erasure request

- Deleting the database record but leaving the individual's data embedded in a production AI model

- Refusing erasure citing "we can't un-train the model" without demonstrating this is technically impossible

- Not notifying downstream processors (e.g., cloud AI API vendors) of erasure obligations

- A person disputes AI-inferred credit score; company restricts using that score in any decision until reviewed

- A job applicant objects to automated screening; company pauses AI processing of their application

- Continuing to use a disputed AI profile to serve targeted ads during the restriction period

- Not having a technical mechanism to "freeze" individual records from AI pipeline processing

- A user exports their full activity history from an AI fitness app in JSON format to import into a competitor

- A bank customer requests their transaction history in CSV format to submit to a new lender's AI underwriting system

- Providing data only as a PDF that cannot be machine-parsed by another AI system

- Charging a fee for a data portability export without legal justification

- A user objects to their browsing data being used for AI behavioural profiling; platform stops immediately

- A candidate objects to AI profiling for job targeting; recruiter must cease and demonstrate overriding grounds or stop

- Ignoring an objection to AI-based direct marketing profiling (this must always be honoured)

- Making the objection process so difficult (dark patterns) that it is practically unusable

- A bank's AI loan decision always routes to a human reviewer before the decision is communicated — satisfying the "solely automated" exception

- A user rejected by an AI credit score is told the key factors and given the right to request human review

- A company obtains explicit consent to allow AI-only screening for low-risk job shortlisting

- An insurer using AI pricing ensures a human can review and override any premium above a threshold

- An AI fully deciding visa applications without any human in the loop (as in the Dutch SyRI case)

- An AI hiring system auto-rejecting candidates based on name inference (proxy for race) with no appeal

- A bank's chatbot making binding credit decisions without human review or explanation

- Not disclosing that a hiring decision was made automatically and not providing contestation rights

## DPIA, Privacy by Design, DPO & Data Transfers

Articles 24–49 — Accountability obligations for AI deployers: Data Protection Impact Assessments, privacy-by-design mandates, Data Protection Officer roles, and cross-border transfer rules.

- An AI engineer implements differential privacy at the model training stage, before any data processing begins

- A chatbot collects only conversation metadata (not content) by default; full logging requires opt-in

- A recommendation AI is architected with federated learning so personal data never leaves user devices

- Building a data maximisation strategy into an AI system's architecture from day one

- Defaulting all users to full data sharing and profiling with no opt-out at launch

- Adding privacy controls as a post-launch patch after a regulator complaint

- A company using OpenAI's API to process customer queries signs OpenAI's DPA before production deployment

- A healthcare provider ensures its AI vendor's DPA prohibits training on patient data

- A DPA specifies that the AI vendor cannot subcontract to a cloud provider not on the approved list

- Using an AI SaaS product that processes employee data without a signed DPA

- An AI vendor sub-processing data to a third-party model trainer without controller authorisation

- A retailer deploying AI customer emotion analysis completes a DPIA before pilot launch

- An insurer conducting DPIA for AI health-risk scoring from lifestyle data before product launch

- A DPIA for an AI HR tool identifies high risk → company adds human oversight control to mitigate

- A public authority's DPIA consultation with their DPO results in redesigning a surveillance AI

- Deploying large-scale biometric AI at a music festival without conducting a DPIA

- Conducting a superficial DPIA that identifies risks but does not implement any mitigations

- Not consulting the supervisory authority after a DPIA shows high residual risk cannot be mitigated

- A tech company processing 10M users' behavioural data for AI personalisation must appoint a DPO

- A DPO reviews a proposed AI health monitoring product before launch and raises Art. 9 concerns

- A DPO is consulted on an Art. 36 prior consultation because a DPIA found irresolvable high risk

- Appointing the CTO as DPO — creating a conflict of interest (DPO must be independent)

- Not providing the DPO with resources to monitor AI system compliance across the organisation

- An AI health platform encrypts all personal data at rest and in transit using AES-256 and TLS 1.3

- An AI model server is isolated on a private VPC with strict IAM policies and zero-trust network access

- An AI training pipeline pseudonymises all personal identifiers before data enters model training

- Storing training data (containing personal information) in a public S3 bucket without encryption

- Not having a disaster recovery plan for an AI system that processes medical records

- Model weights containing memorised personal data accessible via inference API without access controls

- An AI training dataset is exfiltrated; company notifies the ICO within 48 hours with breach description

- A model memorisation vulnerability exposes names; affected users receive personal notifications

- A processor (AI vendor) notifies the controller within 24 hours of discovering a breach, enabling controller's 72h window

- Discovering a training data breach and waiting 2 weeks for the PR team to draft messaging before notifying

- Notifying the authority but not telling affected individuals whose financial data was exposed

- A European company using a US AI API executes SCCs with the US vendor before routing EU personal data

- A multinational uses Binding Corporate Rules to allow intra-group AI training data transfers globally

- An EU company checks adequacy status before enabling an AI feature that routes queries to US servers

- Routing EU patient data to a US AI inference API without SCCs or adequacy decision in place

- Using SCCs that pre-date the 2021 updated clauses for new processing activities

- Relying on the Privacy Shield framework after its Schrems II invalidation

- Meta fined €1.2B for unlawful EU-US data transfers (largest GDPR fine to date)

- Amazon fined €746M for unlawful targeted advertising processing

- Google DeepMind fined for using NHS patient data without proper lawful basis

- Training an AI on special category health data without explicit consent or Art. 9 exception

- Violating Art. 22 by allowing AI to make fully automated legal decisions without safeguards

- Mass DPIA failure before deploying AI across millions of EU users

## The Compliant AI Agent

A comprehensive visual anatomy of an AI Agent designed from the ground up to comply with both the EU AI Act and GDPR — with specific article citations at every stage of the agent lifecycle.

Every layer of the agent's lifecycle, with the specific EU AI Act and GDPR provisions that govern it, and why they apply.

---
title: "Mixedbread FE Prep \u00b7 4-Week Plan"
summary: "This is not a generic frontend study plan. It's a targeted prep track built around the five gaps you flagged \u2014 Next.js App Router, Core Web Vitals, animation polish, AI/vector-sear..."
topic: prep-plans
legacyPath: "prep-plans/Mixed Bread Prep Plan for GreatFrontend.html"
tags: ["prep", "frontend", "interview"]
date: 2026-04-22
updated: 2026-04-22
status: evergreen
pinned: false
public: true
---
# Ship a portfolio-grade proof you can build Mixedbread's playground — in 28 days.

This is not a generic frontend study plan. It's a targeted prep track built around the five gaps you flagged — Next.js App Router, Core Web Vitals, animation polish, AI/vector-search concepts, and frontend system design — with GreatFrontEnd as the spine and one killer portfolio project as the output.

## Strip away the job-spec language. Mixedbread needs three things.

Every "Frontend Engineer" JD sounds the same. This one isn't. Read between the lines and the role clusters into three pillars — production Next.js fluency, taste-level UI craft, and enough AI literacy to not embarrass yourself in a playground demo. Your prep should hit all three.

Server Components, streaming, parallel + intercepting routes, Route Handlers, Server Actions, caching layers. They said "App Router preferred" — it's a filter.

"Beautiful, performant interfaces" and "intuitive and delightful" appear twice. They've lost candidates here before. Micro-interactions, motion, typography hierarchy.

Playgrounds for embeddings + reranking is literally the job. Knowing what cosine similarity is and why rerankers exist puts you ahead of 80% of applicants.

"Sub-second page loads" — they measure. You'll need Lighthouse ≥ 95 and real answers on LCP, INP, CLS.

Composable component libraries. How to extend, theme, and maintain. Turborepo/pnpm workspace experience lands extra.

SSE/WebSockets for streaming AI responses. Vitest + Playwright for the engineering-culture signal. Both nice-to-haves that become credibility markers.

## You already have GFE. That's the backbone. Everything else layers on top.

GreatFrontEnd covers the classic frontend interview stack — coding, system design, quiz, UI fundamentals. Don't grind it randomly. Map its modules to your weeks so it compounds with the portfolio work instead of competing with it.

Daily rhythm: 30 min quiz questions before standup (trivia + rapid recall) + 60–90 min of one coding question or one system design study every other day. Weekends: do one full mock under timed conditions. Don't binge — consistency beats sprints for interview recall.

Closures, `this`, promises, event loop, debounce/throttle, deep clone. Build muscle memory on the fundamentals they'll probe in round 1.

Autocomplete, modal, tabs, accordion, infinite scroll, data table. These are exactly the kind of components that live in a playground UI.

Work through News Feed, Autocomplete, Pinterest. Then apply the same framework to "Design an AI search playground" — that's the likely question.

Two full mock interviews. Coding medium + SD. Record yourself thinking out loud. Watch it back. This is where most people skip — don't.

## Each week has one theme, three tracks, one deliverable.

Three tracks run in parallel every week: GFE (recall), learning (depth), and building (the flagship project). By end of Week 4, you have a working AI search playground, a perf-optimised deploy, and enough recall to handle a live coding round cold.

### Next.js App Router — rebuild your mental model

- Read Next.js docs end-to-end (App Router only) routing → rendering → caching → styling → optimizing

- Watch Lee Robinson's "Next.js App Router in 100 minutes" then rewatch 2x at pause points

- Deep-dive: Server Components vs Client Components mental model the 'use client' boundary is the #1 thing to nail

- Study: Suspense, streaming, loading.tsx, error.tsx

- Daily: 30 min JS quiz (closures, promises, event loop)

- 2x coding easy/medium: debounce, throttle, flatten, curry

- Weekend: 1 full timed coding mock

- Scaffold the flagship project see §04 — "AI Search Playground"

- Next.js 15 + shadcn/ui + Tailwind + TypeScript strict

- Set up Turborepo OR pnpm workspace

### AI concepts + the playground build begins

- Jay Alammar: "Illustrated Word2Vec" + "Illustrated Transformer" read twice. this is your vocabulary foundation

- What are embeddings? Vectors, cosine similarity, dimensionality use Mixedbread's own blog posts — literal homework signal

- What is reranking? Why does it exist on top of vector search?

- Play with Mixedbread's API for 1 hour. Hit /embed and /rerank endpoints.

- Streaming UI patterns: SSE vs WebSockets, useChat from AI SDK

- Coding medium: autocomplete (debounced), modal, tabs

- UI fundamentals module — accessibility, keyboard nav, ARIA

- Weekend: build GFE's "type-ahead search" from scratch, no hints

- Playground: embeddings visualizer page input text → show vector → 2D projection (PCA/t-SNE)

- Playground: reranker comparison page (query + docs in, ranked out)

- Wire up streaming responses via SSE

### Perf, animation, and the polish pass

- web.dev Core Web Vitals course (LCP, INP, CLS) INP replaced FID in 2024 — know the difference

- Lighthouse CI + Vercel Speed Insights — run on your project

- Framer Motion / Motion docs: layout, variants, AnimatePresence

- Read: Josh W Comeau on animation easing + physics-based motion

- next/image, next/font, next/dynamic — when + why

- Start frontend system design module

- Deep study: "Design Autocomplete" + "Design News Feed"

- Adapt both frameworks to "Design an AI playground"

- Weekend: write your own SD doc for the flagship project

- Add animations: page transitions, card enters, loading states

- Measure + optimize: LCP < 1.2s, INP < 200ms, CLS < 0.1

- Lighthouse target: 95+ on all four metrics

- Add a11y pass: keyboard nav, focus states, ARIA labels, contrast

### Testing, write-up, apply

- Vitest basics: unit tests for utils + hooks

- Playwright basics: one E2E flow (search → results → click)

- Write a short case-study blog post on the playground architecture, tradeoffs, perf wins — this becomes your X/LI post

- 2 full timed mocks: 1 coding + 1 system design

- Record both, watch back, note filler words + unclear explanations

- Revisit weak quiz areas identified across weeks 1–3

- Add Vitest tests for 2 key utils/hooks (not exhaustive — signal)

- Add 1 Playwright E2E covering the happy path

- Deploy final version. Custom domain. Open-source on GitHub.

- Write README with architecture diagram + tradeoffs

## Build the interview. Not around it.

The fastest path into Mixedbread is to ship something that looks like it could already be in their product. Not a clone — an adjacent tool that demonstrates you understand embeddings, reranking, streaming, and can design a UI around them. This becomes your answer to every application question and your warm intro to the hiring manager.

### Project: "Vectorscope" — A Visual Playground for Embeddings & Reranking

An open-source playground that lets you feed text, see how different embedding models project it into vector space, run rerankers across result sets, and stream everything back with motion-rich UI. Positions you as someone who doesn't just consume AI APIs but designs thoughtful interfaces around them.

- Embedding Visualizer — paste text, see 2D projection (PCA or UMAP via WASM), hover to see raw vectors. Uses Mixedbread's embed API.

- Reranker Workbench — input a query + 10 candidate docs, watch the reranker sort them in real-time with animated row reorders (Framer Motion layout).

- Similarity Playground — drag two text chunks into a diff view, see cosine similarity score update live as you edit.

- Streaming Everything — SSE for all API calls, with skeleton + progressive reveal. No jumpy layouts.

- Performance — Lighthouse 95+, LCP <1.2s. Instrumented with Speed Insights.

- Model Comparison — run the same query through 2–3 different embedding models, compare ranking deltas side-by-side.

- Shareable Sessions — URL state encoding so you can share a specific query+result config.

- Dark/Light themes — themed with CSS variables, demoing design-system thinking.

- Keyboard-first — full keyboard nav, cmd+k palette. Signals taste.

## What a Mixedbread-style loop looks like — and how to prep each round.

Remote-first AI infra startups run tight loops: 4 rounds, ~4 hours total. Each one tests a different axis. Prep differently for each.

Background, motivation, why Mixedbread specifically. They're filtering for coherence and genuine interest.

Build something real in 45 min — autocomplete, modal, infinite scroll, data table. JS or TS, React, vanilla browser APIs.

"Design the playground page for our API" or "Design a streaming chat interface." Whiteboard/Miro-style.

Walk through your flagship project. Hard technical follow-ups. Values fit. "What would you change about our site?"

## The form has two open-ended questions. They matter more than the resume.

Most candidates fill these out as afterthoughts. Treat them as mini-essays. Specificity beats eloquence.

## The cheap mistakes that cost the offer.

- Ship the playground live on a custom domain before applying.

- Record a 60-sec Loom walkthrough. Link it in the application.

- Use Mixedbread's actual API, not OpenAI's — proof of product-fit.

- Write one case-study post about the build. Link it.

- Run Lighthouse publicly. Screenshot the scores. Paste them in the post.

- Audit mixedbread.com and keep 3 polite critiques in your back pocket for R4.

- Don't submit a generic resume. Tailor it to mention playground, perf, AI.

- Don't skip the a11y pass. They ship to devs — devs notice.

- Don't use `pages/` router in the flagship project. They said "App Router preferred."

- Don't fake AI expertise. Saying "I understand what embeddings are for" beats jargon-stuffing.

- Don't over-engineer. 4 polished features > 12 half-built ones.

- Don't forget the Lookover + agency context — frame it as founder-mode, not distraction.

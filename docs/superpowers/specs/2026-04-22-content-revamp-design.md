# Content Revamp Design

## Goal

Revamp this repository from a manually maintained set of static HTML pages into a lightweight knowledge workspace that feels closer to Notion for retrieval, while still reading well as a public website, and remains simple to deploy on GitHub Pages.

## Current State

The repository is currently a flat static site with:

- a hand-maintained [index.html](/Users/sidhartha/projects/content/index.html)
- a generated [journal.html](/Users/sidhartha/projects/content/journal.html)
- topic folders containing standalone HTML files
- helper scripts like [build_journal.py](/Users/sidhartha/projects/content/build_journal.py) and [update_index.py](/Users/sidhartha/projects/content/update_index.py)

This works for publishing files quickly, but it has structural limits:

- navigation is manually duplicated
- metadata is implicit rather than modeled
- note pages do not share a systemized layout
- the journal is a separate special case
- the current homepage behaves like a static list, not a workspace

## Product Direction

The site should be a hybrid:

- strong for personal retrieval
- acceptable as a public-facing knowledge site

The approved UX direction is:

- workspace-first
- mostly automatic structure
- Markdown plus frontmatter as the source of truth
- browse-first with lightweight client-side search
- Git-first authoring
- journal kept mostly separate, but still inside the same generated site

## Recommended Stack

Use `Eleventy` with `Markdown + frontmatter`, deployed to `GitHub Pages` using `GitHub Actions`.

### Why Eleventy

Eleventy is the best fit for this repo because it gives:

- direct Markdown support
- simple templating without turning the site into a client app
- fast static builds
- enough flexibility to generate sidebar navigation, archive pages, topic pages, and a small search index

### Alternatives Considered

#### Astro

Astro has excellent content collections and a nicer component model, but it adds more framework surface area than this project needs for a workspace-style static notes site.

#### Jekyll

Jekyll is still a first-class GitHub Pages option, but it is a less ergonomic fit for a custom workspace UI and metadata-driven navigation than Eleventy.

#### Hugo

Hugo has strong taxonomy support and fast builds, but it adds a heavier opinionated content model and is less attractive here than Eleventy for a small personally maintained site.

## Content Model

Use Markdown files with frontmatter as the canonical source.

### Proposed Structure

```text
content/
  notes/
    ai-regulation/
      article-9-langgraph-proposal.md
    it-audit/
      compliance-plan.md
    marketing/
      reddit-marketing-strategy.md
  journal/
    2026-04-12.md
    2026-04-13.md
  pages/
    home.md
```

### Frontmatter Schema

All regular notes should support:

```yaml
---
title: EU AI Act Article 9 LangGraph Proposal
summary: Implementation notes for Article 9 compliance workflows.
topic: ai-regulation
tags:
  - ai-act
  - compliance
  - langgraph
date: 2026-04-12
updated: 2026-04-22
status: evergreen
pinned: false
public: true
---
```

Journal entries should use a smaller schema:

```yaml
---
title: Daily Log
date: 2026-04-13
summary: Rest day, recharge, and personal notes.
type: journal
public: true
---
```

### Modeling Rules

- folder structure helps authoring and organization
- frontmatter controls presentation
- topic is explicit metadata, not inferred only from file location
- search and navigation derive from frontmatter
- generated pages should ignore notes where `public: false`

## Information Architecture

The site should be built around three navigation layers.

### 1. Workspace Shell

Persistent primary navigation:

- Home
- All Notes
- topic sections
- Journal

On desktop, this should live in a left sidebar. On mobile, it should become a collapsible drawer.

### 2. Browse Layer

The main browsing paths are:

- Home for quick access
- All Notes for dense scanning
- Topic pages for subject-specific browsing
- Journal archive for chronological review

### 3. Reading Layer

Each note page should include:

- title
- summary
- topic
- tags
- date and updated date
- status
- related notes
- breadcrumb or topic context

Journal entries remain visually distinct and chronologically organized, with minimal pressure to look like evergreen notes.

## UI/UX Direction

The UI should feel like a focused research workspace, not a blog or marketing page.

### Visual Principles

- quiet, structured, and dense rather than decorative
- strong hierarchy and scanability
- consistent note chrome across all content
- premium typography with restrained color use
- visibly distinct journal accent system

### Homepage

The homepage should function like a command center:

- search input near the top
- pinned notes
- recent notes
- topic overview
- quick access to journal

This is not an editorial landing page. It should privilege retrieval speed over storytelling.

### Note Pages

Regular notes should use:

- a narrow reading column
- clear metadata block above the body
- sticky local table of contents for long notes only
- related-note links below the body

### Journal

The journal should stay mostly separate:

- dedicated archive view
- distinct accent color
- chronological layout
- easier date scanning than regular notes

It can still share the global shell, search index, and deployment pipeline.

### Search and Filtering

Keep interaction lightweight:

- client-side search only
- prebuilt JSON search index at build time
- filter by topic, tag, and type
- no auth
- no database
- no server rendering

This should feel like browse-first with fast find layered on top, not like a web app.

## Pages and Templates

The generated site should include:

- homepage
- all-notes page
- topic landing pages
- individual note pages
- journal archive page
- individual journal entry pages or expandable archive entries
- optional tag pages only if they materially improve retrieval

Recommended template boundaries:

- base layout
- workspace shell
- note layout
- journal layout
- list-card partial
- metadata partial
- search index generation

## Migration Strategy

Migrate in one direction only:

- existing HTML becomes legacy source material
- Markdown becomes the new source of truth

Recommended migration sequence:

1. define frontmatter schema
2. convert existing HTML notes into Markdown files
3. convert `daily-logs/*.md` into the new journal pipeline
4. replace manual `index.html` generation with Eleventy templates
5. remove or archive old generators once the new build is stable

The current [update_index.py](/Users/sidhartha/projects/content/update_index.py) should not survive the redesign. Its model is too brittle and mixes publishing with git side effects. The journal generator logic can inform migration, but it should also be retired once Eleventy owns rendering.

## Deployment

Deploy via GitHub Pages using a GitHub Actions workflow.

Build output should be committed only as generated artifact in the Pages pipeline, not maintained manually in source control.

Benefits:

- no server to maintain
- no runtime backend
- no database
- generator choice remains flexible
- local workflow stays simple: edit Markdown, preview locally, commit, push

## Non-Goals

The first revamp should not include:

- user authentication
- comments
- server-side search
- CMS integration
- collaborative editing
- complex backlinks graph visualization
- heavy SPA behavior

These can be revisited later only if the retrieval workflow proves insufficient.

## Success Criteria

The revamp is successful if:

- adding a new note requires only one Markdown file with frontmatter
- homepage and topic pages generate automatically from content metadata
- notes feel part of a coherent workspace system
- journal remains separate enough to preserve its current use case
- search and filtering are fast and lightweight
- the site deploys cleanly to GitHub Pages
- the new system fully replaces manual index maintenance

## Risks

### Content Migration Risk

Existing HTML content may contain structure that does not translate cleanly into Markdown. This should be handled with a pragmatic manual conversion pass instead of overengineering an importer.

### Metadata Drift Risk

If frontmatter is optional or inconsistent, the IA degrades quickly. The build should enforce required fields and fail loudly for malformed content.

### Search Payload Risk

If too much note body content is shipped to the browser, search will become unnecessarily heavy. The initial search index should prefer title, summary, topic, tags, and maybe a short excerpt.

## Research Notes

This recommendation is based on current official documentation:

- GitHub Pages docs: https://docs.github.com/pages
- About GitHub Pages and Jekyll: https://docs.github.com/github/working-with-github-pages/about-github-pages-and-jekyll
- Eleventy docs: https://www.11ty.dev/
- Astro content collections docs: https://docs.astro.build/en/guides/content-collections/
- Hugo taxonomies docs: https://gohugo.io/content-management/taxonomies/

GitHub currently recommends GitHub Actions for Pages deployment workflows. That makes Eleventy a clean fit even though Jekyll remains the built-in default path.

# content

Static knowledge workspace built with Eleventy and deployed to GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm test
npm run build
```

## Content model

All publishable content lives under `content/`:

- `content/notes/<topic>/<slug>.md`
- `content/journal/YYYY-MM-DD.md`

Each note uses Markdown with frontmatter:

```yaml
---
title: Example note
summary: One-line summary for browse and search views.
topic: marketing
tags: ["reddit", "growth"]
date: 2026-04-22
updated: 2026-04-22
status: working
pinned: false
public: true
---
```

Journal entries use a smaller frontmatter shape:

```yaml
---
title: Daily Log
summary: What changed today.
date: 2026-04-22
public: true
---
```

## Publishing

Push to `main` to trigger the GitHub Pages workflow in `.github/workflows/pages.yml`.

The generated site is written to `_site/` during the build and uploaded as the Pages artifact. The source of truth is the Markdown inside `content/`, not generated HTML files.

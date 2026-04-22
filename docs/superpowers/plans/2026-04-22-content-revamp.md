# Content Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-maintained HTML note index with an Eleventy-based Markdown workspace that deploys to GitHub Pages, supports lightweight search, and keeps the journal as a separate section inside the same site.

**Architecture:** Use Eleventy as the static site generator, `content/` as the Markdown source of truth, and small plain-JS helper modules for content normalization and search index generation. Render the site with shared Nunjucks layouts, build a static JSON search index for client-side filtering, and retire the manual `index.html` / `journal.html` generation model.

**Tech Stack:** Eleventy, Node.js built-in test runner, vanilla CSS/JS, Markdown with frontmatter, GitHub Actions for Pages deploy

---

## File Structure

**Create**
- `package.json` - project scripts and Eleventy dependency
- `.eleventy.js` - Eleventy config, passthrough copies, collections, Markdown pipeline
- `.github/workflows/pages.yml` - GitHub Pages deployment workflow
- `lib/content.js` - normalize frontmatter, derive URLs, sort notes and journal entries
- `lib/search-index.js` - build search documents from normalized content
- `tests/content.test.js` - red/green tests for note and journal normalization
- `tests/search-index.test.js` - red/green tests for search payload generation
- `content/notes/**/*.md` - migrated notes as Markdown + frontmatter
- `content/journal/*.md` - journal entries moved into the new source tree
- `src/_data/site.js` - site metadata
- `src/_data/content.js` - load Markdown content and expose normalized notes/journal/topics
- `src/_includes/layouts/base.njk` - root HTML shell
- `src/_includes/layouts/workspace.njk` - shared sidebar and workspace chrome
- `src/_includes/layouts/note.njk` - regular note layout
- `src/_includes/layouts/journal-entry.njk` - journal entry layout
- `src/_includes/partials/sidebar.njk` - navigation rail
- `src/_includes/partials/note-list.njk` - reusable list rows/cards
- `src/_includes/partials/metadata.njk` - note metadata block
- `src/assets/styles/site.css` - site design system
- `src/assets/scripts/workspace.js` - search, drawer, and filter behavior
- `src/index.njk` - workspace homepage
- `src/all-notes.njk` - dense note index
- `src/topics.njk` - paginated topic pages
- `src/journal.njk` - journal archive
- `src/search.json.njk` - prebuilt client-side search index

**Modify**
- `.gitignore` - ignore `.worktrees/`, `node_modules/`, `_site/`
- `README.md` - local development and publish workflow

**Archive or Remove After Verification**
- `index.html`
- `journal.html`
- `update_index.py`
- `build_journal.py`
- legacy topic HTML files after their Markdown equivalents are verified

### Task 1: Establish the Build/Test Skeleton

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `lib/content.js`
- Create: `lib/search-index.js`
- Test: `tests/content.test.js`
- Test: `tests/search-index.test.js`
- Modify: `.gitignore`

- [ ] **Step 1: Write the failing content normalization tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeNote, normalizeJournalEntry, groupTopics } from "../lib/content.js";

test("normalizeNote derives slug, url, and searchable metadata", () => {
  const note = normalizeNote({
    slug: "eu-ai-act/article-9",
    data: {
      title: "Article 9",
      summary: "LangGraph proposal",
      topic: "ai-regulation",
      tags: ["ai-act", "langgraph"],
      date: "2026-04-12",
      updated: "2026-04-22",
      status: "evergreen",
      pinned: true,
      public: true
    }
  });

  assert.equal(note.url, "/notes/ai-regulation/article-9/");
  assert.equal(note.topicLabel, "AI Regulation");
  assert.deepEqual(note.tags, ["ai-act", "langgraph"]);
});

test("normalizeJournalEntry keeps journal separated from notes", () => {
  const entry = normalizeJournalEntry({
    slug: "2026-04-13",
    data: {
      title: "Daily Log",
      summary: "Rest day",
      date: "2026-04-13",
      public: true
    }
  });

  assert.equal(entry.url, "/journal/2026-04-13/");
  assert.equal(entry.type, "journal");
});

test("groupTopics orders pinned notes first within a topic", () => {
  const grouped = groupTopics([
    { title: "B", topic: "marketing", pinned: false, date: "2026-04-10" },
    { title: "A", topic: "marketing", pinned: true, date: "2026-04-01" }
  ]);

  assert.equal(grouped[0].notes[0].title, "A");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/content.test.js`
Expected: FAIL with `Cannot find module '../lib/content.js'` or missing export errors.

- [ ] **Step 3: Write the failing search index test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchIndex } from "../lib/search-index.js";

test("buildSearchIndex emits lightweight records for notes and journal entries", () => {
  const records = buildSearchIndex({
    notes: [{ title: "Article 9", summary: "LangGraph", topic: "ai-regulation", tags: ["ai-act"], url: "/notes/ai-regulation/article-9/" }],
    journal: [{ title: "Daily Log", summary: "Rest day", date: "2026-04-13", url: "/journal/2026-04-13/" }]
  });

  assert.deepEqual(records[0], {
    kind: "note",
    title: "Article 9",
    summary: "LangGraph",
    topic: "ai-regulation",
    tags: ["ai-act"],
    url: "/notes/ai-regulation/article-9/"
  });
  assert.equal(records[1].kind, "journal");
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `node --test tests/search-index.test.js`
Expected: FAIL with `Cannot find module '../lib/search-index.js'`.

- [ ] **Step 5: Implement the minimal helper modules and project scripts**

```json
{
  "name": "content-workspace",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "test": "node --test"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.0"
  }
}
```

```js
// lib/content.js
const TOPIC_LABELS = {
  "ai-regulation": "AI Regulation",
  "it-audit": "IT Audit",
  "marketing": "Marketing",
  "demos": "Demos",
  "portfolio": "Portfolio",
  "prep-plans": "Prep Plans",
  "fundraising": "Fundraising"
};

function titleCaseTopic(topic) {
  return TOPIC_LABELS[topic] ?? topic.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

export function normalizeNote(entry) {
  const slug = entry.slug.split("/").pop();
  return {
    ...entry.data,
    slug,
    kind: "note",
    topicLabel: titleCaseTopic(entry.data.topic),
    tags: entry.data.tags ?? [],
    url: `/notes/${entry.data.topic}/${slug}/`
  };
}

export function normalizeJournalEntry(entry) {
  return {
    ...entry.data,
    slug: entry.slug,
    kind: "journal",
    type: "journal",
    url: `/journal/${entry.slug}/`
  };
}

export function sortByPinnedThenDate(items) {
  return [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned) || String(b.date).localeCompare(String(a.date)));
}

export function groupTopics(notes) {
  return Object.entries(notes.reduce((acc, note) => {
    acc[note.topic] ??= [];
    acc[note.topic].push(note);
    return acc;
  }, {})).map(([topic, topicNotes]) => ({
    slug: topic,
    label: titleCaseTopic(topic),
    notes: sortByPinnedThenDate(topicNotes)
  })).sort((a, b) => a.label.localeCompare(b.label));
}
```

```js
// lib/search-index.js
export function buildSearchIndex({ notes, journal }) {
  return [
    ...notes.map((note) => ({
      kind: "note",
      title: note.title,
      summary: note.summary,
      topic: note.topic,
      tags: note.tags,
      url: note.url
    })),
    ...journal.map((entry) => ({
      kind: "journal",
      title: entry.title,
      summary: entry.summary,
      topic: "journal",
      tags: [],
      url: entry.url
    }))
  ];
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `node --test tests/content.test.js tests/search-index.test.js`
Expected: PASS with `# pass 4`.

- [ ] **Step 7: Add Eleventy config and ignore rules**

```js
// .eleventy.js
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("./content/");
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}
```

```gitignore
.DS_Store
.env
.env.local
.worktrees/
node_modules/
_site/
```

- [ ] **Step 8: Run the full test suite**

Run: `npm test`
Expected: PASS with zero failures.

- [ ] **Step 9: Commit**

```bash
git add package.json .eleventy.js .gitignore lib tests
git commit -m "feat: add Eleventy workspace foundation"
```

### Task 2: Build the Workspace Shell and Generated Pages

**Files:**
- Create: `src/_data/site.js`
- Create: `src/_data/content.js`
- Create: `src/_includes/layouts/base.njk`
- Create: `src/_includes/layouts/workspace.njk`
- Create: `src/_includes/layouts/note.njk`
- Create: `src/_includes/layouts/journal-entry.njk`
- Create: `src/_includes/partials/sidebar.njk`
- Create: `src/_includes/partials/note-list.njk`
- Create: `src/_includes/partials/metadata.njk`
- Create: `src/assets/styles/site.css`
- Create: `src/assets/scripts/workspace.js`
- Create: `src/index.njk`
- Create: `src/all-notes.njk`
- Create: `src/topics.njk`
- Create: `src/journal.njk`
- Create: `src/search.json.njk`

- [ ] **Step 1: Write the failing build test**

Run: `npm run build`
Expected: FAIL because the page templates and data files do not exist.

- [ ] **Step 2: Implement content data loading and the shared workspace layouts**

```js
// src/_data/site.js
export default {
  title: "Sidhartha's Workspace",
  description: "Research, strategy, and working notes.",
  owner: "Sidhartha"
};
```

```js
// src/_data/content.js
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { normalizeNote, normalizeJournalEntry, groupTopics, sortByPinnedThenDate } from "../../lib/content.js";
import { buildSearchIndex } from "../../lib/search-index.js";
```

Implement `content.js` to:
- read Markdown entries from `content/notes` and `content/journal`
- parse frontmatter using Eleventy’s data pipeline or a small manual parser
- expose `notes`, `journal`, `topics`, `pinnedNotes`, `recentNotes`, and `searchIndex`

- [ ] **Step 3: Build the workspace shell**

Core layout responsibilities:
- `base.njk` owns document head and asset loading
- `workspace.njk` owns sidebar, mobile drawer button, and main content region
- `note.njk` renders regular note metadata and content body
- `journal-entry.njk` renders journal header with separate accent treatment

The CSS should implement:
- fixed left rail on desktop
- drawer nav on mobile
- dense note lists
- narrow reading column for note pages
- journal accent styling separate from notes

- [ ] **Step 4: Build generated pages**

Implement:
- `src/index.njk` for pinned + recent + topic overview
- `src/all-notes.njk` for browse-first index
- `src/topics.njk` using pagination for topic pages
- `src/journal.njk` for chronological journal archive
- `src/search.json.njk` returning `content.searchIndex | dump`

- [ ] **Step 5: Add lightweight client-side interaction**

`src/assets/scripts/workspace.js` should:
- open/close mobile navigation
- load `/search.json`
- filter by text, topic, and kind
- update result counts without full-page navigation

- [ ] **Step 6: Run the build to verify it succeeds**

Run: `npm run build`
Expected: PASS with Eleventy writing `index.html`, `all-notes/index.html`, `journal/index.html`, topic pages, note pages, and `search.json`.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: build workspace shell and generated pages"
```

### Task 3: Migrate Existing Content Into Markdown Sources

**Files:**
- Create: `content/notes/ai-regulation/*.md`
- Create: `content/notes/it-audit/*.md`
- Create: `content/notes/marketing/*.md`
- Create: `content/notes/demos/*.md`
- Create: `content/notes/portfolio/*.md`
- Create: `content/notes/prep-plans/*.md`
- Create: `content/notes/fundraising/*.md`
- Create: `content/journal/2026-04-12.md`
- Create: `content/journal/2026-04-13.md`

- [ ] **Step 1: Write the failing migration verification**

Run: `npm run build`
Expected: FAIL or generate empty lists because the new Markdown source files do not exist yet.

- [ ] **Step 2: Convert each existing note into Markdown + frontmatter**

Every note must follow this shape:

```md
---
title: Article 9 - LangGraph Implementation Proposal
summary: Proposal for implementing EU AI Act Article 9 compliance workflows with LangGraph.
topic: ai-regulation
tags:
  - ai-act
  - compliance
  - langgraph
date: 2026-04-12
updated: 2026-04-22
status: evergreen
pinned: true
public: true
---

# Article 9 - LangGraph Implementation Proposal

...converted Markdown body...
```

Migration rule:
- preserve the substantive text
- strip presentational HTML-only chrome
- keep headings, bullets, tables, and links where possible
- keep demos as notes unless their content is purely visual playback

- [ ] **Step 3: Move daily logs into `content/journal`**

Journal shape:

```md
---
title: Daily Log
summary: Rest day, recharge, and personal notes.
date: 2026-04-13
public: true
---

# Daily Log - April 13, 2026

...existing journal Markdown body...
```

- [ ] **Step 4: Run the build and inspect generated counts**

Run: `npm run build`
Expected: PASS, with 15 note pages and 2 journal pages generated from Markdown sources.

- [ ] **Step 5: Commit**

```bash
git add content
git commit -m "feat: migrate notes and journal to markdown sources"
```

### Task 4: Retire the Manual Site Model and Add Deployment

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `README.md`
- Delete: `update_index.py`
- Delete: `build_journal.py`
- Delete: `index.html`
- Delete: `journal.html`
- Delete: legacy `*.html` content files after equivalent Markdown files are verified

- [ ] **Step 1: Write the failing deploy verification**

Run: `npm run build`
Expected: PASS before deletion, establishing the generated site as the new source of published HTML.

- [ ] **Step 2: Add the GitHub Pages workflow**

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Update the README**

Document:
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- content authoring rules for Markdown + frontmatter

- [ ] **Step 4: Remove the obsolete manual site files**

Delete only after the generated site is verified:
- `update_index.py`
- `build_journal.py`
- root `index.html`
- root `journal.html`
- old HTML note files

- [ ] **Step 5: Run verification after removal**

Run: `npm test`
Expected: PASS.

Run: `npm run build`
Expected: PASS with all published pages generated from Eleventy only.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/pages.yml README.md . && git commit -m "feat: ship markdown workspace on github pages"
```

## Self-Review

### Spec Coverage

- Workspace-first IA: covered by Task 2 layouts and generated pages.
- Markdown + frontmatter source model: covered by Task 3 migration.
- Lightweight search and filters: covered by Task 2 search index and client script.
- Separate journal area: covered by Task 2 journal layout and Task 3 journal migration.
- GitHub Pages deployability: covered by Task 4 workflow.

### Placeholder Scan

Plan contains exact paths, commands, expected results, and code for the critical helper modules and workflow files. No `TBD` / `TODO` placeholders remain.

### Consistency Check

The same normalized shapes are used throughout:
- `normalizeNote()` returns `kind: "note"` and `/notes/<topic>/<slug>/`
- `normalizeJournalEntry()` returns `kind: "journal"` and `/journal/<slug>/`
- `buildSearchIndex()` consumes `notes` and `journal` arrays from the shared content layer

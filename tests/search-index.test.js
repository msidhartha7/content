import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchIndex } from "../lib/search-index.js";

test("buildSearchIndex emits lightweight records for notes and journal entries", () => {
  const records = buildSearchIndex({
    notes: [
      {
        title: "Article 9",
        summary: "LangGraph",
        topic: "ai-regulation",
        tags: ["ai-act"],
        url: "/notes/ai-regulation/article-9/"
      }
    ],
    journal: [
      {
        title: "Daily Log",
        summary: "Rest day",
        date: "2026-04-13",
        url: "/journal/2026-04-13/"
      }
    ]
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

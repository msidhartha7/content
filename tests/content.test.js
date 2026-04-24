import test from "node:test";
import assert from "node:assert/strict";
import { groupTopics, normalizeJournalEntry, normalizeNote, normalizeProjectEntry } from "../lib/content.js";

test("normalizeNote derives slug, url, and searchable metadata", () => {
  const note = normalizeNote({
    slug: "eu-ai-act/article-9",
    data: {
      title: "Article 9",
      summary: "LangGraph proposal",
      topic: "ai-regulation",
      legacyPath: "ai-regulation/EU AI Act Article 9 Langgraph Proposal.html",
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
  assert.equal(note.iframeSrc, "/ai-regulation/EU%20AI%20Act%20Article%209%20Langgraph%20Proposal.html");
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

test("normalizeProjectEntry derives a project url and title from markdown content", () => {
  const project = normalizeProjectEntry({
    slug: "echo-court-project-plan",
    data: {},
    rawContent: `# EchoCourt\n\nA verifiable legal research platform.\n\n## Details\nMore text.`
  });

  assert.equal(project.kind, "project");
  assert.equal(project.topic, "projects");
  assert.equal(project.topicLabel, "Projects");
  assert.equal(project.title, "EchoCourt");
  assert.equal(project.summary, "A verifiable legal research platform.");
  assert.equal(project.url, "/projects/echo-court-project-plan/");
});

test("groupTopics orders pinned notes first within a topic", () => {
  const grouped = groupTopics([
    { title: "B", topic: "marketing", pinned: false, date: "2026-04-10" },
    { title: "A", topic: "marketing", pinned: true, date: "2026-04-01" }
  ]);

  assert.equal(grouped[0].notes[0].title, "A");
});

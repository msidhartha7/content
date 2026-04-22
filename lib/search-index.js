import { withBasePath } from "./content.js";

export function buildSearchIndex({ notes, journal }) {
  return [
    ...notes.map((note) => ({
      kind: "note",
      title: note.title,
      summary: note.summary,
      topic: note.topic,
      tags: note.tags ?? [],
      url: withBasePath(note.url)
    })),
    ...journal.map((entry) => ({
      kind: "journal",
      title: entry.title,
      summary: entry.summary,
      topic: "journal",
      tags: [],
      url: withBasePath(entry.url)
    }))
  ];
}

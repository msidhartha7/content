import { PROJECTS_LABEL, withBasePath } from "./content.js";

export function buildSearchIndex({ notes, journal, projects = [] }) {
  return [
    ...notes.map((note) => ({
      kind: "note",
      title: note.title,
      summary: note.summary,
      topic: note.topic,
      ...(note.topicLabel ? { topicLabel: note.topicLabel } : {}),
      tags: note.tags ?? [],
      url: withBasePath(note.url)
    })),
    ...journal.map((entry) => ({
      kind: "journal",
      title: entry.title,
      summary: entry.summary,
      topic: "journal",
      topicLabel: "Startup Journal",
      tags: [],
      url: withBasePath(entry.url)
    })),
    ...projects.map((project) => ({
      kind: "project",
      title: project.title,
      summary: project.summary,
      topic: "projects",
      topicLabel: project.topicLabel ?? PROJECTS_LABEL,
      tags: project.tags ?? [],
      url: withBasePath(project.url)
    }))
  ];
}

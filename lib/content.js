export const SITE_BASE_PATH = "/content/";

export const TOPIC_LABELS = {
  "ai-regulation": "AI Regulation",
  "it-audit": "IT Audit",
  marketing: "Marketing",
  demos: "Demos",
  portfolio: "Portfolio",
  "prep-plans": "Prep Plans",
  fundraising: "Fundraising"
};

export function titleCaseTopic(topic) {
  if (TOPIC_LABELS[topic]) {
    return TOPIC_LABELS[topic];
  }

  return topic
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildLegacyIframeSrc(legacyPath) {
  return legacyPath ? `/${encodeURI(legacyPath)}` : null;
}

export function withBasePath(pathname) {
  if (!pathname) {
    return SITE_BASE_PATH;
  }

  const normalizedBase = SITE_BASE_PATH.endsWith("/") ? SITE_BASE_PATH.slice(0, -1) : SITE_BASE_PATH;
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPath === "/") {
    return `${normalizedBase}/`;
  }

  if (normalizedPath.startsWith(`${normalizedBase}/`)) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function normalizeNote(entry) {
  const slug = entry.slug.split("/").pop();

  return {
    ...entry.data,
    kind: "note",
    slug,
    tags: entry.data.tags ?? [],
    topicLabel: titleCaseTopic(entry.data.topic),
    iframeSrc: buildLegacyIframeSrc(entry.data.legacyPath),
    url: `/notes/${entry.data.topic}/${slug}/`
  };
}

export function normalizeJournalEntry(entry) {
  return {
    ...entry.data,
    kind: "journal",
    type: "journal",
    slug: entry.slug,
    url: `/journal/${entry.slug}/`
  };
}

export function sortByPinnedThenDate(items) {
  return [...items].sort(
    (left, right) =>
      Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)) ||
      String(right.date ?? "").localeCompare(String(left.date ?? "")) ||
      String(left.title ?? "").localeCompare(String(right.title ?? ""))
  );
}

export function groupTopics(notes) {
  const groups = new Map();

  for (const note of notes) {
    if (!groups.has(note.topic)) {
      groups.set(note.topic, []);
    }

    groups.get(note.topic).push(note);
  }

  return [...groups.entries()]
    .map(([slug, topicNotes]) => ({
      slug,
      label: titleCaseTopic(slug),
      notes: sortByPinnedThenDate(topicNotes)
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

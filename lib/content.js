import { relative, sep } from "node:path";

export const SITE_BASE_PATH = "/content/";
export const PROJECTS_LABEL = "Projects";

export const TOPIC_LABELS = {
  "ai-regulation": "AI Regulation",
  "it-audit": "IT Audit",
  marketing: "Marketing",
  demos: "Demos",
  portfolio: "Portfolio",
  "prep-plans": "Prep Plans",
  fundraising: "Fundraising",
  projects: PROJECTS_LABEL
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

export function humanizeSlug(value) {
  return value
    .split(/[\/\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugifySegment(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdownFormatting(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~>#]/g, "")
    .trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripHtmlFormatting(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
}

function extractHtmlTitle(rawContent) {
  const titleMatch = rawContent?.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    return stripHtmlFormatting(titleMatch[1]);
  }

  const headingMatch = rawContent?.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return headingMatch ? stripHtmlFormatting(headingMatch[1]) : null;
}

function extractHtmlSummary(rawContent) {
  if (!rawContent) {
    return null;
  }

  const descriptionMatch = rawContent.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (descriptionMatch) {
    return decodeHtmlEntities(descriptionMatch[1].trim());
  }

  const bodyContent = rawContent
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  const paragraphMatch = bodyContent.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return paragraphMatch ? stripHtmlFormatting(paragraphMatch[1]) : null;
}

function isHtmlInputPath(inputPath) {
  return inputPath?.toLowerCase().endsWith(".html");
}

function deriveLegacyPath({ data, inputPath }) {
  if (data.legacyPath) {
    return data.legacyPath;
  }

  if (!isHtmlInputPath(inputPath)) {
    return null;
  }

  return relative(process.cwd(), inputPath).split(sep).join("/");
}

export function extractMarkdownTitle(rawContent) {
  const match = rawContent?.match(/^#\s+(.+)$/m);
  return match ? stripMarkdownFormatting(match[1]) : null;
}

export function extractMarkdownSummary(rawContent) {
  if (!rawContent) {
    return null;
  }

  const lines = rawContent.split(/\r?\n/);
  const paragraph = [];
  let skippedTitle = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (paragraph.length) {
        break;
      }
      continue;
    }

    if (!skippedTitle && trimmed.startsWith("# ")) {
      skippedTitle = true;
      continue;
    }

    if (trimmed.startsWith("#")) {
      if (paragraph.length) {
        break;
      }
      continue;
    }

    paragraph.push(trimmed);
  }

  if (!paragraph.length) {
    return null;
  }

  return stripMarkdownFormatting(paragraph.join(" "));
}

export function extractSourceTitle(rawContent, inputPath) {
  return isHtmlInputPath(inputPath) ? extractHtmlTitle(rawContent) : extractMarkdownTitle(rawContent);
}

export function extractSourceSummary(rawContent, inputPath) {
  return isHtmlInputPath(inputPath) ? extractHtmlSummary(rawContent) : extractMarkdownSummary(rawContent);
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

export function normalizeProjectEntry(entry) {
  const sourceSlug = entry.slug.split("/").pop();
  const slug = slugifySegment(sourceSlug);
  const legacyPath = deriveLegacyPath(entry);
  const title = entry.data.title ?? extractSourceTitle(entry.rawContent, entry.inputPath) ?? humanizeSlug(sourceSlug);

  return {
    ...entry.data,
    kind: "project",
    type: "project",
    slug,
    title,
    summary: entry.data.summary ?? extractSourceSummary(entry.rawContent, entry.inputPath),
    topic: "projects",
    topicLabel: PROJECTS_LABEL,
    legacyPath,
    iframeSrc: buildLegacyIframeSrc(legacyPath),
    tags: entry.data.tags ?? [],
    url: `/projects/${slug}/`
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

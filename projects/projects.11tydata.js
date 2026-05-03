import { readFileSync } from "node:fs";
import { relative, sep } from "node:path";
import {
  buildLegacyIframeSrc,
  extractSourceSummary,
  extractSourceTitle,
  humanizeSlug,
  PROJECTS_LABEL,
  slugifySegment
} from "../lib/content.js";

function readSource(data) {
  return readFileSync(data.page.inputPath, "utf8");
}

function deriveLegacyPath(data) {
  if (data.legacyPath) {
    return data.legacyPath;
  }

  if (!data.page.inputPath.toLowerCase().endsWith(".html")) {
    return null;
  }

  return relative(process.cwd(), data.page.inputPath).split(sep).join("/");
}

export default {
  tags: ["projects"],
  layout: "layouts/project.njk",
  eleventyComputed: {
    title: (data) => data.title ?? extractSourceTitle(readSource(data), data.page.inputPath) ?? humanizeSlug(data.page.fileSlug),
    summary: (data) => data.summary ?? extractSourceSummary(readSource(data), data.page.inputPath),
    topicLabel: () => PROJECTS_LABEL,
    legacyPath: (data) => deriveLegacyPath(data),
    iframeSrc: (data) => buildLegacyIframeSrc(deriveLegacyPath(data)),
    permalink: (data) => {
      if (data.public === false) {
        return false;
      }

      return `/projects/${slugifySegment(data.page.fileSlug)}/index.html`;
    }
  }
};

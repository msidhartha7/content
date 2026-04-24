import { readFileSync } from "node:fs";
import { extractMarkdownSummary, extractMarkdownTitle, humanizeSlug, PROJECTS_LABEL, slugifySegment } from "../lib/content.js";

function readSource(data) {
  return readFileSync(data.page.inputPath, "utf8");
}

export default {
  tags: ["projects"],
  layout: "layouts/project.njk",
  eleventyComputed: {
    title: (data) => data.title ?? extractMarkdownTitle(readSource(data)) ?? humanizeSlug(data.page.fileSlug),
    summary: (data) => data.summary ?? extractMarkdownSummary(readSource(data)),
    topicLabel: () => PROJECTS_LABEL,
    permalink: (data) => {
      if (data.public === false) {
        return false;
      }

      return `/projects/${slugifySegment(data.page.fileSlug)}/index.html`;
    }
  }
};

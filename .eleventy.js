import { readFileSync } from "node:fs";
import { buildSearchIndex } from "./lib/search-index.js";
import { groupTopics, normalizeJournalEntry, normalizeNote, normalizeProjectEntry, SITE_BASE_PATH, sortByPinnedThenDate } from "./lib/content.js";

function readSourceFile(item) {
  return readFileSync(item.inputPath ?? item.page.inputPath, "utf8");
}

function getPublicItems(collectionApi, glob) {
  return collectionApi.getFilteredByGlob(glob).filter((item) => item.data.public !== false);
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("ai-regulation");
  eleventyConfig.addPassthroughCopy("it-audit");
  eleventyConfig.addPassthroughCopy("marketing");
  eleventyConfig.addPassthroughCopy("demos");
  eleventyConfig.addPassthroughCopy("portfolio");
  eleventyConfig.addPassthroughCopy("prep-plans");
  eleventyConfig.addPassthroughCopy("fundraising");
  eleventyConfig.addWatchTarget("./content/");
  eleventyConfig.addWatchTarget("./projects/");
  eleventyConfig.addFilter("take", (items, count) => items.slice(0, count));
  eleventyConfig.addFilter("sortByPinnedThenDate", sortByPinnedThenDate);
  eleventyConfig.addFilter("pinnedOnly", (items) => sortByPinnedThenDate(items).filter((item) => item.pinned));
  eleventyConfig.addFilter("recent", (items, count = 6) => sortByPinnedThenDate(items).slice(0, count));
  eleventyConfig.addFilter("humanDate", formatDate);
  eleventyConfig.addFilter("dump", (value) => JSON.stringify(value, null, 2));

  eleventyConfig.addCollection("notes", (collectionApi) =>
    sortByPinnedThenDate(
      getPublicItems(collectionApi, "content/notes/**/*.md").map((item) =>
        normalizeNote({ slug: item.page.fileSlug, data: item.data })
      )
    )
  );

  eleventyConfig.addCollection("journal", (collectionApi) =>
    sortByPinnedThenDate(
      getPublicItems(collectionApi, "content/journal/*.md").map((item) =>
        normalizeJournalEntry({ slug: item.page.fileSlug, data: item.data })
      )
    )
  );

  eleventyConfig.addCollection("projects", (collectionApi) =>
    sortByPinnedThenDate(
      getPublicItems(collectionApi, "projects/**/*.md").map((item) =>
        normalizeProjectEntry({ slug: item.page.fileSlug, data: item.data, rawContent: readSourceFile(item) })
      )
    )
  );

  eleventyConfig.addCollection("topicBuckets", (collectionApi) =>
    groupTopics(
      getPublicItems(collectionApi, "content/notes/**/*.md").map((item) =>
        normalizeNote({ slug: item.page.fileSlug, data: item.data })
      )
    )
  );

  eleventyConfig.addCollection("searchRecords", (collectionApi) => {
    const notes = getPublicItems(collectionApi, "content/notes/**/*.md").map((item) =>
      normalizeNote({ slug: item.page.fileSlug, data: item.data })
    );
    const journal = getPublicItems(collectionApi, "content/journal/*.md").map((item) =>
      normalizeJournalEntry({ slug: item.page.fileSlug, data: item.data })
    );
    const projects = getPublicItems(collectionApi, "projects/**/*.md").map((item) =>
      normalizeProjectEntry({ slug: item.page.fileSlug, data: item.data, rawContent: readSourceFile(item) })
    );
    return buildSearchIndex({ notes, journal, projects });
  });

  return {
    pathPrefix: SITE_BASE_PATH,
    dir: {
      input: ".",
      includes: "src/_includes",
      data: "src/_data",
      output: "_site"
    }
  };
}

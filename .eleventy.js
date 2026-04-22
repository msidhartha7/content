import { buildSearchIndex } from "./lib/search-index.js";
import { groupTopics, normalizeJournalEntry, normalizeNote, sortByPinnedThenDate } from "./lib/content.js";

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
  eleventyConfig.addFilter("take", (items, count) => items.slice(0, count));
  eleventyConfig.addFilter("sortByPinnedThenDate", sortByPinnedThenDate);
  eleventyConfig.addFilter("pinnedOnly", (items) => sortByPinnedThenDate(items).filter((item) => item.pinned));
  eleventyConfig.addFilter("recent", (items, count = 6) => sortByPinnedThenDate(items).slice(0, count));
  eleventyConfig.addFilter("humanDate", formatDate);
  eleventyConfig.addFilter("dump", (value) => JSON.stringify(value, null, 2));

  eleventyConfig.addCollection("notes", (collectionApi) =>
    sortByPinnedThenDate(
      collectionApi
        .getFilteredByGlob("content/notes/**/*.md")
        .filter((item) => item.data.public !== false)
        .map((item) => normalizeNote({ slug: item.page.fileSlug, data: item.data }))
    )
  );

  eleventyConfig.addCollection("journal", (collectionApi) =>
    sortByPinnedThenDate(
      collectionApi
        .getFilteredByGlob("content/journal/*.md")
        .filter((item) => item.data.public !== false)
        .map((item) => normalizeJournalEntry({ slug: item.page.fileSlug, data: item.data }))
    )
  );

  eleventyConfig.addCollection("topicBuckets", (collectionApi) =>
    groupTopics(
      collectionApi
        .getFilteredByGlob("content/notes/**/*.md")
        .filter((item) => item.data.public !== false)
        .map((item) => normalizeNote({ slug: item.page.fileSlug, data: item.data }))
    )
  );

  eleventyConfig.addCollection("searchRecords", (collectionApi) => {
    const notes = collectionApi.getAllSorted().filter((item) => item.data.tags?.includes("notes")).map((item) =>
      normalizeNote({ slug: item.page.fileSlug, data: item.data })
    );
    const journal = collectionApi.getAllSorted().filter((item) => item.data.tags?.includes("journal")).map((item) =>
      normalizeJournalEntry({ slug: item.page.fileSlug, data: item.data })
    );
    return buildSearchIndex({ notes, journal });
  });

  return {
    dir: {
      input: ".",
      includes: "src/_includes",
      data: "src/_data",
      output: "_site"
    }
  };
}

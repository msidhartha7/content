export default {
  tags: ["journal"],
  layout: "layouts/journal-entry.njk",
  eleventyComputed: {
    kind: () => "journal",
    permalink: (data) => {
      if (data.public === false) {
        return false;
      }

      return `/journal/${data.page.fileSlug}/index.html`;
    }
  }
};

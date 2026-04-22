import { buildLegacyIframeSrc, titleCaseTopic } from "../../lib/content.js";

export default {
  tags: ["notes"],
  layout: "layouts/note.njk",
  eleventyComputed: {
    kind: () => "note",
    topicLabel: (data) => titleCaseTopic(data.topic),
    iframeSrc: (data) => buildLegacyIframeSrc(data.legacyPath),
    permalink: (data) => {
      if (data.public === false) {
        return false;
      }

      return `/notes/${data.topic}/${data.page.fileSlug}/index.html`;
    }
  }
};

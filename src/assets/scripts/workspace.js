const sidebar = document.querySelector("[data-sidebar]");
const toggle = document.querySelector("[data-nav-toggle]");
const searchInput = document.querySelector("[data-search-input]");
const searchFilter = document.querySelector("[data-search-filter]");
const searchResults = document.querySelector("[data-search-results]");
const fullscreenButton = document.querySelector("[data-frame-fullscreen]");
const iframeTarget = document.querySelector(".legacy-frame");
const searchUrl = document.body.dataset.searchUrl;

if (toggle && sidebar) {
  toggle.addEventListener("click", () => {
    const next = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", next);
    toggle.setAttribute("aria-expanded", String(next));
  });
}

if (searchInput && searchResults) {
  let records = [];

  const renderResults = () => {
    const query = searchInput.value.trim().toLowerCase();
    const scope = searchFilter?.value ?? "all";

    if (!query && scope === "all") {
      searchResults.classList.remove("is-visible");
      searchResults.innerHTML = "";
      return;
    }

    const matches = records
      .filter((record) => {
        if (scope !== "all" && record.topic !== scope && record.kind !== scope) {
          return false;
        }

        if (!query) {
          return true;
        }

        const haystack = [record.title, record.summary, record.topic, ...(record.tags ?? [])]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .slice(0, 8);

    searchResults.classList.add("is-visible");
    searchResults.innerHTML = matches.length
      ? matches
          .map(
            (match) => `
              <a class="note-card" href="${match.url}">
                <div class="note-card-copy">
                  <div class="note-card-header">
                    <span class="note-kind">${match.topicLabel ?? (match.kind === "journal" ? "Startup Journal" : match.topic)}</span>
                  </div>
                  <h3>${match.title}</h3>
                  ${match.summary ? `<p>${match.summary}</p>` : ""}
                </div>
              </a>
            `
          )
          .join("")
      : '<div class="panel"><p class="brand-copy">No matching items yet.</p></div>';
  };

  fetch(searchUrl)
    .then((response) => response.json())
    .then((payload) => {
      records = payload;
      searchInput.addEventListener("input", renderResults);
      searchFilter?.addEventListener("change", renderResults);
    })
    .catch(() => {
      searchResults.classList.add("is-visible");
      searchResults.innerHTML = '<div class="panel"><p class="brand-copy">Search index unavailable.</p></div>';
    });
}

if (fullscreenButton && iframeTarget) {
  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement === iframeTarget) {
      await document.exitFullscreen();
      return;
    }

    if (iframeTarget.requestFullscreen) {
      await iframeTarget.requestFullscreen();
    }
  });
}

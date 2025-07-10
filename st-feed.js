document.addEventListener("DOMContentLoaded", () => {
  (async function () {
    const feedUrl = "https://newruralvirginia.substack.com/feed";
    const apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);

    try {
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      const container = document.getElementById("substack-feed");
      if (!container) return;

      container.classList.add("substack-feed-grid");

      data.items.slice(0, 6).forEach((item, index) => {
        // Get image: prefer thumbnail, then fallback to first <img> in content
        let imgSrc = item.thumbnail;
        if (!imgSrc) {
          const imgMatch = item.content.match(/<img.*?src="(.*?)"/);
          imgSrc = imgMatch ? imgMatch[1] : null;
        }

        // Strip HTML from content and truncate to ~120 words
        const plainText = item.content.replace(/(<([^>]+)>)/gi, "");
        const previewText = plainText.split(" ").slice(0, 120).join(" ") + "...";

        const card = document.createElement("div");
        card.className = "substack-post" + (index === 0 ? " featured" : "");

        card.innerHTML = `
          ${imgSrc ? `<div class="substack-post-image"><img src="${imgSrc}" alt=""></div>` : ""}
          <div class="substack-post-content">
            <h3 class="substack-post-title">${item.title}</h3>
            <small class="substack-post-date">${new Date(item.pubDate).toLocaleDateString()}</small>
            <p class="substack-post-snippet">${previewText}</p>
            <a href="${item.link}" target="_blank" class="substack-post-button">Read more</a>
          </div>
        `;

        container.appendChild(card);
      });
    } catch (e) {
      console.error("Failed to load Substack feed", e);
    }
  })();
});

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

      data.items.slice(0, 6).forEach((item) => {
        const imgMatch = item.description.match(/<img.*?src="(.*?)"/);
        const imgSrc = imgMatch ? imgMatch[1] : null;

        const card = document.createElement("div");
        card.className = "substack-post";

        card.innerHTML = `
          ${imgSrc ? `<div class="substack-post-image"><img src="${imgSrc}" alt=""></div>` : ""}
          <div class="substack-post-content">
            <h3 class="substack-post-title">${item.title}</h3>
            <small class="substack-post-date">${new Date(item.pubDate).toLocaleDateString()}</small>
            <p class="substack-post-snippet">${item.description.replace(/(<([^>]+)>)/gi, "").split(" ").slice(0, 30).join(" ")}...</p>
            <a href="${item.link}" target="_blank" class="substack-post-button">Read on Substack</a>
          </div>
        `;

        container.appendChild(card);
      });
    } catch (e) {
      console.error("Failed to load Substack feed", e);
    }
  })();
});

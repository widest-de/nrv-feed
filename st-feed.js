(async function() {
  const feedUrl = "https://newruralvirginia.substack.com/feed";
  const apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
  try {
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    const container = document.getElementById("substack-feed");
    if (!container) return;
    container.innerHTML = "";
    data.items.slice(0, 5).forEach(item => {
      const imgMatch = item.description.match(/<img.*?src="(.*?)"/);
      const imgSrc = imgMatch ? imgMatch[1] : null;

      const post = document.createElement("div");
      post.style.borderBottom = "1px solid #ddd";
      post.style.paddingBottom = "2em";
      post.style.marginBottom = "2em";
      post.style.display = "flex";
      post.style.flexWrap = "wrap";
      post.style.gap = "1em";

      post.innerHTML = \`
        \${imgSrc
          ? \`<img src="\${imgSrc}" alt="" style="width: 120px; height: auto; object-fit: cover;">\`
          : ""}
        <div style="flex: 1; min-width: 200px;">
          <h3 style="margin:0.2em 0; font-size:1.25em">
            <a href="\${item.link}" target="_blank" style="text-decoration:none;color:#2c3e50">
              \${item.title}
            </a>
          </h3>
          <small style="color:#7f8c8d">
            \${new Date(item.pubDate).toLocaleDateString()}
          </small>
          <p style="margin:0.5em 0;color:#444">
            \${item.description.replace(/<[^>]*>?/gm, "").split(" ").slice(0,30).join(" ")}...
          </p>
        </div>\`;
      container.appendChild(post);
    });
  } catch(e) {
    console.error("Failed to load Substack feed:", e);
  }
})();

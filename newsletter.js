
let newsletters = [];
let selectedCategory = "전체";

const $ = (id) => document.getElementById(id);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function formatDate(date) {
  return new Date(date + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function categoryTags(categories) {
  return categories.map(category =>
    `<a class="category-tag"
        href="newsletter.html?category=${encodeURIComponent(category)}"
        onclick="event.stopPropagation()">
        ${escapeHTML(category)}
     </a>`
  ).join("");
}

// 뉴스레터 불러오기
async function loadNewsletters() {
  try {
    const response = await fetch("newsletter.json");
    if (!response.ok) throw new Error("JSON 로딩 실패");

    newsletters = await response.json();
    newsletters.sort((a, b) => b.date.localeCompare(a.date));

    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const category = params.get("category");

    if (id) {
      showDetail(id, false);
      return;
    }

    if (category) {
      selectedCategory = category;
    }

    renderCategories();
    renderNewsletters();
  } catch (error) {
    $("newsletter-list").innerHTML =
      "<p>뉴스레터를 불러오지 못했습니다. JSON 파일을 확인해주세요.</p>";
    console.error(error);
  }
}

// 카테고리 선택 버튼
function renderCategories() {
  const categories = ["전체", ...new Set(
    newsletters.flatMap(item => item.category || [])
  )];

  $("category-list").innerHTML = categories.map(category => `
    <button class="category-btn
      ${category === selectedCategory ? "active" : ""}"
      data-category="${escapeHTML(category)}">
      ${escapeHTML(category)}
    </button>
  `).join("");

  $("category-list").querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      selectCategory(button.dataset.category);
    });
  });
}

// 카테고리 선택 및 URL 갱신
function selectCategory(category) {
  selectedCategory = category;

  const url = new URL(location.href);
  url.searchParams.delete("id");

  if (category === "전체") {
    url.searchParams.delete("category");
  } else {
    url.searchParams.set("category", category);
  }

  history.pushState({}, "", url);
  $("newsletter-detail").hidden = true;
  $("newsletter-list").hidden = false;

  renderCategories();
  renderNewsletters();
  window.scrollTo(0, 0);
}

// 최신 뉴스레터와 지난 뉴스레터 목록
function renderNewsletters() {
  const filtered = newsletters.filter(item =>
    selectedCategory === "전체" ||
    (item.category || []).includes(selectedCategory)
  );

  const featured = newsletters[0];
  const showFeatured = featured &&
    (selectedCategory === "전체" ||
     (featured.category || []).includes(selectedCategory));

  $("featured-newsletter").innerHTML = showFeatured ? `
    <article class="featured-card"
      onclick="showDetail('${featured.id}')">
      <img class="featured-image"
        src="${escapeHTML(featured.thumbnail)}"
        alt="${escapeHTML(featured.title)}">
      <div class="featured-info">
        <span class="newsletter-meta">
          ${formatDate(featured.date)} · ${escapeHTML(featured.issue)}
        </span>
        <h2>${escapeHTML(featured.title)}</h2>
        <p class="newsletter-summary">
          ${escapeHTML(featured.summary)}
        </p>
        <div class="category-tags">
          ${categoryTags(featured.category || [])}
        </div>
        <p class="read-more">전문 읽기 ↗</p>
      </div>
    </article>
  ` : "";

  const archive = filtered.filter(item =>
    !showFeatured || item.id !== featured.id
  );

  $("result-count").textContent = `${archive.length}개의 뉴스레터`;

  $("newsletter-grid").innerHTML = archive.length
    ? archive.map(item => `
      <article class="newsletter-card"
        onclick="showDetail('${item.id}')">
        <img src="${escapeHTML(item.thumbnail)}"
          alt="${escapeHTML(item.title)}">
        <div class="newsletter-card-info">
          <span class="newsletter-meta">
            ${formatDate(item.date)} · ${escapeHTML(item.issue)}
          </span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.summary)}</p>
          <div class="category-tags">
            ${categoryTags(item.category || [])}
          </div>
        </div>
      </article>
    `).join("")
    : "<p>해당 카테고리의 뉴스레터가 없습니다.</p>";
}

// 뉴스레터 전문 보기
function showDetail(id, updateURL = true) {
  const item = newsletters.find(news => String(news.id) === String(id));
  if (!item) return;

  if (updateURL) {
    const url = new URL(location.href);
    url.searchParams.set("id", id);
    url.searchParams.delete("category");
    history.pushState({}, "", url);
  }

  $("newsletter-list").hidden = true;
  $("newsletter-detail").hidden = false;

  $("detail-content").innerHTML = `
    <article class="detail-article">
      <div class="newsletter-meta">
        ${formatDate(item.date)} · ${escapeHTML(item.issue)}
      </div>
      <h1>${escapeHTML(item.title)}</h1>
      <p class="newsletter-summary">
        ${escapeHTML(item.summary)}
      </p>
      <div class="category-tags detail-categories">
        ${categoryTags(item.category || [])}
      </div>
      <img class="detail-cover"
        src="${escapeHTML(item.thumbnail)}"
        alt="${escapeHTML(item.title)}">
      <div class="detail-body">
        ${(item.content || []).map(paragraph =>
          `<p>${escapeHTML(paragraph)}</p>`
        ).join("")}
      </div>
    </article>
  `;

  window.scrollTo(0, 0);
}

// 목록으로 돌아가기
function showList() {
  const url = new URL(location.href);
  url.searchParams.delete("id");
  history.pushState({}, "", url);

  $("newsletter-detail").hidden = true;
  $("newsletter-list").hidden = false;

  const category = url.searchParams.get("category");
  selectedCategory = category || "전체";

  renderCategories();
  renderNewsletters();
  window.scrollTo(0, 0);
}

// 브라우저 뒤로 가기 / 앞으로 가기
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (id) {
    showDetail(id, false);
  } else {
    $("newsletter-detail").hidden = true;
    $("newsletter-list").hidden = false;
    selectedCategory = params.get("category") || "전체";
    renderCategories();
    renderNewsletters();
  }
});

loadNewsletters();
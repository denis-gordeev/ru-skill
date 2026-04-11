const { normalizeProductUrl, parseProductPage, parseSearchResults } = require("./parse");

const YANDEX_MARKET_BASE_URL = "https://market.yandex.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "accept-language": "ru-RU,ru;q=0.9",
  "user-agent": "ru-skill/yandex-market-search",
};

async function fetchHtml(url, opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const response = await fetcher(url, {
    headers: {
      ...DEFAULT_HEADERS,
      ...(opts.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Yandex Market request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

function buildSearchUrl(query, opts = {}) {
  const url = new URL("/search", YANDEX_MARKET_BASE_URL);
  url.searchParams.set("text", query);

  if (opts.page && Number(opts.page) > 1) {
    url.searchParams.set("page", String(opts.page));
  }

  return url.toString();
}

function buildProductUrl(slug, productId) {
  return `${YANDEX_MARKET_BASE_URL}/card/${slug}/${productId}`;
}

async function searchProducts(query, opts = {}) {
  const url = buildSearchUrl(query, opts);
  const html = await fetchHtml(url, opts);
  const parsed = parseSearchResults(html, query);

  return {
    ...parsed,
    page: opts.page || 1,
  };
}

async function getProduct(productUrl, opts = {}) {
  const url = normalizeProductUrl(productUrl);
  if (!url) {
    throw new Error("productUrl is required");
  }

  const html = await fetchHtml(url, opts);
  return parseProductPage(html, url);
}

module.exports = {
  YANDEX_MARKET_BASE_URL,
  buildProductUrl,
  buildSearchUrl,
  fetchHtml,
  getProduct,
  searchProducts,
};

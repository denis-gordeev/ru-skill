const { parseSearchResults, parseBusinessPage, normalizeBusinessUrl } = require("./parse");

const ZOON_BASE_URL = "https://zoon.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "accept-language": "ru-RU,ru;q=0.9",
  "user-agent": "ru-skill/zoon-nearby",
};

// Category mappings for common search types
const CATEGORY_MAP = {
  restaurant: 'restaurants',
  cafe: 'cafes',
  bar: 'bars',
  hotel: 'hotels',
  pharmacy: 'pharmacies',
  shop: 'shops',
  beauty: 'beauty_salon',
  gym: 'fitness',
};

function buildCategoryUrl(city, category, opts = {}) {
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '_');
  const normalizedCategory = CATEGORY_MAP[category] || category;
  
  const url = new URL(`/${normalizedCity}/${normalizedCategory}`, ZOON_BASE_URL);
  
  if (opts.page && Number(opts.page) > 1) {
    url.searchParams.set('page', String(opts.page));
  }
  
  return url.toString();
}

function buildSearchUrl(query, city, opts = {}) {
  const url = new URL('/search', ZOON_BASE_URL);
  url.searchParams.set('search_term', query);
  
  if (city) {
    url.searchParams.set('near', city);
  }
  
  if (opts.page && Number(opts.page) > 1) {
    url.searchParams.set('page', String(opts.page));
  }
  
  return url.toString();
}

async function fetchHtml(url, opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const response = await fetcher(url, {
    headers: {
      ...DEFAULT_HEADERS,
      ...(opts.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Zoon request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

/**
 * Search businesses by category in a city
 * @param {string} city - City name (e.g., 'Москва', 'Санкт-Петербург')
 * @param {string} category - Category (e.g., 'restaurants', 'cafes', 'bars')
 * @param {{ page?: number }} opts
 * @returns {Promise<{ businesses: Array<{name: string, address?: string, rating?: string, phone?: string, category?: string, url?: string}>, totalCount?: number, pagination: {hasNextPage: boolean, nextPage?: number}, query: string }>}
 */
async function searchByCategory(city, category, opts = {}) {
  const url = buildCategoryUrl(city, category, opts);
  const html = await fetchHtml(url, opts);
  const parsed = parseSearchResults(html, `${city} ${category}`);
  
  return {
    ...parsed,
    page: opts.page || 1,
  };
}

/**
 * Search restaurants in a city
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchRestaurants(city, opts = {}) {
  return searchByCategory(city, 'restaurant', opts);
}

/**
 * Search cafes in a city
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchCafes(city, opts = {}) {
  return searchByCategory(city, 'cafe', opts);
}

/**
 * Search bars in a city
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchBars(city, opts = {}) {
  return searchByCategory(city, 'bar', opts);
}

/**
 * General search on Zoon.ru
 * @param {string} query - Search term
 * @param {string} [city] - Optional city for context
 * @param {{ page?: number }} opts
 */
async function search(query, city, opts = {}) {
  const url = buildSearchUrl(query, city, opts);
  const html = await fetchHtml(url, opts);
  const parsed = parseSearchResults(html, query);
  
  return {
    ...parsed,
    page: opts.page || 1,
  };
}

/**
 * Get business details from Zoon.ru page
 * @param {string} businessUrl - Full Zoon.ru business page URL
 * @param {{}} opts
 */
async function getBusinessDetails(businessUrl, opts = {}) {
  const url = normalizeBusinessUrl(businessUrl) || businessUrl;
  const html = await fetchHtml(url, opts);
  return parseBusinessPage(html, url);
}

module.exports = {
  ZOON_BASE_URL,
  buildCategoryUrl,
  buildSearchUrl,
  fetchHtml,
  searchByCategory,
  searchRestaurants,
  searchCafes,
  searchBars,
  search,
  getBusinessDetails,
};

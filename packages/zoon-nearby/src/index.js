const { parseSearchResults, parseBusinessPage, normalizeBusinessUrl } = require("./parse");

const ZOON_BASE_URL = "https://zoon.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "accept-language": "ru-RU,ru;q=0.9",
  "user-agent": "ru-skill/zoon-nearby",
};

// Соответствие категорий для распространённых типов поиска
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
    throw new Error(`Запрос к Zoon не удался: ${response.status} для ${url}`);
  }

  return response.text();
}

/**
 * Поиск организаций по категории в городе
 * @param {string} city - Название города (например, 'Москва', 'Санкт-Петербург')
 * @param {string} category - Категория (например, 'restaurants', 'cafes', 'bars')
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
 * Поиск ресторанов в городе
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchRestaurants(city, opts = {}) {
  return searchByCategory(city, 'restaurant', opts);
}

/**
 * Поиск кафе в городе
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchCafes(city, opts = {}) {
  return searchByCategory(city, 'cafe', opts);
}

/**
 * Поиск баров в городе
 * @param {string} city
 * @param {{ page?: number }} opts
 */
async function searchBars(city, opts = {}) {
  return searchByCategory(city, 'bar', opts);
}

/**
 * Общий поиск на Zoon.ru
 * @param {string} query - Поисковый запрос
 * @param {string} [city] - Необязательный город для контекста
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
 * Получить детали организации со страницы Zoon.ru
 * @param {string} businessUrl - Полный URL страницы организации на Zoon.ru
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

const {
  parseAreaResponse,
  parseVacancyResponse,
  parseVacancySearchResponse
} = require("./parse");

const HH_API_BASE_URL = "https://api.hh.ru";
const DEFAULT_HEADERS = {
  accept: "application/json",
  "user-agent": "ru-skill/hh-vacancies"
};

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeSearchText(value) {
  const normalized = String(value).trim();

  if (!normalized) {
    throw new Error("search text must be a non-empty string.");
  }

  return normalized;
}

/**
 * @param {string|number} value
 * @param {string} label
 * @returns {string}
 */
function normalizeNumericId(value, label) {
  const normalized = String(value).trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${label} must contain digits only.`);
  }

  return normalized;
}

/**
 * @param {string|number} areaId
 * @returns {string}
 */
function buildAreaUrl(areaId) {
  return `${HH_API_BASE_URL}/areas/${normalizeNumericId(areaId, "areaId")}`;
}

/**
 * @param {string|number} vacancyId
 * @returns {string}
 */
function buildVacancyUrl(vacancyId) {
  return `${HH_API_BASE_URL}/vacancies/${normalizeNumericId(vacancyId, "vacancyId")}`;
}

/**
 * @param {string} text
 * @param {{ areaId?: string|number, page?: number, perPage?: number } | undefined} options
 * @returns {string}
 */
function buildVacancySearchUrl(text, options = {}) {
  const url = new URL(`${HH_API_BASE_URL}/vacancies`);
  url.searchParams.set("text", normalizeSearchText(text));

  if (options.areaId !== undefined) {
    url.searchParams.set("area", normalizeNumericId(options.areaId, "areaId"));
  }

  if (options.page !== undefined) {
    if (!Number.isInteger(options.page) || options.page < 0) {
      throw new Error("page must be an integer greater than or equal to 0.");
    }

    url.searchParams.set("page", String(options.page));
  }

  if (options.perPage !== undefined) {
    if (!Number.isInteger(options.perPage) || options.perPage < 1 || options.perPage > 100) {
      throw new Error("perPage must be an integer between 1 and 100.");
    }

    url.searchParams.set("per_page", String(options.perPage));
  }

  return url.toString();
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJson(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`HH request failed with ${response.status} for ${url}`);
  }

  return response.json();
}

/**
 * @param {string|number} areaId
 */
async function getAreaOverview(areaId) {
  const normalizedAreaId = normalizeNumericId(areaId, "areaId");
  const payload = await fetchJson(buildAreaUrl(normalizedAreaId));

  return parseAreaResponse(payload);
}

/**
 * @param {string} text
 * @param {{ areaId?: string|number, page?: number, perPage?: number } | undefined} options
 */
async function searchVacancies(text, options = {}) {
  const normalizedText = normalizeSearchText(text);
  const payload = await fetchJson(buildVacancySearchUrl(normalizedText, options));

  return parseVacancySearchResponse(payload);
}

/**
 * @param {string|number} vacancyId
 */
async function getVacancyOverview(vacancyId) {
  const normalizedVacancyId = normalizeNumericId(vacancyId, "vacancyId");
  const payload = await fetchJson(buildVacancyUrl(normalizedVacancyId));

  return parseVacancyResponse(payload);
}

module.exports = {
  buildAreaUrl,
  buildVacancySearchUrl,
  buildVacancyUrl,
  getAreaOverview,
  getVacancyOverview,
  searchVacancies
};

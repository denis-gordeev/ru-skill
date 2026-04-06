const { parseCityPage, parseOfficePage } = require("./parse");

const POSTCALC_BASE_URL = "https://postcalc.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "user-agent": "ru-skill/postcalc-postcodes"
};

/**
 * @param {string} postalCode
 * @returns {string}
 */
function normalizePostalCode(postalCode) {
  const normalized = String(postalCode).trim();

  if (!/^\d{6}$/.test(normalized)) {
    throw new Error("postalCode must be a 6-digit Russian postal code.");
  }

  return normalized;
}

/**
 * @param {string} cityKey
 * @returns {string}
 */
function normalizeCityKey(cityKey) {
  const normalized = String(cityKey).trim();

  if (!normalized) {
    throw new Error("cityKey must be a non-empty string.");
  }

  return normalized;
}

/**
 * @param {string} postalCode
 * @returns {string}
 */
function buildOfficeUrl(postalCode) {
  return `${POSTCALC_BASE_URL}/offices/${normalizePostalCode(postalCode)}`;
}

/**
 * @param {string} cityKey
 * @returns {string}
 */
function buildCityUrl(cityKey) {
  return `${POSTCALC_BASE_URL}/cities/${encodeURIComponent(normalizeCityKey(cityKey))}`;
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Postcalc request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

/**
 * @param {string} postalCode
 */
async function getOfficeOverview(postalCode) {
  const normalizedPostalCode = normalizePostalCode(postalCode);
  const url = buildOfficeUrl(normalizedPostalCode);
  const html = await fetchHtml(url);

  return {
    requestedPostalCode: normalizedPostalCode,
    ...parseOfficePage(html)
  };
}

/**
 * @param {string} cityKey
 */
async function getCityOverview(cityKey) {
  const normalizedCityKey = normalizeCityKey(cityKey);
  const url = buildCityUrl(normalizedCityKey);
  const html = await fetchHtml(url);

  return {
    requestedCityKey: normalizedCityKey,
    ...parseCityPage(html)
  };
}

module.exports = {
  buildCityUrl,
  buildOfficeUrl,
  getCityOverview,
  getOfficeOverview
};

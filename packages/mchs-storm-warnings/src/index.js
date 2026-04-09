const {
  normalizeRegionHost,
  parseStormWarningPage,
  parseStormWarningsIndex
} = require("./parse");

const { listRegions, lookupRegion } = require("./regions");

const WARNINGS_SECTION_PATH = "/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "accept-language": "ru-RU,ru;q=0.9",
  "user-agent": "ru-skill/mchs-storm-warnings"
};

/**
 * @param {string} regionHost
 * @returns {string}
 */
function buildRegionOrigin(regionHost) {
  return `https://${normalizeRegionHost(regionHost)}.mchs.gov.ru`;
}

/**
 * @param {string} regionHost
 * @param {{ page?: number } | undefined} options
 * @returns {string}
 */
function buildWarningsIndexUrl(regionHost, options = {}) {
  const page = options.page ?? 0;

  if (!Number.isInteger(page) || page < 0) {
    throw new Error("page must be an integer greater than or equal to 0.");
  }

  const url = new URL(`${buildRegionOrigin(regionHost)}${WARNINGS_SECTION_PATH}`);

  if (page > 0) {
    url.searchParams.set("page", String(page));
  }

  return url.toString();
}

/**
 * @param {string} regionHost
 * @param {string|number} warningPathOrId
 * @returns {string}
 */
function buildWarningUrl(regionHost, warningPathOrId) {
  const normalized = String(warningPathOrId).trim();

  if (!normalized) {
    throw new Error("warningPathOrId must be a non-empty string or number.");
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (/^\d+$/.test(normalized)) {
    return `${buildWarningsIndexUrl(regionHost)}/${normalized}`;
  }

  if (normalized.startsWith("/")) {
    return new URL(normalized, buildRegionOrigin(regionHost)).toString();
  }

  throw new Error("warningPathOrId must be an absolute MChS URL, a relative path, or a numeric warning id.");
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`MChS request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

/**
 * @param {string} regionHost
 * @param {{ page?: number } | undefined} options
 * @returns {Promise<{ regionHost: string, regionName: string | null, sectionTitle: string | null, sourceUrl: string, items: Array<object> }>}
 */
async function listStormWarnings(regionHost, options = {}) {
  const normalizedRegionHost = normalizeRegionHost(regionHost);
  const url = buildWarningsIndexUrl(normalizedRegionHost, options);
  const html = await fetchHtml(url);

  return parseStormWarningsIndex(html, buildRegionOrigin(normalizedRegionHost), url, normalizedRegionHost);
}

/**
 * @param {string} regionHost
 * @param {string|number} warningPathOrId
 * @returns {Promise<object>}
 */
async function getStormWarning(regionHost, warningPathOrId) {
  const normalizedRegionHost = normalizeRegionHost(regionHost);
  const url = buildWarningUrl(normalizedRegionHost, warningPathOrId);
  const html = await fetchHtml(url);

  return parseStormWarningPage(html, url, normalizedRegionHost);
}

module.exports = {
  WARNINGS_SECTION_PATH,
  buildRegionOrigin,
  buildWarningUrl,
  buildWarningsIndexUrl,
  getStormWarning,
  listStormWarnings,
  listRegions,
  lookupRegion
};

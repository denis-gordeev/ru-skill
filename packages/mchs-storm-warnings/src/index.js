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
    throw new Error("page (номер страницы) должен быть целым числом, большим или равным 0.");
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
    throw new Error("warningPathOrId (путь или идентификатор предупреждения) должен быть непустой строкой или числом.");
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

  throw new Error("warningPathOrId (путь или идентификатор предупреждения) должен быть абсолютным адресом МЧС, относительным путём или числовым идентификатором предупреждения.");
}

const FETCH_TIMEOUT_MS = 15_000;

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { headers: DEFAULT_HEADERS, signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Запрос к МЧС не удался: ${response.status} для ${url}`);
    }

    return response.text();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Запрос к МЧС превысил лимит времени (${FETCH_TIMEOUT_MS / 1000} с): ${url}`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
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

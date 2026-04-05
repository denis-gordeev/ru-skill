const { parseSecurityResponse, parseSecuritiesListResponse } = require("./parse");

const ISS_BASE_URL = "https://iss.moex.com/iss";
const DEFAULT_HEADERS = {
  accept: "application/json, text/plain;q=0.9, */*;q=0.1",
  "user-agent": "ru-skill/moex-shares"
};

/**
 * @param {string} secId
 * @returns {string}
 */
function normalizeSecId(secId) {
  const normalized = String(secId).trim().toUpperCase();

  if (!/^[A-Z0-9._-]{1,24}$/.test(normalized)) {
    throw new Error("secId must contain only MOEX ticker characters.");
  }

  return normalized;
}

/**
 * @param {string} pathname
 * @param {Record<string, string | number | undefined>} [query]
 * @returns {string}
 */
function buildIssUrl(pathname, query = {}) {
  const url = new URL(`${ISS_BASE_URL}${pathname}`);
  url.searchParams.set("iss.meta", "off");

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * @param {string} url
 * @returns {Promise<Record<string, unknown>>}
 */
async function fetchJson(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`MOEX ISS request failed with ${response.status} for ${url}`);
  }

  return response.json();
}

/**
 * @param {string} secId
 * @param {{ board?: string } | undefined} options
 */
function buildSecurityUrl(secId, options = {}) {
  const board = options.board || "TQBR";

  return buildIssUrl(`/engines/stock/markets/shares/boards/${board}/securities/${normalizeSecId(secId)}.json`);
}

/**
 * @param {{ board?: string, start?: number } | undefined} options
 */
function buildSecuritiesListUrl(options = {}) {
  const board = options.board || "TQBR";
  const start = options.start ?? 0;

  return buildIssUrl(`/engines/stock/markets/shares/boards/${board}/securities.json`, {
    "securities.columns": "SECID,SHORTNAME,LOTSIZE,ISIN",
    start
  });
}

/**
 * @param {string} secId
 * @param {{ board?: string } | undefined} options
 */
async function getSecurityOverview(secId, options = {}) {
  const payload = await fetchJson(buildSecurityUrl(secId, options));

  return {
    requestedSecId: normalizeSecId(secId),
    boardId: options.board || "TQBR",
    ...parseSecurityResponse(payload)
  };
}

/**
 * @param {{ board?: string, start?: number } | undefined} options
 */
async function listShares(options = {}) {
  const payload = await fetchJson(buildSecuritiesListUrl(options));

  return {
    boardId: options.board || "TQBR",
    start: options.start ?? 0,
    items: parseSecuritiesListResponse(payload)
  };
}

module.exports = {
  buildSecurityUrl,
  buildSecuritiesListUrl,
  getSecurityOverview,
  listShares
};

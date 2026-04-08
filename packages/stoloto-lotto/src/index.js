const { parseArchivePage } = require("./parse");

const STOLOTO_BASE_URL = "https://www.stoloto.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "user-agent": "ru-skill/stoloto-lotto"
};

/**
 * Supported Stoloto game slugs.
 * @type {string[]}
 */
const SUPPORTED_GAMES = ["4x20", "5x36", "6x45", "7x49", "12x24", "ruslotto", "top3", "5x2"];

/**
 * @param {string} gameSlug
 * @returns {string}
 */
function normalizeGameSlug(gameSlug) {
  const normalized = String(gameSlug).trim().toLowerCase();

  // Map common aliases
  const aliases = {
    "4x20": "4x20",
    "4 из 20": "4x20",
    "5x36": "5x36",
    "5 из 36": "5x36",
    "6x45": "6x45",
    "6 из 45": "6x45",
    "7x49": "7x49",
    "7 из 49": "7x49",
    "12x24": "12x24",
    "12 из 24": "12x24",
    "ruslotto": "ruslotto",
    "русское лото": "ruslotto",
    "top3": "top3",
    "топ-3": "top3",
    "5x2": "5x2",
    "5 из 2": "5x2"
  };

  if (aliases[normalized]) {
    return aliases[normalized];
  }

  if (SUPPORTED_GAMES.includes(normalized)) {
    return normalized;
  }

  throw new Error(
    `Unsupported game slug: ${gameSlug}. Supported: ${SUPPORTED_GAMES.join(", ")}`
  );
}

/**
 * @param {string} gameSlug
 * @returns {string}
 */
function buildArchiveUrl(gameSlug) {
  return `${STOLOTO_BASE_URL}/${normalizeGameSlug(gameSlug)}/archive`;
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Stoloto request failed with ${response.status} for ${url}`);
  }

  return response.text();
}

/**
 * Fetch the latest archive draws for a Stoloto game.
 * @param {string} gameSlug - e.g. "4x20", "6x45", "ruslotto"
 * @returns {Promise<{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }>}
 */
async function getArchiveDraws(gameSlug) {
  const normalizedSlug = normalizeGameSlug(gameSlug);
  const url = buildArchiveUrl(normalizedSlug);
  const html = await fetchHtml(url);

  return parseArchivePage(html, normalizedSlug);
}

/**
 * Fetch archive draws for a specific draw number (if supported by the page).
 * @param {string} gameSlug
 * @param {number} drawNumber
 * @returns {Promise<{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }>}
 */
async function getDrawById(gameSlug, drawNumber) {
  const normalizedSlug = normalizeGameSlug(gameSlug);
  // Some Stoloto pages support filtering by draw ID via query param
  const url = `${STOLOTO_BASE_URL}/${normalizedSlug}/archive?drawId=${drawNumber}`;
  const html = await fetchHtml(url);

  return parseArchivePage(html, normalizedSlug);
}

module.exports = {
  SUPPORTED_GAMES,
  buildArchiveUrl,
  getArchiveDraws,
  getDrawById,
  normalizeGameSlug
};

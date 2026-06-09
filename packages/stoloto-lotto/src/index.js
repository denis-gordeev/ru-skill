const { parseArchivePage } = require("./parse");

const STOLOTO_BASE_URL = "https://www.stoloto.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "user-agent": "ru-skill/stoloto-lotto"
};

/**
 * Поддерживаемые идентификаторы игр Столото.
 * @type {string[]}
 */
const SUPPORTED_GAMES = ["4x20", "5x36", "6x45", "7x49", "12x24", "ruslotto", "top3", "5x2"];

/**
 * @param {string} gameSlug
 * @returns {string}
 */
function normalizeGameSlug(gameSlug) {
  const normalized = String(gameSlug).trim().toLowerCase();

  // Соответствие распространённых псевдонимов
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
    `Неподдерживаемый идентификатор игры: ${gameSlug}. Поддерживаются: ${SUPPORTED_GAMES.join(", ")}`
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
    throw new Error(`Запрос к Столото не удался: ${response.status} для ${url}`);
  }

  return response.text();
}

/**
 * Загрузить последние архивные тиражи для игры Столото.
 * @param {string} gameSlug - например "4x20", "6x45", "ruslotto"
 * @returns {Promise<{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }>}
 */
async function getArchiveDraws(gameSlug) {
  const normalizedSlug = normalizeGameSlug(gameSlug);
  const url = buildArchiveUrl(normalizedSlug);
  const html = await fetchHtml(url);

  return parseArchivePage(html, normalizedSlug);
}

/**
 * Загрузить архивные тиражи по конкретному номеру тиража (если поддерживается страницей).
 * @param {string} gameSlug
 * @param {number} drawNumber
 * @returns {Promise<{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }>}
 */
async function getDrawById(gameSlug, drawNumber) {
  const normalizedSlug = normalizeGameSlug(gameSlug);
  // Некоторые страницы Столото поддерживают фильтрацию по номеру тиража через параметр запроса
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

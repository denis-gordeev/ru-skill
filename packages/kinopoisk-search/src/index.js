const { parseFilmPage, parseSearchResults } = require("./parse");

const KINOPOISK_BASE_URL = "https://www.kinopoisk.ru";
const DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
  "user-agent": "ru-skill/kinopoisk-search",
  "accept-language": "ru-RU,ru;q=0.9"
};

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Запрос к Кинопоиску не удался: ${response.status} для ${url}`);
  }

  return response.text();
}

/**
 * Построить URL страницы фильма по идентификатору Кинопоиска.
 * @param {string} filmId
 * @returns {string}
 */
function buildFilmUrl(filmId) {
  return `${KINOPOISK_BASE_URL}/film/${filmId}/`;
}

/**
 * Построить URL страницы поиска Кинопоиска.
 * @param {string} query
 * @returns {string}
 */
function buildSearchUrl(query) {
  const encoded = encodeURIComponent(query);
  return `${KINOPOISK_BASE_URL}/index/standalone_search/?query=${encoded}`;
}

/**
 * Получить информацию о фильме по идентификатору Кинопоиска.
 * @param {string} filmId - например "326" для «Брат 2»
 * @returns {Promise<{ filmId: string, title: string, year: string | null, rating: string | null, description: string | null, genres: string[], director: string | null, actors: string[] }>}
 */
async function getFilmById(filmId) {
  const url = buildFilmUrl(filmId);
  const html = await fetchHtml(url);

  return parseFilmPage(html, String(filmId));
}

/**
 * Поиск фильмов по строке запроса.
 * @param {string} query - например "Брат 2"
 * @returns {Promise<{ query: string, results: Array<{ filmId: string, title: string, year: string | null, rating: string | null, url: string }> }>}
 */
async function searchFilms(query) {
  const url = buildSearchUrl(query);
  const html = await fetchHtml(url);

  return parseSearchResults(html, query);
}

module.exports = {
  buildFilmUrl,
  buildSearchUrl,
  getFilmById,
  searchFilms
};

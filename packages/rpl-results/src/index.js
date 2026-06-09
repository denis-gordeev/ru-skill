/**
 * rpl-results
 * Турнирная таблица и результаты матчей Российской Премьер-Лиги через championat.com
 */

const { parseStandings, parseMatchResults } = require("./parse");

const BASE_URL = "https://www.championat.com/football/_russiapl/tournament/5980/";

/**
 * Построить URL страницы турнирной таблицы РПЛ
 * @returns {string}
 */
function buildStandingsUrl() {
  return `${BASE_URL}table/`;
}

/**
 * Построить URL страницы результатов матчей РПЛ
 * @returns {string}
 */
function buildResultsUrl() {
  return `${BASE_URL}results/`;
}

/**
 * Загрузить и разобрать турнирную таблицу РПЛ
 * @param {object} [opts] - Необязательные переопределения fetch
 * @param {typeof fetch} [opts.fetcher] - Пользовательская реализация fetch
 * @returns {Promise<{season: string, standings: Array}>}
 */
async function getStandings(opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const url = buildStandingsUrl();

  const res = await fetcher(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (ru-skill rpl-results; навык только для чтения данных Российской Премьер-Лиги)",
    },
  });

  if (!res.ok) {
    throw new Error(
      `championat.com вернул ${res.status} для страницы турнирной таблицы`
    );
  }

  const html = await res.text();
  const standings = parseStandings(html);

  return {
    season: "2024/25",
    source: "championat.com",
    standings,
  };
}

/**
 * Загрузить и разобрать результаты матчей РПЛ
 * @param {object} [opts] - Необязательные переопределения fetch
 * @param {typeof fetch} [opts.fetcher] - Пользовательская реализация fetch
 * @returns {Promise<{season: string, matches: Array}>}
 */
async function getResults(opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const url = buildResultsUrl();

  const res = await fetcher(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (ru-skill rpl-results; навык только для чтения данных Российской Премьер-Лиги)",
    },
  });

  if (!res.ok) {
    throw new Error(
      `championat.com вернул ${res.status} для страницы результатов`
    );
  }

  const html = await res.text();
  const matches = parseMatchResults(html);

  return {
    season: "2024/25",
    source: "championat.com",
    matches,
  };
}

module.exports = {
  buildStandingsUrl,
  buildResultsUrl,
  getStandings,
  getResults,
};

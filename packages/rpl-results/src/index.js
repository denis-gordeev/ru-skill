/**
 * rpl-results
 * Russian Premier League standings and match results via championat.com
 */

const { parseStandings, parseMatchResults } = require("./parse");

const BASE_URL = "https://www.championat.com/football/_russiapl/tournament/5980/";

/**
 * Build URL for the RPL standings page
 * @returns {string}
 */
function buildStandingsUrl() {
  return `${BASE_URL}table/`;
}

/**
 * Build URL for the RPL match results page
 * @returns {string}
 */
function buildResultsUrl() {
  return `${BASE_URL}results/`;
}

/**
 * Fetch and parse RPL standings
 * @param {object} [opts] - Optional fetch overrides
 * @param {typeof fetch} [opts.fetcher] - Custom fetch implementation
 * @returns {Promise<{season: string, standings: Array}>}
 */
async function getStandings(opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const url = buildStandingsUrl();

  const res = await fetcher(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (ru-skill rpl-results; read-only skill for Russian Premier League data)",
    },
  });

  if (!res.ok) {
    throw new Error(
      `championat.com returned ${res.status} for standings page`
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
 * Fetch and parse RPL match results
 * @param {object} [opts] - Optional fetch overrides
 * @param {typeof fetch} [opts.fetcher] - Custom fetch implementation
 * @returns {Promise<{season: string, matches: Array}>}
 */
async function getResults(opts = {}) {
  const fetcher = opts.fetcher || globalThis.fetch;
  const url = buildResultsUrl();

  const res = await fetcher(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (ru-skill rpl-results; read-only skill for Russian Premier League data)",
    },
  });

  if (!res.ok) {
    throw new Error(
      `championat.com returned ${res.status} for results page`
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

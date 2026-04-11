/**
 * HTML parsing utilities for RPL data from championat.com
 * Uses regex-based extraction (no DOM parser dependency)
 */

/**
 * Decode HTML entities in strings
 */
function decodeHtmlEntities(str) {
  if (!str) return str;
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Strip HTML tags and normalize whitespace
 */
function stripTags(html) {
  return decodeHtmlEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract a single regex match or return null
 */
function matchOne(regex, str) {
  const m = str.match(regex);
  return m ? m[1] : null;
}

/**
 * Convert string to number or return null
 */
function toNumberOrNull(str) {
  if (!str) return null;
  const n = Number(str);
  return Number.isNaN(n) ? null : n;
}

/**
 * Parse the standings table HTML into structured data
 * @param {string} html - Full page or table HTML
 * @returns {Array<{rank: number, team: string, played: number, wins: number, draws: number, losses: number, goalsFor: number, goalsAgainst: number, goalDifference: number, points: number}>}
 */
function parseStandings(html) {
  const rows = [];
  // Match each table row in the standings
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];

    // Extract rank from first cell
    const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 8) continue;

    const rankText = stripTags(cells[0]);
    const rank = toNumberOrNull(rankText);
    if (!rank) continue; // Skip header rows

    // Extract team name from second cell
    const teamHtml = cells[1];
    let team = matchOne(/>([^<]+)<\/a>/, teamHtml);
    if (!team) {
      team = stripTags(teamHtml);
    }
    if (!team) continue;

    // Extract numeric columns
    const played = toNumberOrNull(stripTags(cells[2]));
    const wins = toNumberOrNull(stripTags(cells[3]));
    const draws = toNumberOrNull(stripTags(cells[4]));
    const losses = toNumberOrNull(stripTags(cells[5]));

    // Parse goals (format: "59-23")
    const goalsText = stripTags(cells[6]);
    const goalsMatch = goalsText.match(/^(\d+)-(\d+)$/);
    const goalsFor = goalsMatch ? toNumberOrNull(goalsMatch[1]) : null;
    const goalsAgainst = goalsMatch ? toNumberOrNull(goalsMatch[2]) : null;
    const goalDifference =
      goalsFor !== null && goalsAgainst !== null
        ? goalsFor - goalsAgainst
        : null;

    const points = toNumberOrNull(stripTags(cells[7]));

    rows.push({
      rank,
      team,
      played,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
      points,
    });
  }

  return rows;
}

/**
 * Parse match results from a page section
 * @param {string} html - HTML containing match results
 * @returns {Array<{date: string, homeTeam: string, awayTeam: string, homeScore: number|null, awayScore: number|null}>}
 */
function parseMatchResults(html) {
  const matches = [];

  // Look for match-item blocks specifically
  const matchBlockRegex = /<div[^>]*class="match-item"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let blockMatch;

  while ((blockMatch = matchBlockRegex.exec(html)) !== null) {
    const block = blockMatch[1];

    // Extract date
    const date =
      matchOne(/data-date=["']([^"']+)["']/, blockMatch[0]) ||
      matchOne(/class="match-date"[^>]*>([^<]+)<\/span>/, block) ||
      matchOne(/(\d{2}\.\d{2}\.\d{4})/, block);

    // Extract team names from anchor tags
    const teamLinks = block.match(/<a[^>]*>([^<]+)<\/a>/g);
    if (!teamLinks || teamLinks.length < 2) continue;

    const homeTeam = matchOne(/>([^<]+)<\/a>/, teamLinks[0]);
    const awayTeam = matchOne(/>([^<]+)<\/a>/, teamLinks[1]);

    if (!homeTeam || !awayTeam) continue;

    // Extract score (formats: "2:1", "2-1", "2 — 1")
    const scoreText = matchOne(/class="score"[^>]*>([^<]+)<\/span>/, block);
    let homeScore = null;
    let awayScore = null;

    if (scoreText) {
      const scoreMatch = scoreText.match(/(\d+)\s*[:\-–—]\s*(\d+)/);
      if (scoreMatch) {
        homeScore = toNumberOrNull(scoreMatch[1]);
        awayScore = toNumberOrNull(scoreMatch[2]);
      }
    }

    matches.push({
      date,
      homeTeam: stripTags(homeTeam),
      awayTeam: stripTags(awayTeam),
      homeScore,
      awayScore,
    });
  }

  return matches;
}

module.exports = {
  decodeHtmlEntities,
  stripTags,
  matchOne,
  toNumberOrNull,
  parseStandings,
  parseMatchResults,
};

/**
 * Утилиты разбора HTML для данных РПЛ с championat.com
 * Использует извлечение на основе регулярных выражений (без зависимости от программы разбора DOM)
 */

/**
 * Декодирование сущностей HTML в строках
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
 * Удаление тегов HTML и нормализация пробелов
 */
function stripTags(html) {
  return decodeHtmlEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Извлечь одно совпадение регулярного выражения или вернуть null
 */
function matchOne(regex, str) {
  const m = str.match(regex);
  return m ? m[1] : null;
}

/**
 * Преобразовать строку в число или вернуть null
 */
function toNumberOrNull(str) {
  if (!str) return null;
  const n = Number(str);
  return Number.isNaN(n) ? null : n;
}

/**
 * Разобрать HTML таблицы турнирной таблицы в структурированные данные
 * @param {string} html - Полная страница или HTML таблицы
 * @returns {Array<{rank: number, team: string, played: number, wins: number, draws: number, losses: number, goalsFor: number, goalsAgainst: number, goalDifference: number, points: number}>}
 */
function parseStandings(html) {
  const rows = [];
  // Совпадение с каждой строкой таблицы в турнирной таблице
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];

    // Извлечь ранг из первой ячейки
    const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 8) continue;

    const rankText = stripTags(cells[0]);
    const rank = toNumberOrNull(rankText);
    if (!rank) continue; // Пропустить строки заголовков

    // Извлечь название команды из второй ячейки
    const teamHtml = cells[1];
    let team = matchOne(/>([^<]+)<\/a>/, teamHtml);
    if (!team) {
      team = stripTags(teamHtml);
    }
    if (!team) continue;

    // Извлечь числовые столбцы
    const played = toNumberOrNull(stripTags(cells[2]));
    const wins = toNumberOrNull(stripTags(cells[3]));
    const draws = toNumberOrNull(stripTags(cells[4]));
    const losses = toNumberOrNull(stripTags(cells[5]));

    // Разобрать голы (формат: "59-23")
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
 * Разобрать результаты матчей из секции страницы
 * @param {string} html - HTML с результатами матчей
 * @returns {Array<{date: string, homeTeam: string, awayTeam: string, homeScore: number|null, awayScore: number|null}>}
 */
function parseMatchResults(html) {
  const matches = [];

  // Искать блоки match-item
  const matchBlockRegex = /<div[^>]*class="match-item"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let blockMatch;

  while ((blockMatch = matchBlockRegex.exec(html)) !== null) {
    const block = blockMatch[1];

    // Извлечь дату
    const date =
      matchOne(/data-date=["']([^"']+)["']/, blockMatch[0]) ||
      matchOne(/class="match-date"[^>]*>([^<]+)<\/span>/, block) ||
      matchOne(/(\d{2}\.\d{2}\.\d{4})/, block);

    // Извлечь названия команд из ссылок
    const teamLinks = block.match(/<a[^>]*>([^<]+)<\/a>/g);
    if (!teamLinks || teamLinks.length < 2) continue;

    const homeTeam = matchOne(/>([^<]+)<\/a>/, teamLinks[0]);
    const awayTeam = matchOne(/>([^<]+)<\/a>/, teamLinks[1]);

    if (!homeTeam || !awayTeam) continue;

    // Извлечь счёт (форматы: "2:1", "2-1", "2 — 1")
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

const ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL_PATTERN = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;

/**
 * @param {string} value
 * @returns {string}
 */
function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

/**
 * @param {string} value
 * @returns {string}
 */
function stripTags(value) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * @param {string} value
 * @returns {number | null}
 */
function toNumberOrNull(value) {
  if (!value) {
    return null;
  }

  const cleaned = String(value).replace(/\s/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @param {string} html
 * @param {RegExp} pattern
 * @returns {string | null}
 */
function matchOne(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

/**
 * @param {string} html
 * @returns {string}
 */
function requireGameName(html) {
  const heading = matchOne(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
    || matchOne(html, /<title>([\s\S]*?)<\/title>/i);

  if (!heading) {
    throw new Error("Unable to locate Stoloto archive heading.");
  }

  return heading;
}

/**
 * Extract draw numbers from a table row.
 * Numbers are typically in <span> or <div> elements with ball-like styling.
 * @param {string} rowHtml
 * @returns {number[]}
 */
function extractWinningNumbers(rowHtml) {
  // Pattern: look for number-like values in cells, typically <td> elements
  // containing <span> or <div> with single/double digit numbers
  const numberPattern = />(\d{1,2})</g;
  const numbers = [];
  let m;

  while ((m = numberPattern.exec(rowHtml)) !== null) {
    const num = Number(m[1]);
    // Lottery numbers are typically 1-99
    if (num >= 1 && num <= 99) {
      numbers.push(num);
    }
  }

  return [...new Set(numbers)]; // deduplicate while preserving order
}

/**
 * Parse a single draw row from the Stoloto archive table.
 * @param {string} rowHtml
 * @returns {{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null } | null}
 */
function parseDrawRow(rowHtml) {
  const cells = [...rowHtml.matchAll(CELL_PATTERN)].map((match) => match[1]);

  if (cells.length < 2) {
    return null;
  }

  // Stoloto archive rows typically have: draw number, date, winning numbers, prize
  const fullRowHtml = cells.join("");

  // Try to extract draw number
  const drawNumberMatch = matchOne(cells[0], /(\d+)/) || matchOne(fullRowHtml, /тираж\s*(\d+)/i);
  const drawNumber = toNumberOrNull(drawNumberMatch);

  // Try to extract date - typically in format DD.MM.YYYY or similar
  const dateMatch = matchOne(fullRowHtml, /(\d{2}\.\d{2}\.\d{4})/)
    || matchOne(fullRowHtml, /(\d{2}\.\d{2}\.\d{2})/);
  const date = dateMatch || null;

  // Extract winning numbers from the numbers cell (usually the largest cell with many numbers)
  const numbersCell = cells.reduce((largest, cell) =>
    cell.length > largest.length ? cell : largest, ""
  );
  const numbers = extractWinningNumbers(numbersCell);

  // Try to extract prize/superprize amount
  const prizeMatch = matchOne(fullRowHtml, /([\d\s]+)\s*руб/i)
    || matchOne(fullRowHtml, /суперприз[\s\S]*?([\d\s]+)/i);
  const prize = prizeMatch ? stripTags(prizeMatch) : null;

  return {
    drawNumber,
    date,
    numbers,
    prize
  };
}

/**
 * Parse the Stoloto archive page for a specific game.
 * @param {string} html
 * @param {string} gameSlug - e.g. "4x20", "5x36", "6x45", "7x49"
 * @returns {{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }}
 */
function parseArchivePage(html, gameSlug) {
  const gameName = requireGameName(html);

  // Find the archive table - typically contains draw rows
  const tablePattern = /<table\b[^>]*class="[^"]*archive[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = [...html.matchAll(tablePattern)];

  if (tables.length === 0) {
    // Fallback: try to find any table with draw-like content
    const allTables = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)];

    if (allTables.length === 0) {
      throw new Error(`Unable to locate Stoloto archive table for ${gameSlug}.`);
    }

    // Use the first table that contains draw rows
    for (const tableMatch of allTables) {
      const rows = [...tableMatch[1].matchAll(ROW_PATTERN)];

      if (rows.length > 1) {
        const draws = rows
          .slice(1) // skip header row
          .map((rowMatch) => parseDrawRow(rowMatch[0]))
          .filter(Boolean);

        if (draws.length > 0) {
          return {
            gameName,
            gameSlug,
            draws
          };
        }
      }
    }

    throw new Error(`Unable to parse Stoloto archive draws for ${gameSlug}.`);
  }

  // Parse the first matching archive table
  const rows = [...tables[0][1].matchAll(ROW_PATTERN)];
  const draws = rows
    .slice(1) // skip header row
    .map((rowMatch) => parseDrawRow(rowMatch[0]))
    .filter(Boolean);

  return {
    gameName,
    gameSlug,
    draws
  };
}

module.exports = {
  decodeHtmlEntities,
  extractWinningNumbers,
  parseArchivePage,
  parseDrawRow,
  stripTags
};

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
    throw new Error("Не удалось найти заголовок архива Столото.");
  }

  return heading;
}

/**
 * Извлечь выигрышные номера из строки таблицы.
 * Номера обычно в элементах <span> или <div> со стилизацией в виде шариков.
 * @param {string} rowHtml
 * @returns {number[]}
 */
function extractWinningNumbers(rowHtml) {
  // Паттерн: искать числоподобные значения в ячейках, обычно в элементах <td>,
  // содержащих <span> или <div> с одно- или двузначными числами
  const numberPattern = />(\d{1,2})</g;
  const numbers = [];
  let m;

  while ((m = numberPattern.exec(rowHtml)) !== null) {
    const num = Number(m[1]);
    // Лотерейные номера обычно от 1 до 99
    if (num >= 1 && num <= 99) {
      numbers.push(num);
    }
  }

  return [...new Set(numbers)]; // удалить дубликаты с сохранением порядка
}

/**
 * Разобрать одну строку тиража из таблицы архива Столото.
 * @param {string} rowHtml
 * @returns {{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null } | null}
 */
function parseDrawRow(rowHtml) {
  const cells = [...rowHtml.matchAll(CELL_PATTERN)].map((match) => match[1]);

  if (cells.length < 2) {
    return null;
  }

  // Строки архива Столото обычно содержат: номер тиража, дату, выигрышные номера, приз
  const fullRowHtml = cells.join("");

  // Попробовать извлечь номер тиража
  const drawNumberMatch = matchOne(cells[0], /(\d+)/) || matchOne(fullRowHtml, /тираж\s*(\d+)/i);
  const drawNumber = toNumberOrNull(drawNumberMatch);

  // Попробовать извлечь дату — обычно в формате DD.MM.YYYY или подобном
  const dateMatch = matchOne(fullRowHtml, /(\d{2}\.\d{2}\.\d{4})/)
    || matchOne(fullRowHtml, /(\d{2}\.\d{2}\.\d{2})/);
  const date = dateMatch || null;

  // Извлечь выигрышные номера из ячейки с номерами (обычно самая большая ячейка с множеством чисел)
  const numbersCell = cells.reduce((largest, cell) =>
    cell.length > largest.length ? cell : largest, ""
  );
  const numbers = extractWinningNumbers(numbersCell);

  // Попробовать извлечь сумму приза/суперприза
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
 * Разобрать страницу архива Столото для конкретной игры.
 * @param {string} html
 * @param {string} gameSlug - например "4x20", "5x36", "6x45", "7x49"
 * @returns {{ gameName: string, gameSlug: string, draws: Array<{ drawNumber: number | null, date: string | null, numbers: number[], prize: string | null }> }}
 */
function parseArchivePage(html, gameSlug) {
  const gameName = requireGameName(html);

  // Найти таблицу архива — обычно содержит строки тиражей
  const tablePattern = /<table\b[^>]*class="[^"]*archive[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
  const tables = [...html.matchAll(tablePattern)];

  if (tables.length === 0) {
    // Запасной вариант: попытка найти любую таблицу с тиражными данными
    const allTables = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)];

    if (allTables.length === 0) {
      throw new Error(`Не удалось найти таблицу архива Столото для ${gameSlug}.`);
    }

    // Использовать первую таблицу, содержащую строки тиражей
    for (const tableMatch of allTables) {
      const rows = [...tableMatch[1].matchAll(ROW_PATTERN)];

      if (rows.length > 1) {
        const draws = rows
          .slice(1) // пропустить строку заголовков
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

    throw new Error(`Не удалось разобрать тиражи архива Столото для ${gameSlug}.`);
  }

  // Разобрать первую подходящую таблицу архива
  const rows = [...tables[0][1].matchAll(ROW_PATTERN)];
  const draws = rows
    .slice(1) // пропустить строку заголовков
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

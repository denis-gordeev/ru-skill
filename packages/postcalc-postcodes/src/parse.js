const TABLE_PATTERN = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
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

  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @param {string} html
 * @returns {string[]}
 */
function extractTables(html) {
  return [...html.matchAll(TABLE_PATTERN)].map((match) => match[0]);
}

/**
 * @param {string} tableHtml
 * @returns {Array<{ label: string, value: string, valueHtml: string }>}
 */
function extractRows(tableHtml) {
  const rows = [];

  for (const match of tableHtml.matchAll(ROW_PATTERN)) {
    const cells = [...match[1].matchAll(CELL_PATTERN)].map((cellMatch) => cellMatch[1]);

    if (cells.length < 2) {
      continue;
    }

    rows.push({
      label: stripTags(cells[0]),
      value: stripTags(cells[1]),
      valueHtml: cells[1]
    });
  }

  return rows;
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
function requireOfficeHeading(html) {
  const heading = matchOne(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);

  if (!heading) {
    throw new Error("Unable to locate Postcalc office heading.");
  }

  return heading;
}

/**
 * @param {string} html
 * @returns {Record<string, { value: string, valueHtml: string }>}
 */
function extractInfoMap(html) {
  const table = extractTables(html)[0];

  if (!table) {
    throw new Error("Unable to locate Postcalc info table.");
  }

  return Object.fromEntries(extractRows(table).map((row) => [row.label, { value: row.value, valueHtml: row.valueHtml }]));
}

/**
 * @param {string} html
 */
function parseOfficePage(html) {
  const heading = requireOfficeHeading(html);
  const postalCode = matchOne(heading, /(\d{6})/) || matchOne(html, /\/offices\/(\d{6})/);

  if (!postalCode) {
    throw new Error("Unable to extract office postal code from Postcalc page.");
  }

  const officeName = matchOne(heading, /"([^"]+)"/) || heading.replace(/^Отделение Почты России\s+\d{6}\s*/i, "").trim();
  const info = extractInfoMap(html);

  return {
    postalCode,
    officeName,
    phone: matchOne(html, /itemprop="telephone"[^>]*>([\s\S]*?)<\/a>/i),
    regId: toNumberOrNull(info["Номер региона regid"]?.value),
    cityKey: info["Ключ citykey"]?.value || null,
    cityKeyUnique: info["Уникальный ключ citykey_u"]?.value || null,
    cityKeyFull: info["Полный ключ citykey_f"]?.value || null,
    latitude: toNumberOrNull(info["Широта"]?.value),
    longitude: toNumberOrNull(info["Долгота"]?.value),
    region: info["Регион"]?.value || null,
    district: info["Район"]?.value || null,
    address: info["Адрес"]?.value || null,
    officeType: info["Тип ОПС"]?.value || null,
    workSchedule: info["Время работы"]?.value || null,
    canonicalUrl: matchOne(html, /<link rel="canonical" href="([^"]+)"/i)
  };
}

/**
 * @param {string} rowHtml
 */
function parseOfficeRow(rowHtml) {
  const cells = [...rowHtml.matchAll(CELL_PATTERN)].map((match) => match[1]);

  if (cells.length < 4) {
    return null;
  }

  const titleCell = cells[1];
  const addressCell = cells[2];
  const noteCell = cells[3];
  const postalCode = matchOne(titleCell, /\/offices\/(\d{6})/);

  if (!postalCode) {
    return null;
  }

  const mapMatch = titleCell.match(/showOPSonMap\(([-\d.]+),\s*([-\d.]+),\s*(\d{6})\)/);
  const officeName = stripTags(titleCell.split(/<br\s*\/?>/i).slice(1).join("\n")) || null;
  const address = stripTags(addressCell.replace(/<br\s*\/?>\s*<a[\s\S]*/i, ""));

  return {
    postalCode,
    officeName,
    latitude: mapMatch ? Number(mapMatch[1]) : null,
    longitude: mapMatch ? Number(mapMatch[2]) : null,
    address: address || null,
    note: stripTags(noteCell) || null,
    postcalcUrl: `https://postcalc.ru/offices/${postalCode}`,
    russianPostUrl: matchOne(addressCell, /<a href='(https:\/\/www\.pochta\.ru\/offices\/\d+)'/i)
  };
}

/**
 * @param {string} html
 */
function parseCityPage(html) {
  const title = matchOne(html, /<title>([\s\S]*?)<\/title>/i);
  const cityName = title
    ? title.replace(/^Отделения Почты России:\s*/i, "").replace(/\s*\|[\s\S]*$/, "").trim()
    : null;
  const tables = extractTables(html);
  const infoTable = tables.find((table) => table.includes("Параметры API"));

  if (!infoTable) {
    throw new Error("Unable to locate Postcalc city API table.");
  }

  const infoRows = Object.fromEntries(extractRows(infoTable).map((row) => [row.label, { value: row.value, valueHtml: row.valueHtml }]));
  const officesTable = html.match(/<div id="OPSTable"[\s\S]*?<table\b[^>]*>([\s\S]*?)<\/table>/i);

  if (!officesTable) {
    throw new Error("Unable to locate Postcalc city offices table.");
  }

  const officeRows = [...officesTable[1].matchAll(ROW_PATTERN)]
    .slice(1)
    .map((match) => parseOfficeRow(match[0]))
    .filter(Boolean);

  const regionAliases = (infoRows["Альтернативные названия региона"]?.value || "")
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const populationMatch = (infoRows["Население"]?.value || "").match(/^(\d+)(?:\s+\(([^)]+)\))?$/);

  return {
    cityName,
    regId: toNumberOrNull(infoRows["Номер региона regid"]?.value),
    regionAliases,
    cityKey: infoRows["Ключ citykey"]?.value || null,
    cityKeyUnique: infoRows["Уникальный ключ citykey_u"]?.value || null,
    cityKeyFull: infoRows["Полный ключ citykey_f"]?.value || null,
    cityKeyEn: infoRows["Ключ citykey (англ.)"]?.value || null,
    cityKeyUniqueEn: infoRows["Уникальный ключ citykey_u_en (англ.)"]?.value || null,
    cityKeyFullEn: infoRows["Полный ключ citykey_f_en (англ.)"]?.value || null,
    latitude: toNumberOrNull(infoRows["Широта"]?.value),
    longitude: toNumberOrNull(infoRows["Долгота"]?.value),
    osmId: infoRows.osm_id?.value || null,
    fullName: infoRows["Полное название:"]?.value || null,
    defaultPostalCode: matchOne(infoRows["Индекс по умолчанию"]?.valueHtml || "", /\/offices\/(\d{6})/) || null,
    population: populationMatch ? Number(populationMatch[1]) : null,
    populationDate: populationMatch?.[2] || null,
    canonicalUrl: matchOne(html, /<link rel="canonical" href="([^"]+)"/i),
    offices: officeRows
  };
}

module.exports = {
  decodeHtmlEntities,
  parseCityPage,
  parseOfficePage,
  stripTags
};

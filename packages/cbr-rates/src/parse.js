const VALCURS_PATTERN = /<ValCurs\b([^>]*)>([\s\S]*?)<\/ValCurs>/i;
const VALUTE_PATTERN = /<Valute\b([^>]*)>([\s\S]*?)<\/Valute>/gi;
const ATTRIBUTE_PATTERN = /([A-Za-z_:][\w:.-]*)="([^"]*)"/g;

/**
 * @param {string} value
 * @returns {string}
 */
function decodeXmlEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * @param {string} value
 * @returns {Record<string, string>}
 */
function parseAttributes(value) {
  return Object.fromEntries([...value.matchAll(ATTRIBUTE_PATTERN)].map((match) => [match[1], decodeXmlEntities(match[2])]));
}

/**
 * @param {string} xml
 * @param {string} tagName
 * @returns {string}
 */
function extractTagText(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i"));

  if (!match) {
    throw new Error(`Отсутствует <${tagName}> в XML-ответе ЦБ РФ.`);
  }

  return decodeXmlEntities(match[1].trim());
}

/**
 * @param {string} raw
 * @returns {number}
 */
function parseDecimal(raw) {
  const normalized = raw.replace(/\s+/g, "").replace(",", ".");
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    throw new Error(`Не удалось разобрать десятичное значение из «${raw}».`);
  }

  return value;
}

/**
 * @param {string} raw
 * @returns {string}
 */
function normalizeCbrDate(raw) {
  const match = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  if (!match) {
    throw new Error(`Неожиданный формат даты ЦБ РФ: ${raw}`);
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

/**
 * @param {string} xml
 */
function parseDailyRatesXml(xml) {
  const rootMatch = xml.match(VALCURS_PATTERN);

  if (!rootMatch) {
    throw new Error("Не удалось найти корневой элемент <ValCurs> в XML-ответе ЦБ РФ.");
  }

  const rootAttributes = parseAttributes(rootMatch[1]);
  const currencies = [];

  for (const match of rootMatch[2].matchAll(VALUTE_PATTERN)) {
    const attributes = parseAttributes(match[1]);
    const block = match[2];

    const nominal = Number.parseInt(extractTagText(block, "Nominal"), 10);
    const value = parseDecimal(extractTagText(block, "Value"));
    const rate = parseDecimal(extractTagText(block, "VunitRate"));

    currencies.push({
      id: attributes.ID ?? null,
      numCode: extractTagText(block, "NumCode"),
      charCode: extractTagText(block, "CharCode").toUpperCase(),
      nominal,
      name: extractTagText(block, "Name"),
      value,
      unitRate: rate
    });
  }

  if (currencies.length === 0) {
    throw new Error("XML-ответ ЦБ РФ не содержит элементов <Valute>.");
  }

  return {
    date: normalizeCbrDate(rootAttributes.Date ?? ""),
    name: rootAttributes.name ?? null,
    currencies
  };
}

/**
 * @param {ReturnType<typeof parseDailyRatesXml>} payload
 * @param {string} charCode
 */
function findCurrencyByCode(payload, charCode) {
  const normalizedCode = String(charCode).trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(normalizedCode)) {
    throw new Error("charCode должен быть трёхбуквенным кодом валюты ISO.");
  }

  const currency = payload.currencies.find((entry) => entry.charCode === normalizedCode);

  if (!currency) {
    throw new Error(`Валюта ${normalizedCode} отсутствует в ежедневных котировках ЦБ РФ.`);
  }

  return currency;
}

module.exports = {
  findCurrencyByCode,
  normalizeCbrDate,
  parseDailyRatesXml
};

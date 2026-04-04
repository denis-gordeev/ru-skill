const { TextDecoder } = require("node:util");

const { findCurrencyByCode, parseDailyRatesXml } = require("./parse");

const DAILY_RATES_URL = "https://www.cbr.ru/scripts/XML_daily.asp";
const DEFAULT_HEADERS = {
  accept: "application/xml, text/xml;q=0.9, */*;q=0.1",
  "user-agent": "ru-skill/cbr-rates"
};
const WINDOWS_1251_DECODER = new TextDecoder("windows-1251");

/**
 * @param {Date|string|undefined} value
 * @returns {Date}
 */
function normalizeDateInput(value) {
  if (value === undefined) {
    const current = new Date();
    return new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()));
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }

  throw new Error("date must be undefined, a Date, or a YYYY-MM-DD string.");
}

/**
 * @param {Date} value
 * @returns {string}
 */
function formatCbrRequestDate(value) {
  const day = String(value.getUTCDate()).padStart(2, "0");
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const year = value.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * @param {Date} value
 * @returns {string}
 */
function formatIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

/**
 * @param {Date} value
 * @param {number} days
 * @returns {Date}
 */
function shiftDays(value, days) {
  const shifted = new Date(value);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchXml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`CBR request failed with ${response.status} for ${url}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  return WINDOWS_1251_DECODER.decode(bytes);
}

/**
 * @param {Date|string|undefined} date
 * @returns {Promise<ReturnType<typeof parseDailyRatesXml>>}
 */
async function getDailyRates(date) {
  const normalizedDate = normalizeDateInput(date);
  const url = new URL(DAILY_RATES_URL);
  url.searchParams.set("date_req", formatCbrRequestDate(normalizedDate));

  const xml = await fetchXml(url.toString());
  return parseDailyRatesXml(xml);
}

/**
 * @param {string} charCode
 * @param {Date|string|undefined} date
 */
async function getRate(charCode, date) {
  const payload = await getDailyRates(date);
  const currency = findCurrencyByCode(payload, charCode);

  return {
    requestedDate: formatIsoDate(normalizeDateInput(date)),
    publishedDate: payload.date,
    marketName: payload.name,
    ...currency
  };
}

/**
 * @param {string} charCode
 * @param {Date|string|undefined} date
 * @param {{ maxLookbackDays?: number } | undefined} options
 */
async function getRateWithChange(charCode, date, options = {}) {
  const current = await getRate(charCode, date);
  const maxLookbackDays = options.maxLookbackDays ?? 7;
  const currentPublishedDate = normalizeDateInput(current.publishedDate);

  let previous = null;
  let cursor = shiftDays(currentPublishedDate, -1);

  for (let step = 0; step < maxLookbackDays; step += 1) {
    const candidate = await getRate(charCode, cursor);

    if (candidate.publishedDate !== current.publishedDate) {
      previous = candidate;
      break;
    }

    cursor = shiftDays(cursor, -1);
  }

  return {
    ...current,
    previousPublishedDate: previous?.publishedDate ?? null,
    previousUnitRate: previous?.unitRate ?? null,
    change: previous
      ? {
          absolute: Number((current.unitRate - previous.unitRate).toFixed(4)),
          percent: Number((((current.unitRate - previous.unitRate) / previous.unitRate) * 100).toFixed(4)),
          direction: current.unitRate === previous.unitRate
            ? "flat"
            : current.unitRate > previous.unitRate
              ? "up"
              : "down"
        }
      : null
  };
}

module.exports = {
  getDailyRates,
  getRate,
  getRateWithChange
};

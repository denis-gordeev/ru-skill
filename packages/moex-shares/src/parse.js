/**
 * @param {{ columns?: string[], data?: unknown[][] } | undefined} block
 * @returns {Record<string, unknown>[]}
 */
function rowsFromBlock(block) {
  if (!block || !Array.isArray(block.columns) || !Array.isArray(block.data)) {
    throw new Error("Expected an ISS block with columns and data arrays.");
  }

  return block.data.map((row) => Object.fromEntries(block.columns.map((column, index) => [column, row[index]])));
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function toStringOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

/**
 * @param {Record<string, unknown>} row
 */
function normalizeSecurityRow(row) {
  return {
    secId: toStringOrNull(row.SECID),
    boardId: toStringOrNull(row.BOARDID),
    shortName: toStringOrNull(row.SHORTNAME),
    name: toStringOrNull(row.SECNAME),
    isin: toStringOrNull(row.ISIN),
    currencyId: toStringOrNull(row.CURRENCYID),
    faceUnit: toStringOrNull(row.FACEUNIT),
    previousDate: toStringOrNull(row.PREVDATE),
    settleDate: toStringOrNull(row.SETTLEDATE),
    marketCode: toStringOrNull(row.MARKETCODE),
    instrumentId: toStringOrNull(row.INSTRID),
    status: toStringOrNull(row.STATUS),
    listLevel: toNumberOrNull(row.LISTLEVEL),
    lotSize: toNumberOrNull(row.LOTSIZE),
    faceValue: toNumberOrNull(row.FACEVALUE),
    previousPrice: toNumberOrNull(row.PREVPRICE),
    previousWapPrice: toNumberOrNull(row.PREVWAPRICE),
    previousLegalClosePrice: toNumberOrNull(row.PREVLEGALCLOSEPRICE),
    decimals: toNumberOrNull(row.DECIMALS),
    minStep: toNumberOrNull(row.MINSTEP)
  };
}

/**
 * @param {Record<string, unknown>} row
 */
function normalizeMarketDataRow(row) {
  return {
    secId: toStringOrNull(row.SECID),
    boardId: toStringOrNull(row.BOARDID),
    lastPrice: toNumberOrNull(row.LAST),
    marketPrice: toNumberOrNull(row.MARKETPRICE),
    marketPriceToday: toNumberOrNull(row.MARKETPRICETODAY),
    open: toNumberOrNull(row.OPEN),
    low: toNumberOrNull(row.LOW),
    high: toNumberOrNull(row.HIGH),
    bid: toNumberOrNull(row.BID),
    offer: toNumberOrNull(row.OFFER),
    wapPrice: toNumberOrNull(row.WAPRICE),
    change: toNumberOrNull(row.CHANGE),
    lastChange: toNumberOrNull(row.LASTCHANGE),
    lastChangePercent: toNumberOrNull(row.LASTCHANGEPRCNT),
    lastToPreviousPrice: toNumberOrNull(row.LASTTOPREVPRICE),
    numTrades: toNumberOrNull(row.NUMTRADES),
    volumeToday: toNumberOrNull(row.VOLTODAY),
    valueToday: toNumberOrNull(row.VALTODAY),
    valueTodayRub: toNumberOrNull(row.VALTODAY_RUR),
    updateTime: toStringOrNull(row.UPDATETIME),
    tradeTime: toStringOrNull(row.TIME),
    systemTime: toStringOrNull(row.SYSTIME),
    tradingStatus: toStringOrNull(row.TRADINGSTATUS),
    issueCapitalization: toNumberOrNull(row.ISSUECAPITALIZATION)
  };
}

/**
 * @param {Record<string, unknown>} row
 */
function normalizeDataVersionRow(row) {
  return {
    dataVersion: toNumberOrNull(row.data_version),
    sequenceNumber: toNumberOrNull(row.seqnum),
    tradeDate: toStringOrNull(row.trade_date),
    tradeSessionDate: toStringOrNull(row.trade_session_date)
  };
}

/**
 * @param {string | Record<string, unknown>} payload
 */
function parseSecurityResponse(payload) {
  const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
  const securityRow = rowsFromBlock(parsed.securities)[0];
  const marketDataRow = rowsFromBlock(parsed.marketdata)[0];
  const dataVersionRow = rowsFromBlock(parsed.dataversion)[0];

  if (!securityRow) {
    throw new Error("MOEX ISS response did not contain a securities row.");
  }

  if (!marketDataRow) {
    throw new Error("MOEX ISS response did not contain a marketdata row.");
  }

  return {
    security: normalizeSecurityRow(securityRow),
    marketData: normalizeMarketDataRow(marketDataRow),
    dataVersion: dataVersionRow ? normalizeDataVersionRow(dataVersionRow) : null
  };
}

/**
 * @param {string | Record<string, unknown>} payload
 */
function parseSecuritiesListResponse(payload) {
  const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;

  return rowsFromBlock(parsed.securities).map((row) => ({
    secId: toStringOrNull(row.SECID),
    shortName: toStringOrNull(row.SHORTNAME),
    lotSize: toNumberOrNull(row.LOTSIZE),
    isin: toStringOrNull(row.ISIN)
  }));
}

module.exports = {
  parseSecurityResponse,
  parseSecuritiesListResponse
};

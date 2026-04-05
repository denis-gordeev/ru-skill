const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildSecurityUrl,
  buildSecuritiesListUrl,
  getSecurityOverview,
  listShares
} = require("../src/index");
const {
  parseSecurityResponse,
  parseSecuritiesListResponse
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const securityFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "security-sber.json"), "utf8"));
const listFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "securities-page-0.json"), "utf8"));

test("parseSecurityResponse normalizes a MOEX ISS security payload", () => {
  const parsed = parseSecurityResponse(securityFixture);

  assert.deepEqual(parsed.security, {
    secId: "SBER",
    boardId: "TQBR",
    shortName: "Сбербанк",
    name: "Сбербанк России ПАО ао",
    isin: "RU0009029540",
    currencyId: "SUR",
    faceUnit: "SUR",
    previousDate: "2026-04-03",
    settleDate: "2026-04-07",
    marketCode: "FNDT",
    instrumentId: "EQIN",
    status: "A",
    listLevel: 1,
    lotSize: 1,
    faceValue: 3,
    previousPrice: 314.65,
    previousWapPrice: 315.46,
    previousLegalClosePrice: 315,
    decimals: 2,
    minStep: 0.01
  });
  assert.equal(parsed.marketData.lastPrice, 315.15);
  assert.equal(parsed.marketData.issueCapitalization, 6803774270640);
  assert.equal(parsed.dataVersion.tradeDate, "2026-04-05");
});

test("parseSecuritiesListResponse normalizes a page of share rows", () => {
  assert.deepEqual(parseSecuritiesListResponse(listFixture), [
    {
      secId: "ABIO",
      shortName: "iАРТГЕН ао",
      lotSize: 10,
      isin: "RU000A0JNAB6"
    },
    {
      secId: "ABRD",
      shortName: "АбрауДюрсо",
      lotSize: 10,
      isin: "RU000A0JS5T7"
    },
    {
      secId: "AFKS",
      shortName: "Система ао",
      lotSize: 100,
      isin: "RU000A0DQZE3"
    }
  ]);
});

test("URL builders pin the official ISS endpoints and required query params", () => {
  assert.equal(
    buildSecurityUrl("sber"),
    "https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER.json?iss.meta=off"
  );
  assert.equal(
    buildSecuritiesListUrl({ start: 100 }),
    "https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json?iss.meta=off&securities.columns=SECID%2CSHORTNAME%2CLOTSIZE%2CISIN&start=100"
  );
  assert.throws(() => buildSecurityUrl("SBER/RM"), /MOEX ticker characters/);
});

test("public helpers fetch and normalize overview and list payloads", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.includes("/securities/SBER.json")) {
      return new Response(JSON.stringify(securityFixture), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (value.includes("/securities.json")) {
      return new Response(JSON.stringify(listFixture), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const overview = await getSecurityOverview("sber");
    const shares = await listShares();

    assert.equal(overview.requestedSecId, "SBER");
    assert.equal(overview.security.shortName, "Сбербанк");
    assert.equal(overview.marketData.lastChangePercent, 0.02);
    assert.equal(shares.boardId, "TQBR");
    assert.equal(shares.items.length, 3);
  } finally {
    global.fetch = originalFetch;
  }
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { getDailyRates, getRate, getRateWithChange } = require("../src/index");
const { findCurrencyByCode, parseDailyRatesXml } = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const daily20260402 = fs.readFileSync(path.join(fixturesDir, "daily-2026-04-02.xml"), "utf8");
const daily20260401 = fs.readFileSync(path.join(fixturesDir, "daily-2026-04-01.xml"), "utf8");

test("parseDailyRatesXml normalizes official CBR XML into numeric currency rows", () => {
  const parsed = parseDailyRatesXml(daily20260402);

  assert.equal(parsed.date, "2026-04-02");
  assert.equal(parsed.name, "Foreign Currency Market");
  assert.equal(parsed.currencies.length, 3);
  assert.deepEqual(findCurrencyByCode(parsed, "usd"), {
    id: "R01235",
    numCode: "840",
    charCode: "USD",
    nominal: 1,
    name: "Доллар США",
    value: 80.6234,
    unitRate: 80.6234
  });
});

test("findCurrencyByCode rejects invalid codes", () => {
  const parsed = parseDailyRatesXml(daily20260402);

  assert.throws(() => findCurrencyByCode(parsed, "USDT"), /3-letter ISO currency code/);
  assert.throws(() => findCurrencyByCode(parsed, "CHF"), /was not present/);
});

test("public fetchers normalize requested and published dates", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const dateReq = new URL(String(url)).searchParams.get("date_req");

    if (dateReq === "02/04/2026") {
      return makeXmlResponse(daily20260402);
    }

    if (dateReq === "01/04/2026") {
      return makeXmlResponse(daily20260401);
    }

    throw new Error(`Unexpected mocked date_req: ${dateReq}`);
  };

  try {
    const daily = await getDailyRates("2026-04-02");
    assert.equal(daily.date, "2026-04-02");

    const eur = await getRate("EUR", "2026-04-02");
    assert.equal(eur.requestedDate, "2026-04-02");
    assert.equal(eur.publishedDate, "2026-04-02");
    assert.equal(eur.unitRate, 93.4443);

    const cny = await getRateWithChange("CNY", "2026-04-02");
    assert.equal(cny.previousPublishedDate, "2026-04-01");
    assert.equal(cny.previousUnitRate, 11.65);
    assert.deepEqual(cny.change, {
      absolute: 0.057,
      percent: 0.4893,
      direction: "up"
    });
  } finally {
    global.fetch = originalFetch;
  }
});

/**
 * @param {string} xml
 */
function makeXmlResponse(xml) {
  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=windows-1251"
    }
  });
}

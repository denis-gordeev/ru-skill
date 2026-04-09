const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildRegionOrigin,
  buildWarningUrl,
  buildWarningsIndexUrl,
  getStormWarning,
  listStormWarnings
} = require("../src/index");
const {
  normalizeRegionHost,
  normalizeRussianDateTime,
  parseStormWarningPage,
  parseStormWarningsIndex
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const warningsIndexFixture = fs.readFileSync(path.join(fixturesDir, "warnings-index.html"), "utf8");
const warningDetailFixture = fs.readFileSync(path.join(fixturesDir, "warning-5695266.html"), "utf8");

test("normalizeRegionHost accepts numeric and named MChS hosts", () => {
  assert.equal(normalizeRegionHost("46"), "46");
  assert.equal(normalizeRegionHost("https://moscow.mchs.gov.ru/news"), "moscow");
  assert.throws(() => normalizeRegionHost("bad host"), /regionHost/);
});

test("normalizeRussianDateTime converts Russian textual timestamps", () => {
  assert.equal(normalizeRussianDateTime("14 февраля 2026, 13:29"), "2026-02-14T13:29:00");
  assert.equal(normalizeRussianDateTime("2026-02-14 13:29"), "2026-02-14T13:29:00");
});

test("URL builders pin the official regional MChS warning paths", () => {
  assert.equal(buildRegionOrigin("46"), "https://46.mchs.gov.ru");
  assert.equal(
    buildWarningsIndexUrl("46"),
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya"
  );
  assert.equal(
    buildWarningsIndexUrl("46", { page: 1 }),
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya?page=1"
  );
  assert.equal(
    buildWarningUrl("46", 5695266),
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya/5695266"
  );
});

test("parseStormWarningsIndex extracts a normalized warning feed", () => {
  const parsed = parseStormWarningsIndex(
    warningsIndexFixture,
    "https://46.mchs.gov.ru",
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya",
    "46"
  );

  assert.equal(parsed.regionHost, "46");
  assert.equal(parsed.regionName, "Курской области");
  assert.equal(parsed.sectionTitle, "Экстренные предупреждения");
  assert.equal(parsed.items.length, 2);
  assert.equal(parsed.items[0].warningId, "5695266");
  assert.match(parsed.items[0].title, /№4/);
  assert.equal(parsed.items[0].publishedAtIso, "2026-02-14T13:29:00");
  assert.equal(
    parsed.items[0].url,
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya/5695266"
  );
});

test("parseStormWarningPage extracts a normalized warning card", () => {
  const parsed = parseStormWarningPage(
    warningDetailFixture,
    "https://46.mchs.gov.ru/deyatelnost/press-centr/operativnaya-informaciya/shtormovye-i-ekstrennye-preduprezhdeniya/5695266",
    "46"
  );

  assert.equal(parsed.warningId, "5695266");
  assert.equal(parsed.regionHost, "46");
  assert.equal(parsed.regionName, "Курской области");
  assert.match(parsed.title, /Экстренное предупреждение №4/);
  assert.equal(parsed.sectionTitle, "Экстренные предупреждения");
  assert.equal(parsed.publishedAtIso, "2026-02-14T13:29:00");
  assert.match(parsed.bodyText, /очень сильный снег/);
  assert.match(parsed.bodyText, /меры предосторожности/);
  assert.equal(parsed.pdfUrl, "https://46.mchs.gov.ru/export/pdf/News/5695266");
  assert.equal(parsed.wordUrl, "https://46.mchs.gov.ru/export/docx/News/5695266");
  assert.match(parsed.imageUrl, /65991f0bd3415be0144564e40d47a13f\.jpg/);
});

test("public helpers fetch and normalize the MChS warning feed and detail page", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.includes("shtormovye-i-ekstrennye-preduprezhdeniya/5695266")) {
      return new Response(warningDetailFixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    if (value.includes("shtormovye-i-ekstrennye-preduprezhdeniya")) {
      return new Response(warningsIndexFixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const list = await listStormWarnings("46");
    const detail = await getStormWarning("46", list.items[0].warningId);

    assert.equal(list.items[0].warningId, "5695266");
    assert.match(detail.bodyText, /очень сильный снег/);
  } finally {
    global.fetch = originalFetch;
  }
});

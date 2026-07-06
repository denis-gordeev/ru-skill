const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildRegionOrigin,
  buildWarningUrl,
  buildWarningsIndexUrl,
  getStormWarning,
  listStormWarnings,
  listRegions,
  lookupRegion
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

test("normalizeRegionHost принимает числовые и именованные имена узлов МЧС", () => {
  assert.equal(normalizeRegionHost("46"), "46");
  assert.equal(normalizeRegionHost("https://moscow.mchs.gov.ru/news"), "moscow");
  assert.throws(() => normalizeRegionHost("bad host"), /regionHost/);
});

test("normalizeRussianDateTime преобразует русские текстовые временные метки", () => {
  assert.equal(normalizeRussianDateTime("14 февраля 2026, 13:29"), "2026-02-14T13:29:00");
  assert.equal(normalizeRussianDateTime("2026-02-14 13:29"), "2026-02-14T13:29:00");
});

test("построители URL формируют официальные региональные пути предупреждений МЧС", () => {
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

test("parseStormWarningsIndex извлекает нормализованную ленту предупреждений", () => {
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

test("parseStormWarningPage извлекает нормализованную карточку предупреждения", () => {
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

test("normalizeRussianDateTime возвращает null для некорректного ввода", () => {
  assert.equal(normalizeRussianDateTime(null), null);
  assert.equal(normalizeRussianDateTime(""), null);
  assert.equal(normalizeRussianDateTime("не дата"), null);
});

test("buildWarningsIndexUrl отклоняет отрицательный номер страницы", () => {
  assert.throws(() => buildWarningsIndexUrl("46", { page: -1 }), /page/);
});

test("buildWarningUrl отклоняет пустой идентификатор предупреждения", () => {
  assert.throws(() => buildWarningUrl("46", ""), /warningPathOrId/);
  assert.throws(() => buildWarningUrl("46", "  "), /warningPathOrId/);
});

test("buildWarningUrl принимает абсолютный URL предупреждения", () => {
  const absolute = "https://46.mchs.gov.ru/some/path/123";
  assert.equal(buildWarningUrl("46", absolute), absolute);
});

test("публичные помощники загружают и нормализуют ленту и карточку предупреждений МЧС", async () => {
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

    throw new Error(`Неожиданный имитированный URL: ${value}`);
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

test("lookupRegion находит регионы по числовому имени узла", () => {
  const result = lookupRegion("46");
  assert.equal(result.host, "46");
  assert.equal(result.name, "Курская область");
});

test("lookupRegion находит регионы по именованному имени узла", () => {
  const moscow = lookupRegion("moscow");
  assert.equal(moscow.host, "moscow");
  assert.equal(moscow.name, "г. Москва");

  const spb = lookupRegion("78");
  assert.equal(spb.host, "78");
  assert.equal(spb.name, "г. Санкт-Петербург");
});

test("lookupRegion находит регионы по русскому названию", () => {
  const kursk = lookupRegion("Курская область");
  assert.equal(kursk.host, "46");
  assert.equal(kursk.name, "Курская область");

  const moscowResult = lookupRegion("Москва");
  assert.equal(moscowResult.host, "moscow");
  assert.equal(moscowResult.name, "г. Москва");

  const spbResult = lookupRegion("Санкт-Петербург");
  assert.equal(spbResult.host, "78");
  assert.equal(spbResult.name, "г. Санкт-Петербург");
});

test("lookupRegion поддерживает нечёткий поиск", () => {
  const result = lookupRegion("Курская");
  assert.equal(result.host, "46");

  const tatarstan = lookupRegion("Татарстан");
  assert.equal(tatarstan.host, "16");
});

test("lookupRegion находит регионы по разговорным названиям и сокращениям", () => {
  assert.equal(lookupRegion("Удмуртия").host, "18");
  assert.equal(lookupRegion("Башкирия").host, "02");
  assert.equal(lookupRegion("Чувашия").host, "21");
  assert.equal(lookupRegion("Кабардино-Балкария").host, "07");
  assert.equal(lookupRegion("Карачаево-Черкесия").host, "09");
  assert.equal(lookupRegion("Питер").host, "78");
  assert.equal(lookupRegion("СПб").host, "78");
  assert.equal(lookupRegion("Подмосковье").host, "50");
  assert.equal(lookupRegion("Чукотка").host, "87");
  assert.equal(lookupRegion("Кемерово").host, "42");
  assert.equal(lookupRegion("Кузбасс").host, "42");
  assert.equal(lookupRegion("Тюмень").host, "72");
  assert.equal(lookupRegion("Якутия").host, "14");
  assert.equal(lookupRegion("Чечня").host, "20");
  assert.equal(lookupRegion("Дагестан").host, "05");
  assert.equal(lookupRegion("Крым").host, "91");
});

test("lookupRegion отклоняет тривиально короткие и бессмысленные запросы", () => {
  assert.equal(lookupRegion("ия"), null);
  assert.equal(lookupRegion("ская"), null);
  assert.equal(lookupRegion("Республика"), null);
  assert.equal(lookupRegion("область"), null);
  assert.equal(lookupRegion("край"), null);
});

test("lookupRegion возвращает null для неизвестных регионов", () => {
  assert.equal(lookupRegion("unknown"), null);
  assert.equal(lookupRegion(""), null);
});

test("listRegions возвращает все уникальные регионы, отсортированные по русскому названию", () => {
  const regions = listRegions();
  assert.ok(regions.length > 70);
  assert.equal(regions[0].name, "Алтайский край");
  
  // Проверка на дубликаты — каждое имя узла должно встречаться один раз
  const hosts = new Set(regions.map(r => r.host));
  assert.equal(hosts.size, regions.length);
});

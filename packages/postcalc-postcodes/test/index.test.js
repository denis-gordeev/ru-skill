const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildCityUrl,
  buildOfficeUrl,
  getCityOverview,
  getOfficeOverview
} = require("../src/index");
const {
  parseCityPage,
  parseOfficePage
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const officeFixture = fs.readFileSync(path.join(fixturesDir, "office-109189.html"), "utf8");
const cityFixture = fs.readFileSync(path.join(fixturesDir, "city-syktyvkar.html"), "utf8");

test("parseOfficePage normalizes a Postcalc office card", () => {
  assert.deepEqual(parseOfficePage(officeFixture), {
    postalCode: "109189",
    officeName: "Москва 189",
    phone: "+7 800-1-000-000",
    regId: 77,
    cityKey: "Москва",
    cityKeyUnique: "Москва",
    cityKeyFull: "Москва, 77",
    latitude: 55.748235,
    longitude: 37.648133,
    region: "Москва",
    district: null,
    address: "г Москва, Николоямская ул, 1",
    officeType: "Отделение связи",
    workSchedule: null,
    canonicalUrl: "https://postcalc.ru/offices/109189"
  });
});

test("parseCityPage normalizes Postcalc city parameters and offices list", () => {
  const parsed = parseCityPage(cityFixture);

  assert.equal(parsed.cityName, "Сыктывкар");
  assert.equal(parsed.regId, 11);
  assert.equal(parsed.cityKey, "Сыктывкар");
  assert.equal(parsed.defaultPostalCode, "167000");
  assert.equal(parsed.population, 243536);
  assert.equal(parsed.populationDate, "2000-01-01");
  assert.deepEqual(parsed.regionAliases.slice(0, 3), ["Коми республика", "Республика Коми", "Коми"]);
  assert.deepEqual(parsed.offices, [
    {
      postalCode: "167000",
      officeName: "Сыктывкар",
      latitude: 61.669203,
      longitude: 50.834656,
      address: "Коми республика, г Сыктывкар, Ленина ул, 60",
      note: "Прием Посылки Онлайн. Прием Курьера Онлайн. Прием EMS Оптимальное. Выдача EMS Оптимальное. Прием ЕКОМ.",
      postcalcUrl: "https://postcalc.ru/offices/167000",
      russianPostUrl: "https://www.pochta.ru/offices/167000"
    },
    {
      postalCode: "167001",
      officeName: "Сыктывкар 1",
      latitude: 61.661918,
      longitude: 50.812225,
      address: "Коми республика, г Сыктывкар, Коммунистическая ул, 39",
      note: "Прием Посылки Онлайн.",
      postcalcUrl: "https://postcalc.ru/offices/167001",
      russianPostUrl: "https://www.pochta.ru/offices/167001"
    },
    {
      postalCode: "167700",
      officeName: "УФПС Республики Коми",
      latitude: 61.669203,
      longitude: 50.834656,
      address: "Коми республика, г Сыктывкар, Ленина ул, 60",
      note: "Нет в Паспорте ОПС.",
      postcalcUrl: "https://postcalc.ru/offices/167700",
      russianPostUrl: "https://www.pochta.ru/offices/167700"
    }
  ]);
});

test("URL builders pin the public Postcalc endpoints", () => {
  assert.equal(buildOfficeUrl("109189"), "https://postcalc.ru/offices/109189");
  assert.equal(buildCityUrl("Сыктывкар"), "https://postcalc.ru/cities/%D0%A1%D1%8B%D0%BA%D1%82%D1%8B%D0%B2%D0%BA%D0%B0%D1%80");
  assert.throws(() => buildOfficeUrl("10918"), /6-digit Russian postal code/);
  assert.throws(() => buildCityUrl(" "), /non-empty string/);
});

test("public helpers fetch and normalize office and city pages", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.endsWith("/offices/109189")) {
      return new Response(officeFixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    if (value.endsWith("/cities/%D0%A1%D1%8B%D0%BA%D1%82%D1%8B%D0%B2%D0%BA%D0%B0%D1%80")) {
      return new Response(cityFixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const office = await getOfficeOverview("109189");
    const city = await getCityOverview("Сыктывкар");

    assert.equal(office.requestedPostalCode, "109189");
    assert.equal(office.officeName, "Москва 189");
    assert.equal(city.requestedCityKey, "Сыктывкар");
    assert.equal(city.defaultPostalCode, "167000");
    assert.equal(city.offices.length, 3);
  } finally {
    global.fetch = originalFetch;
  }
});

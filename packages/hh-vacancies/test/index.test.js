const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildAreaUrl,
  buildVacancySearchUrl,
  buildVacancyUrl,
  getAreaOverview,
  getVacancyOverview,
  searchVacancies
} = require("../src/index");
const {
  parseAreaResponse,
  parseVacancyResponse,
  parseVacancySearchResponse,
  stripHtml
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const areaFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "area-moscow.json"), "utf8"));
const vacanciesFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "vacancies-frontend-moscow.json"), "utf8"));
const vacancyFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "vacancy-131927189.json"), "utf8"));

test("parseAreaResponse normalizes an HH area payload", () => {
  assert.deepEqual(parseAreaResponse(areaFixture), {
    areaId: "1",
    parentAreaId: "113",
    name: "Москва",
    utcOffset: "+03:00",
    latitude: 55.749646,
    longitude: 37.62368,
    children: []
  });
});

test("parseVacancySearchResponse normalizes an HH vacancies page", () => {
  const parsed = parseVacancySearchResponse(vacanciesFixture);

  assert.equal(parsed.found, 895);
  assert.equal(parsed.perPage, 2);
  assert.equal(parsed.items.length, 2);
  assert.deepEqual(parsed.items[0], {
    vacancyId: "131942268",
    title: "Frontend - разработчик (ЭКИ)",
    area: {
      areaId: "1",
      parentAreaId: null,
      name: "Москва",
      utcOffset: null,
      latitude: null,
      longitude: null
    },
    salary: null,
    publishedAt: "2026-04-08T10:20:33+0300",
    vacancyUrl: "https://hh.ru/vacancy/131942268",
    employer: {
      employerId: "24209",
      name: "СберЛизинг",
      trusted: true,
      accreditedItEmployer: false,
      employerUrl: "https://hh.ru/employer/24209"
    },
    snippet: {
      requirement: "Опыт FE-разработки более 4 лет. Навык владения JavaScript / ES6 / 7 / 8 / 9, TypeScript (обязательно). Опыт работы с React...",
      responsibility: "Разрабатывать новые и дорабатывать существующие бизнес-процессы в части UI по требованиям заказчиков. Осуществлять поддержку пользователей по возникающим вопросам."
    },
    schedule: "Полный день",
    experience: "От 3 до 6 лет",
    employment: "Полная занятость",
    workFormats: ["На месте работодателя"],
    professionalRoles: ["Программист, разработчик"]
  });
  assert.equal(parsed.items[1].salary.from, 180000);
  assert.equal(parsed.items[1].salary.period, "За месяц");
});

test("parseVacancyResponse normalizes a detailed HH vacancy payload", () => {
  assert.deepEqual(parseVacancyResponse(vacancyFixture), {
    vacancyId: "131927189",
    title: "Middle Frontend-разработчик (React / React Admin)",
    area: {
      areaId: "1",
      parentAreaId: null,
      name: "Москва",
      utcOffset: null,
      latitude: null,
      longitude: null
    },
    salary: {
      from: 180000,
      to: null,
      currency: "RUR",
      gross: false,
      period: "За месяц",
      payoutFrequency: "Два раза в месяц"
    },
    address: {
      raw: "Москва, Научный проезд, 19",
      city: "Москва",
      street: "Научный проезд",
      building: "19",
      latitude: 55.653304,
      longitude: 37.553963,
      nearestMetro: {
        stationName: "Воронцовская",
        lineName: "Большая кольцевая линия"
      },
      metroStations: [
        {
          stationName: "Воронцовская",
          lineName: "Большая кольцевая линия"
        },
        {
          stationName: "Зюзино",
          lineName: "Большая кольцевая линия"
        },
        {
          stationName: "Калужская",
          lineName: "Калужско-Рижская"
        }
      ]
    },
    experience: "От 1 года до 3 лет",
    schedule: "Полный день",
    employment: "Полная занятость",
    employmentForm: "Полная",
    descriptionText: "В компанию Авеню групп требуется Middle Frontend-разработчик.\n\nО проекте\nНам нужен разработчик, который возьмет на себя создание клиентской части для мощного RESTful API.\n\n- Разработка SPA на React для админской панели.\n- Интеграция с готовым RESTful API.\n- Верстка по макетам.\n\nУсловия:\n\n- Гибридный режим работы.\n- Комфортный офис рядом с метро.",
    keySkills: [],
    employer: {
      employerId: "5574166",
      name: "Бизнес Совет",
      trusted: true,
      accreditedItEmployer: false,
      employerUrl: "https://hh.ru/employer/5574166"
    },
    publishedAt: "2026-04-07T17:21:28+0300",
    vacancyUrl: "https://hh.ru/vacancy/131927189",
    professionalRoles: ["Программист, разработчик"],
    workFormats: ["Гибрид"],
    workingHours: ["8 часов"],
    workScheduleByDays: ["5/2"]
  });
});

test("URL builders pin public HH endpoints", () => {
  assert.equal(buildAreaUrl(1), "https://api.hh.ru/areas/1");
  assert.equal(buildVacancyUrl("131927189"), "https://api.hh.ru/vacancies/131927189");
  assert.equal(
    buildVacancySearchUrl("frontend react", { areaId: 1, page: 0, perPage: 2 }),
    "https://api.hh.ru/vacancies?text=frontend+react&area=1&page=0&per_page=2"
  );
  assert.throws(() => buildVacancyUrl("abc"), /digits only/);
  assert.throws(() => buildVacancySearchUrl(" ", { areaId: 1 }), /non-empty string/);
});

test("public helpers fetch and normalize HH payloads", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.endsWith("/areas/1")) {
      return new Response(JSON.stringify(areaFixture), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (value.includes("/vacancies?")) {
      return new Response(JSON.stringify(vacanciesFixture), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    if (value.endsWith("/vacancies/131927189")) {
      return new Response(JSON.stringify(vacancyFixture), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const area = await getAreaOverview(1);
    const search = await searchVacancies("frontend", { areaId: 1, perPage: 2 });
    const vacancy = await getVacancyOverview("131927189");

    assert.equal(area.name, "Москва");
    assert.equal(search.items[0].vacancyId, "131942268");
    assert.equal(vacancy.address.nearestMetro.stationName, "Воронцовская");
  } finally {
    global.fetch = originalFetch;
  }
});

test("stripHtml keeps readable paragraphs and bullet lists", () => {
  assert.equal(
    stripHtml("<p>Текст</p><ul><li>Пункт 1</li><li>Пункт 2</li></ul>"),
    "Текст\n\n- Пункт 1\n- Пункт 2"
  );
});

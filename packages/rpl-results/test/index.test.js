const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  decodeHtmlEntities,
  stripTags,
  matchOne,
  toNumberOrNull,
  parseStandings,
  parseMatchResults,
} = require("../src/parse");

const {
  buildStandingsUrl,
  buildResultsUrl,
  getStandings,
  getResults,
} = require("../src/index");

//
// Модульные тесты утилит парсинга
//

test("decodeHtmlEntities декодирует типичные сущности", () => {
  assert.equal(decodeHtmlEntities("&amp;"), "&");
  assert.equal(decodeHtmlEntities("&quot;"), '"');
  assert.equal(decodeHtmlEntities("&lt;"), "<");
  assert.equal(decodeHtmlEntities("&gt;"), ">");
  assert.equal(decodeHtmlEntities("&#60;"), "<");
  assert.equal(decodeHtmlEntities("&#x3C;"), "<");
  assert.equal(decodeHtmlEntities("a&nbsp;b"), "a b");
});

test("stripTags удаляет HTML и нормализует пробелы", () => {
  assert.equal(stripTags("<p>Hello</p>"), "Hello");
  assert.equal(stripTags("<a href='/x'>Link</a>"), "Link");
  assert.equal(stripTags("<span>  multiple   spaces  </span>"), "multiple spaces");
});

test("matchOne возвращает первую группу захвата или null", () => {
  assert.equal(matchOne(/value="([^"]+)"/, 'value="test"'), "test");
  assert.equal(matchOne(/value="([^"]+)"/, "no match here"), null);
});

test("toNumberOrNull преобразует строки в числа", () => {
  assert.equal(toNumberOrNull("42"), 42);
  assert.equal(toNumberOrNull("3.14"), 3.14);
  assert.equal(toNumberOrNull(""), null);
  assert.equal(toNumberOrNull(null), null);
  assert.equal(toNumberOrNull("abc"), null);
});

//
// Тесты построения URL
//

test("buildStandingsUrl возвращает URL таблицы РПЛ на championat.com", () => {
  const url = buildStandingsUrl();
  assert.equal(url, "https://www.championat.com/football/_russiapl/tournament/5980/table/");
});

test("buildResultsUrl возвращает URL результатов РПЛ на championat.com", () => {
  const url = buildResultsUrl();
  assert.equal(url, "https://www.championat.com/football/_russiapl/tournament/5980/results/");
});

//
// Тесты парсера на фикстурах
//

test("parseStandings корректно разбирает HTML-фикстуру", () => {
  const fixturePath = path.join(__dirname, "fixtures", "standings.html");
  const html = fs.readFileSync(fixturePath, "utf-8");
  const standings = parseStandings(html);

  assert.equal(standings.length, 5);

  // Первое место: Краснодар
  assert.deepEqual(standings[0], {
    rank: 1,
    team: "Краснодар",
    played: 30,
    wins: 20,
    draws: 7,
    losses: 3,
    goalsFor: 59,
    goalsAgainst: 23,
    goalDifference: 36,
    points: 67,
  });

  // Второе место: Зенит
  assert.deepEqual(standings[1], {
    rank: 2,
    team: "Зенит",
    played: 30,
    wins: 20,
    draws: 6,
    losses: 4,
    goalsFor: 58,
    goalsAgainst: 18,
    goalDifference: 40,
    points: 66,
  });

  // Пятое место: Локомотив
  assert.deepEqual(standings[4], {
    rank: 5,
    team: "Локомотив",
    played: 30,
    wins: 15,
    draws: 9,
    losses: 6,
    goalsFor: 45,
    goalsAgainst: 30,
    goalDifference: 15,
    points: 54,
  });
});

test("parseMatchResults корректно разбирает HTML-фикстуру", () => {
  const fixturePath = path.join(__dirname, "fixtures", "results.html");
  const html = fs.readFileSync(fixturePath, "utf-8");
  const matches = parseMatchResults(html);

  assert.equal(matches.length, 5);

  // Первый матч: Краснодар 2:1 Зенит
  assert.deepEqual(matches[0], {
    date: "20.07.2024",
    homeTeam: "Краснодар",
    awayTeam: "Зенит",
    homeScore: 2,
    awayScore: 1,
  });

  // Третий матч: Локомотив 1:1 Динамо
  assert.deepEqual(matches[2], {
    date: "21.07.2024",
    homeTeam: "Локомотив",
    awayTeam: "Динамо",
    homeScore: 1,
    awayScore: 1,
  });

  // Последний матч: Спартак М 2:0 Локомотив
  assert.deepEqual(matches[4], {
    date: "28.07.2024",
    homeTeam: "Спартак М",
    awayTeam: "Локомотив",
    homeScore: 2,
    awayScore: 0,
  });
});

//
// Интеграционные тесты с имитированными запросами
//

test("getStandings получает и разбирает турнирную таблицу через имитированный запрос", async () => {
  const fixturePath = path.join(__dirname, "fixtures", "standings.html");
  const html = fs.readFileSync(fixturePath, "utf-8");

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    text: async () => html,
  });

  const result = await getStandings({ fetcher: mockFetch });

  assert.equal(result.season, "2024/25");
  assert.equal(result.source, "championat.com");
  assert.ok(Array.isArray(result.standings));
  assert.equal(result.standings.length, 5);
  assert.equal(result.standings[0].team, "Краснодар");
});

test("getStandings выбрасывает ошибку при неуспешном ответе", async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 500,
  });

  await assert.rejects(
    async () => getStandings({ fetcher: mockFetch }),
    /championat\.com вернул 500/
  );
});

test("getResults получает и разбирает результаты через имитированный запрос", async () => {
  const fixturePath = path.join(__dirname, "fixtures", "results.html");
  const html = fs.readFileSync(fixturePath, "utf-8");

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    text: async () => html,
  });

  const result = await getResults({ fetcher: mockFetch });

  assert.equal(result.season, "2024/25");
  assert.equal(result.source, "championat.com");
  assert.ok(Array.isArray(result.matches));
  assert.equal(result.matches.length, 5);
  assert.equal(result.matches[0].homeTeam, "Краснодар");
  assert.equal(result.matches[0].awayTeam, "Зенит");
});

test("getResults выбрасывает ошибку при неуспешном ответе", async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 404,
  });

  await assert.rejects(
    async () => getResults({ fetcher: mockFetch }),
    /championat\.com вернул 404/
  );
});

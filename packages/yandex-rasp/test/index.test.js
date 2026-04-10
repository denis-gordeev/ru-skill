const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { searchStations, getStationSchedule, searchTrips } = require("../src/index");
const {
  isValidStationCode,
  formatDuration,
  extractTransportTypes,
  groupByTransportType,
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const stationsListJson = fs.readFileSync(path.join(fixturesDir, "stations-list.json"), "utf8");
const scheduleJson = fs.readFileSync(path.join(fixturesDir, "schedule-departure.json"), "utf8");
const searchTripsJson = fs.readFileSync(path.join(fixturesDir, "search-trips.json"), "utf8");

// --- parse.js tests ---

test("isValidStationCode accepts valid s- and c-codes", () => {
  assert.equal(isValidStationCode("s9600013"), true);
  assert.equal(isValidStationCode("c146"), true);
  assert.equal(isValidStationCode("s1"), true);
  assert.equal(isValidStationCode("c999"), true);
});

test("isValidStationCode rejects invalid codes", () => {
  assert.equal(isValidStationCode("abc"), false);
  assert.equal(isValidStationCode(""), false);
  assert.equal(isValidStationCode("9600013"), false);
  assert.equal(isValidStationCode(null), false);
});

test("formatDuration produces Russian-language output", () => {
  assert.equal(formatDuration(0), "0 мин");
  assert.equal(formatDuration(60), "1 мин");
  assert.equal(formatDuration(3660), "1 ч 1 мин");
  assert.equal(formatDuration(29400), "8 ч 10 мин");
  assert.equal(formatDuration(-1), "");
  assert.equal(formatDuration(null), "");
});

test("extractTransportTypes returns unique types from entries", () => {
  const entries = [
    { thread: { transportType: "suburban" } },
    { thread: { transportType: "train" } },
    { thread: { transportType: "suburban" } },
  ];
  const types = extractTransportTypes(entries);
  assert.deepEqual(types.sort(), ["suburban", "train"].sort());
});

test("groupByTransportType groups entries by transport type", () => {
  const entries = [
    { thread: { transportType: "suburban" }, departure: "06:35" },
    { thread: { transportType: "train" }, departure: "12:15" },
  ];
  const groups = groupByTransportType(entries);
  assert.equal(groups.suburban.length, 1);
  assert.equal(groups.train.length, 1);
});

// --- index.js mock-based tests ---

test("searchStations filters stations by query from full directory", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => makeJsonResponse(JSON.parse(stationsListJson));

  try {
    const results = await searchStations("Москва", { apiKey: "test-key" });

    assert.ok(results.length >= 2);
    assert.ok(results.every((r) => r.title.toLowerCase().includes("москва")));

    const kazanStation = results.find((r) => r.title.includes("Казанский"));
    assert.ok(kazanStation);
    assert.equal(kazanStation.yandexCode, "s9600013");
    assert.equal(kazanStation.esrCode, "191416");
    assert.equal(kazanStation.stationType, "station");
    assert.equal(kazanStation.transportType, "train");
    assert.equal(kazanStation.latitude, 55.773398);
    assert.equal(kazanStation.longitude, 37.657803);
  } finally {
    global.fetch = originalFetch;
  }
});

test("getStationSchedule normalizes schedule entries", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => makeJsonResponse(JSON.parse(scheduleJson));

  try {
    const result = await getStationSchedule("s9600013", {
      apiKey: "test-key",
      date: "2026-04-10",
      event: "departure",
    });

    assert.equal(result.station.code, "s9600013");
    assert.equal(result.station.title, "Москва, Казанский вокзал");
    assert.equal(result.date, "2026-04-10");
    assert.equal(result.schedule.length, 2);

    const suburban = result.schedule.find((s) => s.thread.transportType === "suburban");
    assert.ok(suburban);
    assert.equal(suburban.thread.number, "6482");
    assert.equal(suburban.thread.carrier.title, "ЦППК");
    assert.equal(suburban.departure, "2026-04-10T06:35:00+03:00");
    assert.equal(suburban.platform, "3");
    assert.equal(suburban.days, "daily");
  } finally {
    global.fetch = originalFetch;
  }
});

test("searchTrips normalizes segments and pagination", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => makeJsonResponse(JSON.parse(searchTripsJson));

  try {
    const result = await searchTrips("c146", "c159", {
      apiKey: "test-key",
      date: "2026-04-10",
    });

    assert.equal(result.pagination.total, 5);
    assert.equal(result.segments.length, 1);

    const seg = result.segments[0];
    assert.equal(seg.thread.number, "054Ч");
    assert.equal(seg.thread.carrier.title, "ФПК");
    assert.equal(seg.duration, 29400);
    assert.equal(seg.hasTransfers, false);
    assert.ok(seg.ticketsInfo.places.length >= 1);
    assert.equal(seg.ticketsInfo.places[0].currency, "RUB");

    assert.equal(result.search.from.title, "Москва");
    assert.equal(result.search.to.title, "Санкт-Петербург");
  } finally {
    global.fetch = originalFetch;
  }
});

test("searchStations throws when no API key provided", async () => {
  const originalEnv = process.env.YANDEX_RASP_API_KEY;
  delete process.env.YANDEX_RASP_API_KEY;

  try {
    await assert.rejects(
      () => searchStations("Москва"),
      /API key is required/
    );
  } finally {
    process.env.YANDEX_RASP_API_KEY = originalEnv;
  }
});

test("searchStations uses YANDEX_RASP_API_KEY env variable", async () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.YANDEX_RASP_API_KEY;

  global.fetch = async (url) => {
    assert.ok(url.includes("apikey=test-env-key"));
    return makeJsonResponse(JSON.parse(stationsListJson));
  };
  process.env.YANDEX_RASP_API_KEY = "test-env-key";

  try {
    const results = await searchStations("Москва");
    assert.ok(results.length >= 2);
  } finally {
    global.fetch = originalFetch;
    process.env.YANDEX_RASP_API_KEY = originalEnv;
  }
});

/**
 * @param {object} json
 */
function makeJsonResponse(json) {
  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

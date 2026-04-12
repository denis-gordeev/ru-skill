const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { searchNearby, searchRestaurants, searchCafes, searchBars, getPlaceDetails } = require("../src/index");
const { buildOverpassQuery, parseOverpassResponse, formatAddress } = require("../src/query");

const fixturesDir = path.join(__dirname, "fixtures");
const moscowCenterFixture = JSON.parse(fs.readFileSync(path.join(fixturesDir, "moscow_center.json"), "utf8"));

test("buildOverpassQuery generates valid Overpass QL for default categories", () => {
  const query = buildOverpassQuery(55.7558, 37.6173, 1000, ['restaurant', 'cafe', 'bar'], 20);
  
  assert.ok(query.includes('[out:json]'));
  assert.ok(query.includes('around:1000,55.7558,37.6173'));
  assert.ok(query.includes('node["amenity"="restaurant"]'));
  assert.ok(query.includes('node["amenity"="cafe"]'));
  assert.ok(query.includes('node["amenity"="bar"]'));
  assert.ok(query.includes('out body 20'));
});

test("buildOverpassQuery respects custom radius and categories", () => {
  const query = buildOverpassQuery(59.9343, 30.3351, 500, ['restaurant'], 10);
  
  assert.ok(query.includes('around:500,59.9343,30.3351'));
  assert.ok(query.includes('node["amenity"="restaurant"]'));
  assert.ok(!query.includes('node["amenity"="cafe"]'));
  assert.ok(query.includes('out body 10'));
});

test("parseOverpassResponse normalizes OSM elements into place objects", () => {
  const places = parseOverpassResponse(moscowCenterFixture);
  
  assert.equal(places.length, 4);
  
  const pushkin = places.find(p => p.name === "Кафе Пушкинъ");
  assert.ok(pushkin);
  assert.equal(pushkin.amenity, "restaurant");
  assert.equal(pushkin.cuisine, "russian");
  assert.equal(pushkin.address, "Тверской бульвар, 26, Москва");
  assert.equal(pushkin.phone, "+7 495 123-45-67");
  assert.equal(pushkin.website, "https://cafe-pushkin.ru");
  assert.equal(pushkin.openingHours, "Mo-Su 10:00-23:00");
  
  const surf = places.find(p => p.name === "Кофейня Surf");
  assert.ok(surf);
  assert.equal(surf.amenity, "cafe");
  assert.equal(surf.address, "Тверская улица, 15, Москва");
  
  const noor = places.find(p => p.name === "Бар Noor");
  assert.ok(noor);
  assert.equal(noor.amenity, "bar");
  assert.equal(noor.cuisine, "cocktails");
  
  const unnamed = places.find(p => p.name === "Без названия");
  assert.ok(unnamed);
  assert.equal(unnamed.operator, "Теремок");
});

test("parseOverpassResponse handles empty or invalid input", () => {
  assert.deepEqual(parseOverpassResponse({}), []);
  assert.deepEqual(parseOverpassResponse({ elements: [] }), []);
  assert.deepEqual(parseOverpassResponse(null), []);
  assert.deepEqual(parseOverpassResponse(undefined), []);
});

test("formatAddress constructs address from OSM tags", () => {
  const tags1 = {
    'addr:street': 'Тверская улица',
    'addr:housenumber': '15',
    'addr:city': 'Москва'
  };
  assert.equal(formatAddress(tags1), "Тверская улица, 15, Москва");
  
  const tags2 = {
    'addr:street': 'Невский проспект',
    'addr:housenumber': '28'
  };
  assert.equal(formatAddress(tags2), "Невский проспект, 28");
  
  const tags3 = { 'amenity': 'restaurant' };
  assert.equal(formatAddress(tags3), undefined);
});

test("public fetchers call Overpass API with correct parameters", async () => {
  const originalFetch = global.fetch;
  let capturedBody = null;

  global.fetch = async (url, options) => {
    capturedBody = options.body;
    return new Response(JSON.stringify(moscowCenterFixture), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    const places = await searchNearby(55.7558, 37.6173, { radius: 1500, limit: 10 });

    assert.ok(places.length === 4);
    // Body is URL-encoded, decode it for assertions
    const decodedBody = decodeURIComponent(capturedBody.replace('data=', ''));
    assert.ok(decodedBody.includes('around:1500,55.7558,37.6173'));
    assert.ok(decodedBody.includes('out body 10'));

    const restaurants = await searchRestaurants(55.7558, 37.6173, { radius: 2000 });
    const decodedRestaurants = decodeURIComponent(capturedBody.replace('data=', ''));
    assert.ok(decodedRestaurants.includes('node["amenity"="restaurant"]'));
    assert.ok(decodedRestaurants.includes('node["amenity"="fast_food"]'));

    const cafes = await searchCafes(55.7558, 37.6173);
    const decodedCafes = decodeURIComponent(capturedBody.replace('data=', ''));
    assert.ok(decodedCafes.includes('node["amenity"="cafe"]'));

    const bars = await searchBars(55.7558, 37.6173, { limit: 5 });
    const decodedBars = decodeURIComponent(capturedBody.replace('data=', ''));
    assert.ok(decodedBars.includes('node["amenity"="bar"]'));
    assert.ok(decodedBars.includes('node["amenity"="pub"]'));
    assert.ok(decodedBars.includes('out body 5'));
  } finally {
    global.fetch = originalFetch;
  }
});

test("getPlaceDetails fetches single OSM element", async () => {
  const originalFetch = global.fetch;
  
  global.fetch = async () => {
    const singleElementFixture = {
      elements: [
        {
          type: "node",
          id: 1234567890,
          lat: 55.7558,
          lon: 37.6173,
          tags: {
            name: "Кафе Пушкинъ",
            amenity: "restaurant",
            cuisine: "russian"
          }
        }
      ]
    };
    
    return new Response(JSON.stringify(singleElementFixture), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  
  try {
    const place = await getPlaceDetails(1234567890);
    
    assert.ok(place);
    assert.equal(place.name, "Кафе Пушкинъ");
    assert.equal(place.amenity, "restaurant");
    assert.equal(place.cuisine, "russian");
  } finally {
    global.fetch = originalFetch;
  }
});

test("getPlaceDetails returns null for non-existent element", async () => {
  const originalFetch = global.fetch;
  
  global.fetch = async () => {
    return new Response(JSON.stringify({ elements: [] }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };
  
  try {
    const place = await getPlaceDetails(9999999999);
    assert.equal(place, null);
  } finally {
    global.fetch = originalFetch;
  }
});

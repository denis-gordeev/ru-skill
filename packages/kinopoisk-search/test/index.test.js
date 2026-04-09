const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildFilmUrl,
  buildSearchUrl,
  getFilmById,
  searchFilms
} = require("../src/index");
const {
  parseFilmPage,
  parseSearchResults,
  stripTags,
  decodeHtmlEntities
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const film326Fixture = fs.readFileSync(path.join(fixturesDir, "film-326.html"), "utf8");
const searchBratFixture = fs.readFileSync(path.join(fixturesDir, "search-brat.html"), "utf8");

test("decodeHtmlEntities handles common HTML entities", () => {
  assert.equal(decodeHtmlEntities("&lt;div&gt;"), "<div>");
  assert.equal(decodeHtmlEntities("&nbsp;"), " ");
  assert.equal(decodeHtmlEntities("&#65;"), "A");
});

test("stripTags removes HTML and normalizes whitespace", () => {
  assert.equal(stripTags("<p>Hello <b>World</b></p>"), "Hello World");
  assert.equal(stripTags("  multiple   spaces  "), "multiple spaces");
});

test("buildFilmUrl pins the Kinopoisk film page URL", () => {
  assert.equal(buildFilmUrl("326"), "https://www.kinopoisk.ru/film/326/");
  assert.equal(buildFilmUrl("117"), "https://www.kinopoisk.ru/film/117/");
});

test("buildSearchUrl pins the Kinopoisk search URL with encoded query", () => {
  const url = buildSearchUrl("Брат 2");
  assert.ok(url.startsWith("https://www.kinopoisk.ru/index/standalone_search/?query="));
  assert.ok(url.includes("Брат") || url.includes("%D0%91%D1%80%D0%B0%D1%82"));
});

test("parseFilmPage extracts structured data from a film page", () => {
  const parsed = parseFilmPage(film326Fixture, "326");

  assert.equal(parsed.filmId, "326");
  assert.ok(parsed.title.includes("Брат 2"));
  assert.equal(parsed.year, "2000");
  assert.equal(parsed.rating, "7.7");
  assert.ok(parsed.description && parsed.description.includes("Данила Багров"));
  assert.ok(parsed.director && parsed.director.includes("Балабанов"));
  assert.ok(parsed.genres.length > 0);
  assert.ok(parsed.genres.includes("боевик") || parsed.genres.includes("криминал"));
  assert.ok(parsed.actors.length > 0);
  assert.ok(parsed.actors.some(a => a.includes("Бодров")));
});

test("parseSearchResults extracts film list from search page", () => {
  const parsed = parseSearchResults(searchBratFixture, "Брат");

  assert.equal(parsed.query, "Брат");
  assert.ok(parsed.results.length >= 2);

  const firstResult = parsed.results[0];
  assert.equal(firstResult.filmId, "326");
  assert.ok(firstResult.title.includes("Брат 2"));
  assert.equal(firstResult.year, "2000");
  assert.equal(firstResult.rating, "7.7");
  assert.equal(firstResult.url, "https://www.kinopoisk.ru/film/326/");

  const secondResult = parsed.results[1];
  assert.equal(secondResult.filmId, "117");
  assert.ok(secondResult.title.includes("Брат"));
  assert.equal(secondResult.year, "1997");
});

test("public helpers fetch and normalize Kinopoisk pages", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.includes("/film/326/")) {
      return new Response(film326Fixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    if (value.includes("/index/standalone_search/")) {
      return new Response(searchBratFixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const film = await getFilmById("326");
    const results = await searchFilms("Брат");

    assert.equal(film.filmId, "326");
    assert.ok(film.title.includes("Брат 2"));
    assert.ok(results.results.length >= 2);
    assert.equal(results.results[0].filmId, "326");
  } finally {
    global.fetch = originalFetch;
  }
});

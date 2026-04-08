const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  SUPPORTED_GAMES,
  buildArchiveUrl,
  getArchiveDraws,
  getDrawById,
  normalizeGameSlug
} = require("../src/index");
const {
  parseArchivePage,
  parseDrawRow,
  extractWinningNumbers,
  stripTags
} = require("../src/parse");

const fixturesDir = path.join(__dirname, "fixtures");
const archive4x20Fixture = fs.readFileSync(path.join(fixturesDir, "archive-4x20.html"), "utf8");
const archive6x45Fixture = fs.readFileSync(path.join(fixturesDir, "archive-6x45.html"), "utf8");

test("normalizeGameSlug maps common aliases to canonical slugs", () => {
  assert.equal(normalizeGameSlug("4x20"), "4x20");
  assert.equal(normalizeGameSlug("4 из 20"), "4x20");
  assert.equal(normalizeGameSlug("6x45"), "6x45");
  assert.equal(normalizeGameSlug("6 из 45"), "6x45");
  assert.equal(normalizeGameSlug("русское лото"), "ruslotto");
  assert.equal(normalizeGameSlug("топ-3"), "top3");
  assert.throws(() => normalizeGameSlug("unknown-game"), /Unsupported game slug/);
});

test("SUPPORTED_GAMES lists all canonical game slugs", () => {
  assert.ok(SUPPORTED_GAMES.includes("4x20"));
  assert.ok(SUPPORTED_GAMES.includes("6x45"));
  assert.ok(SUPPORTED_GAMES.includes("5x36"));
  assert.ok(SUPPORTED_GAMES.includes("7x49"));
  assert.ok(SUPPORTED_GAMES.includes("ruslotto"));
});

test("buildArchiveUrl pins the public Stoloto archive endpoint", () => {
  assert.equal(buildArchiveUrl("4x20"), "https://www.stoloto.ru/4x20/archive");
  assert.equal(buildArchiveUrl("6x45"), "https://www.stoloto.ru/6x45/archive");
  assert.equal(buildArchiveUrl("ruslotto"), "https://www.stoloto.ru/ruslotto/archive");
});

test("extractWinningNumbers extracts ball numbers from HTML", () => {
  const html = `
    <td class="numbers">
      <span class="ball">3</span>
      <span class="ball">7</span>
      <span class="ball">12</span>
      <span class="ball">18</span>
    </td>
  `;
  const numbers = extractWinningNumbers(html);
  assert.deepEqual(numbers, [3, 7, 12, 18]);
});

test("parseDrawRow extracts structured data from a Stoloto archive row", () => {
  const rowHtml = `
    <tr>
      <td><span class="draw-number">12345</span></td>
      <td><time datetime="2026-04-07">07.04.2026</time></td>
      <td class="numbers">
        <span class="ball">3</span>
        <span class="ball">7</span>
        <span class="ball">12</span>
        <span class="ball">18</span>
      </td>
      <td class="prize">100 000 000 руб</td>
    </tr>
  `;

  const parsed = parseDrawRow(rowHtml);

  assert.equal(parsed.drawNumber, 12345);
  assert.equal(parsed.date, "07.04.2026");
  assert.deepEqual(parsed.numbers, [3, 7, 12, 18]);
  assert.ok(parsed.prize.includes("100"));
});

test("parseArchivePage normalizes a Stoloto 4x20 archive page", () => {
  const parsed = parseArchivePage(archive4x20Fixture, "4x20");

  assert.equal(parsed.gameSlug, "4x20");
  assert.ok(parsed.gameName.includes("4 из 20"));
  assert.equal(parsed.draws.length, 3);

  assert.deepEqual(parsed.draws[0], {
    drawNumber: 12345,
    date: "07.04.2026",
    numbers: [3, 7, 12, 18, 1, 9, 15, 20],
    prize: "100 000 000"
  });

  assert.deepEqual(parsed.draws[1], {
    drawNumber: 12344,
    date: "06.04.2026",
    numbers: [5, 11, 14, 19, 2, 8, 16, 17],
    prize: "95 500 000"
  });

  assert.deepEqual(parsed.draws[2], {
    drawNumber: 12343,
    date: "05.04.2026",
    numbers: [4, 6, 10, 13, 3, 7, 11, 20],
    prize: "90 000 000"
  });
});

test("parseArchivePage normalizes a Stoloto 6x45 archive page", () => {
  const parsed = parseArchivePage(archive6x45Fixture, "6x45");

  assert.equal(parsed.gameSlug, "6x45");
  assert.ok(parsed.gameName.includes("6 из 45"));
  assert.equal(parsed.draws.length, 2);

  assert.deepEqual(parsed.draws[0], {
    drawNumber: 98765,
    date: "07.04.2026",
    numbers: [15, 24, 33, 41, 7, 45],
    prize: "15 000 000"
  });

  assert.deepEqual(parsed.draws[1], {
    drawNumber: 98764,
    date: "06.04.2026",
    numbers: [2, 19, 28, 35, 42, 11],
    prize: "12 750 000"
  });
});

test("public helpers fetch and normalize Stoloto archive pages", async () => {
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    const value = String(url);

    if (value.endsWith("/4x20/archive")) {
      return new Response(archive4x20Fixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    if (value.endsWith("/6x45/archive")) {
      return new Response(archive6x45Fixture, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }

    throw new Error(`Unexpected mocked URL: ${value}`);
  };

  try {
    const draws4x20 = await getArchiveDraws("4x20");
    const draws6x45 = await getArchiveDraws("6x45");
    const drawsAlias = await getArchiveDraws("4 из 20");

    assert.equal(draws4x20.gameSlug, "4x20");
    assert.equal(draws4x20.draws.length, 3);
    assert.equal(draws6x45.gameSlug, "6x45");
    assert.equal(draws6x45.draws.length, 2);
    assert.equal(drawsAlias.gameSlug, "4x20");
  } finally {
    global.fetch = originalFetch;
  }
});

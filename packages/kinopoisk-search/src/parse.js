/**
 * @param {string} value
 * @returns {string}
 */
function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

/**
 * @param {string} value
 * @returns {string}
 */
function stripTags(value) {
  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * @param {string} value
 * @returns {number | null}
 */
function toNumberOrNull(value) {
  if (!value) {
    return null;
  }

  const cleaned = String(value).replace(/\s/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * @param {string} html
 * @param {RegExp} pattern
 * @returns {string | null}
 */
function matchOne(html, pattern) {
  const match = html.match(pattern);
  return match ? stripTags(match[1].trim()) : null;
}

/**
 * Extract movie info from a Kinopoisk film page.
 * @param {string} html
 * @param {string} filmId
 * @returns {{ filmId: string, title: string, year: string | null, rating: string | null, description: string | null, genres: string[], director: string | null, actors: string[] }}
 */
function parseFilmPage(html, filmId) {
  // Title: typically in h1 or title tag
  const title = matchOne(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
    || matchOne(html, /<title>([\s\S]*?)<\/title>/i)
    || "Неизвестный фильм";

  // Year: often in a meta block or near the title
  const year = matchOne(html, /<span\b[^>]*class="[^"]*year[^"]*"[^>]*>(\d{4})/i)
    || matchOne(html, /,\s*(\d{4})\s*,/i)
    || null;

  // Rating: Kinopoisk rating is usually prominently displayed
  const rating = matchOne(html, /class="[^"]*rating[^"]*"[^>]*>([\d.]+)/i)
    || matchOne(html, /Кинопоиск\s*([\d.]+)/i)
    || null;

  // Description: prefer body synopsis over meta description
  const description = matchOne(html, /<div\s+class="brand_words">\s*<p>([\s\S]*?)<\/p>/i)
    || matchOne(html, /<p\b[^>]*class="[^"]*synopsis[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || matchOne(html, /<meta\b[^>]*name="description"[^>]*content="([\s\S]*?)"/i)
    || null;

  // Genres: typically in a info block with links
  const genreLinks = [...html.matchAll(/<span\b[^>]*class="[^"]*genre[^"]*"[^>]*><a[^>]*>([^<]+)<\/a><\/span>/gi)];
  const genres = genreLinks.map(m => m[1].trim()).filter(Boolean);

  // Director: listed in a crew section or info table
  const director = matchOne(html, /режиссёр[^:]*:\s*<a[^>]*>([^<]+)<\/a>/i)
    || matchOne(html, /Режиссер[^:]*:\s*<a[^>]*>([^<]+)<\/a>/i)
    || matchOne(html, /Режиссёр[^:]*:\s*<a[^>]*>([^<]+)<\/a>/i)
    || matchOne(html, /<td>[\s]*Режисс[её]р[\s]*<\/td>[\s]*<td[^>]*>[\s]*<a[^>]*>([^<]+)<\/a>/i)
    || null;

  // Actors: listed in a cast section
  const actorsList = [...html.matchAll(/<div\b[^>]*class="[^"]*actors[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
  const actorsHtml = actorsList.length > 0 ? actorsList[0][1] : "";
  const actors = actorsHtml
    ? [...actorsHtml.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m => m[1].trim()).filter(Boolean)
    : [];

  return {
    filmId,
    title: stripTags(title),
    year,
    rating,
    description: description ? stripTags(description) : null,
    genres: [...new Set(genres)],
    director: director ? stripTags(director) : null,
    actors: actors.slice(0, 10) // limit to top 10 actors
  };
}

/**
 * Parse Kinopoisk search results page.
 * @param {string} html
 * @param {string} query
 * @returns {{ query: string, results: Array<{ filmId: string, title: string, year: string | null, rating: string | null, url: string }> }}
 */
function parseSearchResults(html, query) {
  const results = [];

  // Kinopoisk search results typically have film cards with links
  // Pattern: find film result blocks
  const resultPattern = /<a[^>]*href="\/film\/(\d+)\/?"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = resultPattern.exec(html)) !== null) {
    const filmId = match[1];
    const linkContent = match[2];

    // Extract title from the link content or surrounding context
    const titleMatch = linkContent.match(/<span[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/span>/i)
      || linkContent.match(/>([^<]{3,})</i);
    const title = titleMatch ? stripTags(titleMatch[1]) : `Фильм #${filmId}`;

    // Try to find year near the result
    const yearMatch = linkContent.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : null;

    // Try to find rating
    const ratingMatch = linkContent.match(/class="[^"]*rating[^"]*"[^>]*>([\d.]+)/i);
    const rating = ratingMatch ? ratingMatch[1] : null;

    results.push({
      filmId,
      title,
      year,
      rating,
      url: `https://www.kinopoisk.ru/film/${filmId}/`
    });
  }

  // Deduplicate by filmId
  const seen = new Set();
  const uniqueResults = results.filter(r => {
    if (seen.has(r.filmId)) return false;
    seen.add(r.filmId);
    return true;
  });

  return {
    query,
    results: uniqueResults.slice(0, 10) // limit to top 10 results
  };
}

module.exports = {
  decodeHtmlEntities,
  matchOne,
  parseFilmPage,
  parseSearchResults,
  stripTags,
  toNumberOrNull
};

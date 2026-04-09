const RUSSIAN_MONTHS = {
  января: "01",
  февраля: "02",
  марта: "03",
  апреля: "04",
  мая: "05",
  июня: "06",
  июля: "07",
  августа: "08",
  сентября: "09",
  октября: "10",
  ноября: "11",
  декабря: "12"
};

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
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function cleanText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = decodeHtmlEntities(String(value))
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return normalized || null;
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function stripHtml(value) {
  if (!value) {
    return null;
  }

  return cleanText(
    String(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<\/(ul|ol|article|div)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  );
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeRegionHost(value) {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.mchs\.gov\.ru$/, "");

  if (!/^[a-z0-9-]+$/.test(normalized)) {
    throw new Error("regionHost must be an MChS region host like '46', '78', or 'moscow'.");
  }

  return normalized;
}

/**
 * @param {string | null} value
 * @param {string} origin
 * @returns {string | null}
 */
function toAbsoluteUrl(value, origin) {
  if (!value) {
    return null;
  }

  return new URL(value, origin).toString();
}

/**
 * @param {string | null} value
 * @returns {string | null}
 */
function extractWarningId(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/\/(\d+)(?:[/?#]|$)/);
  return match ? match[1] : null;
}

/**
 * @param {string | null} value
 * @returns {string | null}
 */
function normalizeRussianDateTime(value) {
  if (!value) {
    return null;
  }

  const cleaned = cleanText(value);

  if (!cleaned) {
    return null;
  }

  const textualMatch = cleaned.match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4}),\s*(\d{2}):(\d{2})$/i);

  if (textualMatch) {
    const [, dayRaw, monthRaw, year, hour, minute] = textualMatch;
    const month = RUSSIAN_MONTHS[monthRaw.toLowerCase()];

    if (month) {
      const day = dayRaw.padStart(2, "0");
      return `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
  }

  const isoLikeMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);

  if (isoLikeMatch) {
    const [, year, month, day, hour, minute] = isoLikeMatch;
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  }

  return null;
}

/**
 * @param {string} html
 * @returns {string | null}
 */
function extractRegionName(html) {
  const titleMatch = html.match(/Главное управление МЧС России по ([^<]+?)(?:<\/title>|")/i);
  return titleMatch ? cleanText(titleMatch[1]) : null;
}

/**
 * @param {string} html
 * @param {RegExp} pattern
 * @returns {string | null}
 */
function matchOne(html, pattern) {
  const match = html.match(pattern);
  return match ? stripHtml(match[1]) : null;
}

/**
 * @param {string} html
 * @param {string} origin
 * @param {string} sourceUrl
 * @param {string} regionHost
 * @returns {{ regionHost: string, regionName: string | null, sectionTitle: string | null, sourceUrl: string, items: Array<object> }}
 */
function parseStormWarningsIndex(html, origin, sourceUrl, regionHost) {
  const items = [];
  const pattern = /<div class="articles-item">[\s\S]*?<a class="articles-item__title" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<span class="articles-item__tag">([\s\S]*?)<\/span>[\s\S]*?<span class="articles-item__date">([\s\S]*?)<\/span>/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const relativeUrl = cleanText(match[1]);
    const title = stripHtml(match[2]);
    const tag = stripHtml(match[3]);
    const publishedAt = cleanText(match[4]);

    items.push({
      warningId: extractWarningId(relativeUrl),
      title,
      tag,
      publishedAt,
      publishedAtIso: normalizeRussianDateTime(publishedAt),
      url: toAbsoluteUrl(relativeUrl, origin)
    });
  }

  return {
    regionHost,
    regionName: extractRegionName(html),
    sectionTitle: matchOne(html, /<h1[^>]*class="section__title"[^>]*>([\s\S]*?)<\/h1>/i),
    sourceUrl,
    items
  };
}

/**
 * @param {string} html
 * @param {string} sourceUrl
 * @param {string} regionHost
 * @returns {object}
 */
function parseStormWarningPage(html, sourceUrl, regionHost) {
  const publishedMeta = cleanText(
    html.match(/<meta itemprop="datePublished"[^>]*content="([^"]+)"/i)?.[1]
    || html.match(/<meta itemprop="datePublished"[^>]*datetime="([^"]+)"/i)?.[1]
  );
  const publishedAt = matchOne(html, /<div class="public__status-item">([\s\S]*?)<\/div>/i);
  const imageUrl = cleanText(html.match(/<img class="public__image-img"[^>]*src="([^"]+)"/i)?.[1]);
  const exportBlocks = [...html.matchAll(/<a class="print-options__item" href="([^"]+)" target="_blank">([\s\S]*?)<\/a>/gi)];
  const pdfUrl = cleanText(exportBlocks.find(([, , block]) => /Скачать PDF/i.test(block))?.[1]);
  const wordUrl = cleanText(exportBlocks.find(([, , block]) => /Скачать Word/i.test(block))?.[1]);

  return {
    warningId: extractWarningId(sourceUrl),
    regionHost,
    regionName: extractRegionName(html),
    title: matchOne(html, /<h1 itemprop="headline name">([\s\S]*?)<\/h1>/i),
    publishedAt,
    publishedAtIso: normalizeRussianDateTime(publishedMeta || publishedAt),
    sectionTitle: matchOne(
      html,
      /<a itemprop="item" href="\/deyatelnost\/press-centr\/operativnaya-informaciya\/shtormovye-i-ekstrennye-preduprezhdeniya"><span itemprop="name">([\s\S]*?)<\/span><\/a>/i
    ),
    bodyText: matchOne(html, /<article itemprop="articleBody">([\s\S]*?)<\/article>/i),
    imageUrl,
    pdfUrl: toAbsoluteUrl(pdfUrl, sourceUrl),
    wordUrl: toAbsoluteUrl(wordUrl, sourceUrl),
    sourceUrl
  };
}

module.exports = {
  cleanText,
  decodeHtmlEntities,
  normalizeRegionHost,
  normalizeRussianDateTime,
  parseStormWarningPage,
  parseStormWarningsIndex,
  stripHtml
};

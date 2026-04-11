/**
 * HTML parsing utilities for Yandex Market search and product pages.
 */

function decodeHtmlEntities(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function stripTags(value) {
  return decodeHtmlEntities(
    String(value)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\u2009/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function matchOne(value, pattern) {
  const match = value.match(pattern);
  return match ? match[1] : null;
}

function parsePrice(value) {
  if (!value) {
    return null;
  }

  const digits = stripTags(value).replace(/[^\d]/g, "");
  if (!digits) {
    return null;
  }

  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : null;
}

function normalizeProductUrl(url) {
  if (!url) {
    return null;
  }

  const decoded = decodeHtmlEntities(url).trim();
  const absolute = decoded.startsWith("http")
    ? decoded
    : `https://market.yandex.ru${decoded}`;
  const parsed = new URL(absolute);
  return `https://market.yandex.ru${parsed.pathname}`;
}

function extractReviewCount(block) {
  const hiddenBasedOn = matchOne(
    block,
    /<span class="ds-visuallyHidden">на основе\s*([^<]+?)\s*оценок<\/span>/i
  );
  if (hiddenBasedOn) {
    return stripTags(hiddenBasedOn);
  }

  const hiddenScore = matchOne(
    block,
    /<span class="ds-visuallyHidden">Оценок:\s*\(?([^<]+?)\)?(?: · [^<]+)?<\/span>/i
  );
  if (hiddenScore) {
    return stripTags(hiddenScore).split("·")[0].replace(/[()]/g, "").trim();
  }

  const visible = matchOne(
    block,
    /data-auto="reviews"[\s\S]*?<span aria-hidden="true"[^>]*>\s*([^<]+?)\s*оценок<\/span>/i
  );
  return visible ? stripTags(visible) : null;
}

function extractInlineSpecs(block) {
  const specs = [];
  const specMatches = block.matchAll(
    /<div class="_2Ce4O">[\s\S]*?<span[^>]*>(.*?)<\/span>[\s\S]*?<span[^>]*>(.*?)<\/span>[\s\S]*?<\/div>/gi
  );

  for (const match of specMatches) {
    const name = stripTags(match[1]).replace(/\s*:\s*$/, "").trim();
    const value = stripTags(match[2]);
    if (!name || !value) {
      continue;
    }
    specs.push({ name, value });
  }

  return specs;
}

function extractSpecPairs(block) {
  const specs = [];
  const rowMatches = block.matchAll(
    /<div class="_3rW2x[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi
  );

  for (const rowMatch of rowMatches) {
    const row = rowMatch[0];
    const name = stripTags(
      matchOne(row, /<span data-auto="product-spec"[^>]*>([\s\S]*?)<\/span>/i) ||
        ""
    );
    const valueBlock =
      matchOne(
        row,
        /<div class="eXP5k">[\s\S]*?<div class="b2ZT4">([\s\S]*?)<\/div>\s*<\/div>/i
      ) || "";
    const value = stripTags(valueBlock);

    if (!name || !value) {
      continue;
    }

    specs.push({ name, value });
  }

  return specs;
}

function uniqueSpecs(specs) {
  const seen = new Set();
  return specs.filter((spec) => {
    const key = `${spec.name}::${spec.value}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function parseSearchResults(html, query) {
  const results = [];
  const articles = html.match(/<article[^>]*data-auto="searchOrganic"[\s\S]*?<\/article>/gi) || [];

  for (const article of articles) {
    const rawUrl =
      matchOne(article, /<a[^>]*href="([^"]+)"[^>]*data-auto="snippet-link"/i) ||
      matchOne(article, /data-auto="snippet-link"[^>]*href="([^"]+)"/i) ||
      matchOne(article, /<a[^>]*href="([^"]+)"[^>]*data-auto="galleryLink"/i) ||
      matchOne(article, /data-auto="galleryLink"[^>]*href="([^"]+)"/i);
    const url = normalizeProductUrl(rawUrl);
    const title =
      stripTags(
        matchOne(article, /data-auto="snippet-title"[^>]*title="([^"]+)"/i) ||
          matchOne(article, /data-auto="snippet-title"[^>]*>([\s\S]*?)<\/span>/i) ||
          ""
      ) || null;

    if (!url || !title) {
      continue;
    }

    const productId = matchOne(url, /\/(\d+)(?:\/)?$/);
    const imageUrl = decodeHtmlEntities(
      matchOne(article, /<img[^>]*src="([^"]+)"[^>]*alt="/i) || ""
    ) || null;
    const price =
      parsePrice(
        matchOne(article, /<span class="ds-visuallyHidden">Цена[^<]*?([\d\s\u2009]+)\s*₽/i)
      ) ||
      parsePrice(
        matchOne(
          article,
          /data-auto="snippet-price-current"[\s\S]*?<span[^>]*>([\d\s\u2009]+)<\/span>[\s\S]*?₽/i
        )
      );
    const rating = stripTags(
      matchOne(article, /<span class="ds-visuallyHidden">Рейтинг товара:\s*([^<]+?)\s*из 5<\/span>/i) ||
        ""
    ) || null;
    const reviewCount = extractReviewCount(article);
    const specs = extractInlineSpecs(article).slice(0, 5);

    results.push({
      productId,
      title,
      price: price !== null ? { amount: price, currency: "RUB" } : null,
      rating,
      reviewCount,
      url,
      imageUrl,
      specs,
    });
  }

  return {
    query,
    source: "market.yandex.ru",
    results,
  };
}

function parseProductPage(html, url) {
  const normalizedUrl = normalizeProductUrl(url);
  const productId = normalizedUrl ? matchOne(normalizedUrl, /\/(\d+)(?:\/)?$/) : null;
  const title =
    stripTags(
      matchOne(html, /<h1[^>]*data-auto="productCardTitle"[^>]*>([\s\S]*?)<\/h1>/i) ||
        matchOne(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
        ""
    ) || null;
  const brand =
    stripTags(
      matchOne(html, /data-auto="product-card-vendor"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i) ||
        ""
    ) || null;
  const price =
    parsePrice(matchOne(html, /<span class="ds-visuallyHidden">Цена\s*([\d\s\u2009]+)\s*₽<\/span>/i)) ||
    parsePrice(
      matchOne(
        html,
        /data-auto="snippet-price-current"[\s\S]*?<span[^>]*>([\d\s\u2009]+)<\/span>[\s\S]*?₽/i
      )
    );
  const rating =
    stripTags(
      matchOne(html, /<span class="ds-visuallyHidden">Рейтинг товара:\s*([^<]+?)\s*из 5<\/span>/i) ||
        ""
    ) || null;
  const reviewCount = extractReviewCount(html);
  const description =
    stripTags(
      matchOne(html, /<meta[^>]*name="description"[^>]*content="([^"]+)"/i) || ""
    ) || null;
  const specs = uniqueSpecs(extractSpecPairs(html)).slice(0, 12);

  return {
    productId,
    title,
    brand,
    price: price !== null ? { amount: price, currency: "RUB" } : null,
    rating,
    reviewCount,
    description,
    specs,
    source: "market.yandex.ru",
    url: normalizedUrl,
  };
}

module.exports = {
  decodeHtmlEntities,
  stripTags,
  matchOne,
  parsePrice,
  normalizeProductUrl,
  parseSearchResults,
  parseProductPage,
  extractInlineSpecs,
  extractSpecPairs,
};

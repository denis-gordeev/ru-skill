const BASE_URL = "https://publication.pravo.gov.ru/api";
const DEFAULT_HEADERS = {
  accept: "application/json",
  "user-agent": "ru-skill/pravo-documents"
};

/**
 * Normalize a document search result item.
 * @param {object} item - Raw API document item
 * @returns {object}
 */
function normalizeDocumentItem(item) {
  return {
    eoNumber: item.eoNumber || null,
    title: item.title || null,
    complexName: item.complexName || null,
    name: item.name || null,
    number: item.number || null,
    documentDate: item.documentDate || null,
    publishDate: item.publishDateShort || null,
    viewDate: item.viewDate || null,
    jdRegNumber: item.jdRegNumber || null,
    jdRegDate: item.jdRegDate || null,
    pagesCount: item.pagesCount || null,
    pdfFileLength: item.pdfFileLength || null,
    hasSvg: item.hasSvg || false,
    pdfUrl: item.eoNumber ? `https://publication.pravo.gov.ru/Document/${item.eoNumber}` : null
  };
}

/**
 * Normalize a full document card.
 * @param {object} doc - Raw API document
 * @returns {object}
 */
function normalizeDocumentCard(doc) {
  return {
    ...normalizeDocumentItem(doc),
    documentType: doc.documentType ? {
      id: doc.documentType.id,
      name: doc.documentType.name
    } : null,
    signatoryAuthority: doc.signatoryAuthorities && doc.signatoryAuthorities.length > 0
      ? doc.signatoryAuthorities.map(a => ({
          id: a.id,
          name: a.name,
          isMain: a.isMain || false
        }))
      : []
  };
}

/**
 * Build search URL with optional filters.
 * @param {{ name?: string, documentTypeId?: string, blockId?: string, categoryId?: string, signatoryAuthorityId?: string, dateFrom?: string, dateTo?: string, page?: number, pageSize?: number }} options
 * @returns {string}
 */
function buildSearchUrl(options = {}) {
  const url = new URL(`${BASE_URL}/Documents`);

  if (options.name) {
    url.searchParams.set("NameSearchType", "0");
    url.searchParams.set("Name", options.name);
  }

  if (options.documentTypeId) {
    url.searchParams.set("DocumentTypeId", options.documentTypeId);
  }

  if (options.blockId) {
    url.searchParams.set("BlockId", options.blockId);
  }

  if (options.categoryId) {
    url.searchParams.set("CategoryId", options.categoryId);
  }

  if (options.signatoryAuthorityId) {
    url.searchParams.set("SignatoryAuthorityId", options.signatoryAuthorityId);
  }

  if (options.dateFrom) {
    url.searchParams.set("DateFrom", options.dateFrom);
  }

  if (options.dateTo) {
    url.searchParams.set("DateTo", options.dateTo);
  }

  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("page must be an integer greater than or equal to 1.");
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("pageSize must be an integer between 1 and 100.");
  }

  url.searchParams.set("CurrentPage", String(page));
  url.searchParams.set("PageSize", String(pageSize));

  return url.toString();
}

/**
 * Build document card URL.
 * @param {string} eoNumber - Electronic publication number
 * @returns {string}
 */
function buildDocumentUrl(eoNumber) {
  if (!eoNumber || typeof eoNumber !== "string") {
    throw new Error("eoNumber must be a non-empty string.");
  }

  const url = new URL(`${BASE_URL}/Document`);
  url.searchParams.set("eoNumber", eoNumber);
  return url.toString();
}

/**
 * @param {string} url
 * @returns {Promise<object>}
 */
async function fetchJson(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Pravo.gov.ru request failed with ${response.status} for ${url}`);
  }

  return response.json();
}

module.exports = {
  BASE_URL,
  buildDocumentUrl,
  buildSearchUrl,
  fetchJson,
  normalizeDocumentCard,
  normalizeDocumentItem
};

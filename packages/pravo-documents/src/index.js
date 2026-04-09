const {
  buildDocumentUrl,
  buildSearchUrl,
  fetchJson,
  normalizeDocumentCard,
  normalizeDocumentItem,
  BASE_URL
} = require("./parse");

const DEFAULT_HEADERS = {
  accept: "application/json",
  "user-agent": "ru-skill/pravo-documents"
};

/**
 * Search for official Russian legal documents.
 * @param {{ name?: string, documentTypeId?: string, blockId?: string, categoryId?: string, signatoryAuthorityId?: string, dateFrom?: string, dateTo?: string, page?: number, pageSize?: number }} options
 * @returns {Promise<{ items: Array<object>, pagination: object }>}
 */
async function searchPravoDocuments(options = {}) {
  const url = buildSearchUrl(options);
  const data = await fetchJson(url);

  return {
    items: (data.items || []).map(normalizeDocumentItem),
    pagination: {
      itemsTotalCount: data.itemsTotalCount || 0,
      itemsPerPage: data.itemsPerPage || 0,
      pagesTotalCount: data.pagesTotalCount || 0,
      currentPage: data.currentPage || 1
    }
  };
}

/**
 * Get a specific legal document card by eoNumber.
 * @param {string} eoNumber - Electronic publication number
 * @returns {Promise<object>}
 */
async function getPravoDocument(eoNumber) {
  const url = buildDocumentUrl(eoNumber);
  const data = await fetchJson(url);

  return normalizeDocumentCard(data);
}

/**
 * List publication blocks (categories of documents).
 * @returns {Promise<Array<object>>}
 */
async function listPravoBlocks() {
  const url = `${BASE_URL}/PublicBlocks`;
  return fetchJson(url);
}

module.exports = {
  getPravoDocument,
  listPravoBlocks,
  searchPravoDocuments
};

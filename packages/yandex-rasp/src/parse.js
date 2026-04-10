/**
 * Helpers for normalizing Yandex Raspisanie API responses.
 * Most normalization happens in index.js; this module
 * provides reusable utilities for validation and formatting.
 */

/**
 * Validate a Yandex station code format (s + digits, or c + digits for cities).
 * @param {string} code
 * @returns {boolean}
 */
function isValidStationCode(code) {
  if (typeof code !== "string") return false;
  return /^[sc]\d+$/.test(code);
}

/**
 * Format a duration in seconds into a human-readable string.
 * @param {number} seconds
 * @returns {string}
 */
function formatDuration(seconds) {
  if (seconds == null || seconds < 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes} мин`;
  return `${hours} ч ${minutes} мин`;
}

/**
 * Extract unique transport types from a list of schedule entries or segments.
 * @param {Array<object>} entries
 * @returns {string[]}
 */
function extractTransportTypes(entries) {
  const types = new Set();
  for (const entry of entries) {
    const tt = entry.thread?.transportType || entry.transportType;
    if (tt) types.add(tt);
  }
  return Array.from(types);
}

/**
 * Group schedule entries by transport type.
 * @param {Array<object>} entries
 * @returns {Record<string, Array<object>>}
 */
function groupByTransportType(entries) {
  /** @type {Record<string, Array<object>>} */
  const groups = {};
  for (const entry of entries) {
    const tt = entry.thread?.transportType || "unknown";
    if (!groups[tt]) groups[tt] = [];
    groups[tt].push(entry);
  }
  return groups;
}

module.exports = {
  isValidStationCode,
  formatDuration,
  extractTransportTypes,
  groupByTransportType,
};

/**
 * Утилиты нормализации ответов API Яндекс Расписаний.
 * Основная нормализация происходит в index.js; этот модуль
 * предоставляет переиспользуемые утилиты для валидации и форматирования.
 */

/**
 * Проверить формат кода станции Яндекс (s + цифры, или c + цифры для городов).
 * @param {string} code
 * @returns {boolean}
 */
function isValidStationCode(code) {
  if (typeof code !== "string") return false;
  return /^[sc]\d+$/.test(code);
}

/**
 * Форматировать длительность в секундах в читаемую строку.
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
 * Извлечь уникальные типы транспорта из списка записей расписания или сегментов.
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
 * Сгруппировать записи расписания по типу транспорта.
 * @param {Array<object>} entries
 * @returns {Record<string, Array<object>>}
 */
function groupByTransportType(entries) {
  /** @type {Record<string, Array<object>>} */
  const groups = {};
  for (const entry of entries) {
    const tt = entry.thread?.transportType || "неизвестно";
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

const BASE_URL = "https://api.rasp.yandex-net.ru/v3.0";

/**
 * Поиск станций по названию.
 * Загружает полный справочник станций и фильтрует на стороне клиента по совпадению названия.
 *
 * @param {string} query - Подстрока названия станции для поиска (без учёта регистра).
 * @param {object} [opts]
 * @param {string} [opts.apiKey] - Ключ программного интерфейса Яндекс Расписаний. Запасной вариант: переменная окружения YANDEX_RASP_API_KEY.
 * @param {string} [opts.lang] - Язык ответа (по умолчанию: ru_RU).
 * @returns {Promise<Array<{title: string, yandexCode: string, esrCode: string|null, stationType: string, transportType: string, latitude: number, longitude: number, direction: string}>>}
 */
async function searchStations(query, opts = {}) {
  const apiKey = resolveApiKey(opts.apiKey);
  const lang = opts.lang || "ru_RU";

  const url = `${BASE_URL}/stations_list/?apikey=${encodeURIComponent(apiKey)}&lang=${encodeURIComponent(lang)}&format=json`;
  const res = await fetchWithCheck(url);
  const data = await res.json();

  const stations = flattenStations(data);
  const lowerQuery = query.toLowerCase();

  return stations
    .filter((s) => s.title.toLowerCase().includes(lowerQuery))
    .map((s) => ({
      title: s.title,
      yandexCode: s.codes.yandex_code,
      esrCode: s.codes.esr_code || null,
      stationType: s.station_type,
      transportType: s.transport_type,
      latitude: s.latitude,
      longitude: s.longitude,
      direction: s.direction || "",
    }));
}

/**
 * Получить расписание для одной станции.
 *
 * @param {string} stationCode - Код станции Яндекс (например s9600213).
 * @param {object} [opts]
 * @param {string} [opts.apiKey] - Ключ программного интерфейса Яндекс Расписаний.
 * @param {string} [opts.date] - Целевая дата в ISO 8601 (YYYY-MM-DD). Опустить для всех дат.
 * @param {string} [opts.event] - "departure" (по умолчанию) или "arrival".
 * @param {string} [opts.transportType] - Фильтр: plane, train, suburban, bus, water, helicopter.
 * @param {string} [opts.direction] - Подсказка направления для электричек (например "на Москву"). Только для suburban.
 * @param {string} [opts.lang] - Язык ответа (по умолчанию: ru_RU).
 * @returns {Promise<{station: {code: string, title: string, stationType: string}, date: string|null, schedule: Array<object>, pagination: {total: number, limit: number, offset: number}}>}
 */
async function getStationSchedule(stationCode, opts = {}) {
  const apiKey = resolveApiKey(opts.apiKey);
  const lang = opts.lang || "ru_RU";

  const params = new URLSearchParams({
    apikey: apiKey,
    station: stationCode,
    lang,
    format: "json",
  });

  if (opts.date) params.set("date", opts.date);
  if (opts.event) params.set("event", opts.event);
  if (opts.transportType) params.set("transport_types", opts.transportType);
  if (opts.direction && opts.transportType === "suburban") params.set("direction", opts.direction);

  const url = `${BASE_URL}/schedule/?${params.toString()}`;
  const res = await fetchWithCheck(url);
  const data = await res.json();

  return {
    station: {
      code: data.station?.code || stationCode,
      title: data.station?.title || "",
      stationType: data.station?.station_type || "",
    },
    date: data.date || null,
    schedule: (data.schedule || []).map(normalizeScheduleEntry),
    pagination: data.pagination || { total: 0, limit: 100, offset: 0 },
  };
}

/**
 * Поиск поездок между двумя станциями или городами.
 *
 * @param {string} fromCode - Код станции/города отправления (например c146 или s9600213).
 * @param {string} toCode - Код станции/города прибытия.
 * @param {object} [opts]
 * @param {string} [opts.apiKey] - Ключ программного интерфейса Яндекс Расписаний.
 * @param {string} [opts.date] - Целевая дата в ISO 8601 (YYYY-MM-DD).
 * @param {string} [opts.transportType] - Фильтр: plane, train, suburban, bus, water, helicopter.
 * @param {boolean} [opts.transfers] - Включить маршруты с пересадками (по умолчанию: false).
 * @param {number} [opts.offset] - Смещение для постраничной навигации (по умолчанию: 0).
 * @param {number} [opts.limit] - Максимальное количество результатов (по умолчанию/максимум: 100).
 * @param {string} [opts.lang] - Язык ответа (по умолчанию: ru_RU).
 * @returns {Promise<{search: object, segments: Array<object>, intervalSegments: Array<object>, pagination: {total: number, limit: number, offset: number}}>}
 */
async function searchTrips(fromCode, toCode, opts = {}) {
  const apiKey = resolveApiKey(opts.apiKey);
  const lang = opts.lang || "ru_RU";

  const params = new URLSearchParams({
    apikey: apiKey,
    from: fromCode,
    to: toCode,
    lang,
    format: "json",
  });

  if (opts.date) params.set("date", opts.date);
  if (opts.transportType) params.set("transport_types", opts.transportType);
  if (opts.transfers !== undefined) params.set("transfers", String(opts.transfers));
  if (opts.offset !== undefined) params.set("offset", String(opts.offset));
  if (opts.limit !== undefined) params.set("limit", String(Math.min(opts.limit, 100)));

  const url = `${BASE_URL}/search/?${params.toString()}`;
  const res = await fetchWithCheck(url);
  const data = await res.json();

  return {
    search: data.search || { from: { code: fromCode }, to: { code: toCode } },
    segments: (data.segments || []).map(normalizeSegment),
    intervalSegments: (data.interval_segments || []).map(normalizeSegment),
    pagination: data.pagination || { total: 0, limit: 100, offset: 0 },
  };
}

// --- внутренние помощники ---

function resolveApiKey(provided) {
  if (provided) return provided;
  const fromEnv = process.env.YANDEX_RASP_API_KEY;
  if (fromEnv) return fromEnv;
  throw new Error(
    "Требуется ключ программного интерфейса Яндекс Расписаний. Укажите его через opts.apiKey (ключ) или переменную окружения YANDEX_RASP_API_KEY. Получить ключ: https://yandex.ru/dev/rasp/"
  );
}

async function fetchWithCheck(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {
      /* пропустить */
    }
    throw new Error(`Ошибка программного интерфейса Яндекс Расписаний ${res.status}: ${body || res.statusText}`);
  }
  return res;
}

function flattenStations(data) {
  const out = [];
  for (const country of data.countries || []) {
    for (const region of country.regions || []) {
      for (const settlement of region.settlements || []) {
        for (const station of settlement.stations || []) {
          out.push({
            title: station.title,
            codes: station.codes || {},
            station_type: station.station_type || "",
            transport_type: station.transport_type || "",
            latitude: station.latitude ?? 0,
            longitude: station.longitude ?? 0,
            direction: station.direction || "",
          });
        }
      }
    }
  }
  return out;
}

function normalizeScheduleEntry(entry) {
  return {
    arrival: entry.arrival || null,
    departure: entry.departure || null,
    thread: {
      uid: entry.thread?.uid || "",
      title: entry.thread?.title || "",
      number: entry.thread?.number || "",
      transportType: entry.thread?.transport_type || "",
      carrier: entry.thread?.carrier
        ? {
            code: entry.thread.carrier.code,
            title: entry.thread.carrier.title || "",
          }
        : null,
    },
    days: entry.days || "",
    stops: entry.stops || "",
    isFuzzy: entry.is_fuzzy || false,
    platform: entry.platform || "",
    terminal: entry.terminal || null,
  };
}

function normalizeSegment(seg) {
  return {
    from: seg.from
      ? {
          code: seg.from.code,
          title: seg.from.title || "",
          type: seg.from.type || "",
        }
      : null,
    to: seg.to
      ? {
          code: seg.to.code,
          title: seg.to.title || "",
          type: seg.to.type || "",
        }
      : null,
    thread: seg.thread
      ? {
          uid: seg.thread.uid || "",
          number: seg.thread.number || "",
          title: seg.thread.title || "",
          transportType: seg.thread.transport_type || "",
          carrier: seg.thread.carrier
            ? {
                code: seg.thread.carrier.code,
                title: seg.thread.carrier.title || "",
              }
            : null,
        }
      : null,
    departure: seg.departure || null,
    arrival: seg.arrival || null,
    duration: seg.duration ?? null,
    hasTransfers: seg.has_transfers || false,
    ticketsInfo: seg.tickets_info || null,
    startDate: seg.start_date || null,
  };
}

module.exports = {
  searchStations,
  getStationSchedule,
  searchTrips,
};

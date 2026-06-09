const STATION_SERVICE_URL = "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc";
const MEASUREMENT_SERVICE_URL = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc";
const GRADE_LABELS = {
  "1": "Хорошо",
  "2": "Умеренно",
  "3": "Плохо",
  "4": "Очень плохо"
};

function extractItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  const items = payload?.response?.body?.items;

  if (Array.isArray(items)) {
    return items;
  }

  if (items && typeof items === "object") {
    return [items];
  }

  return [];
}

function toFloat(raw) {
  if (raw === null || raw === undefined || raw === "" || raw === "-") {
    return null;
  }

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function pickStation(stationItems, { regionHint = null, stationName = null } = {}) {
  if (!stationItems.length) {
    throw new Error("Нет подходящих станций мониторинга.");
  }

  if (stationName) {
    const exactMatch = stationItems.find((item) => item.stationName === stationName);
    if (exactMatch) {
      return exactMatch;
    }

    const partialMatch = stationItems.find((item) =>
      String(item.stationName || "").includes(stationName) || String(item.addr || "").includes(stationName)
    );
    if (partialMatch) {
      return partialMatch;
    }
  }

  if (regionHint) {
    const tokens = [...new Set(String(regionHint).split(/\s+/u).filter(Boolean))].sort((left, right) => right.length - left.length);

    for (const token of tokens) {
      const stationNameMatch = stationItems.find((item) => String(item.stationName || "").includes(token));
      if (stationNameMatch) {
        return stationNameMatch;
      }

      const addressMatch = stationItems.find((item) => String(item.addr || "").includes(token));
      if (addressMatch) {
        return addressMatch;
      }
    }
  }

  return stationItems[0];
}

function resolveStation(stationItems, options = {}) {
  if (stationItems.length > 0) {
    return pickStation(stationItems, options);
  }

  if (options.stationName) {
    return {
      stationName: options.stationName,
      addr: null
    };
  }

  throw new Error("Нет подходящих станций мониторинга.");
}

function buildStationNameCandidates({ stationName = null, regionHint = null } = {}) {
  const candidates = [];

  if (stationName) {
    candidates.push(String(stationName).trim());
  }

  if (regionHint) {
    const tokens = [...new Set(
      String(regionHint)
        .split(/\s+/u)
        .map((token) => token.trim())
        .filter(Boolean)
        .sort((left, right) => right.length - left.length)
    )];
    candidates.push(...tokens);
  }

  return [...new Set(candidates.filter(Boolean))];
}

function buildRegionTokens(regionHint) {
  return [...new Set(
    String(regionHint || "")
      .split(/\s+/u)
      .map((token) => token.trim())
      .filter(Boolean)
  )];
}

function findMeasurement(measurementItems, stationName) {
  const exactMatch = measurementItems.find((item) => item.stationName === stationName);
  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = measurementItems.find((item) => String(item.stationName || "").includes(stationName));
  if (partialMatch) {
    return partialMatch;
  }

  throw new Error(`Станция мониторинга '${stationName}' не найдена в ответе с измерениями.`);
}

function gradeToLabel(rawGrade, { pollutant, value }) {
  const rawText = rawGrade === null || rawGrade === undefined ? "" : String(rawGrade);
  if (Object.prototype.hasOwnProperty.call(GRADE_LABELS, rawText)) {
    return GRADE_LABELS[rawText];
  }

  const numericValue = toFloat(value);
  if (numericValue === null) {
    return "Нет данных";
  }

  const thresholds = pollutant === "pm10"
    ? [[30, "Хорошо"], [80, "Умеренно"], [150, "Плохо"]]
    : [[15, "Хорошо"], [35, "Умеренно"], [75, "Плохо"]];

  for (const [threshold, label] of thresholds) {
    if (numericValue <= threshold) {
      return label;
    }
  }

  return "Очень плохо";
}

function buildReport({ stationItems, measurementItems, regionHint = null, stationName = null, lookupMode = null, selectedStation = null }) {
  const station = selectedStation || resolveStation(stationItems, {
    regionHint,
    stationName
  });
  const measurement = findMeasurement(measurementItems, station.stationName);
  const resolvedLookupMode = lookupMode || "запасной вариант";

  return {
    station_name: station.stationName,
    station_address: station.addr ?? null,
    lookup_mode: resolvedLookupMode,
    measured_at: measurement.dataTime ?? null,
    pm10: {
      value: String(measurement.pm10Value ?? "-"),
      grade: gradeToLabel(measurement.pm10Grade, {
        pollutant: "pm10",
        value: measurement.pm10Value
      })
    },
    pm25: {
      value: String(measurement.pm25Value ?? "-"),
      grade: gradeToLabel(measurement.pm25Grade, {
        pollutant: "pm25",
        value: measurement.pm25Value
      })
    },
    khai_grade: measurement.khaiGrade === null || measurement.khaiGrade === undefined || measurement.khaiGrade === ""
      ? "Нет данных"
      : gradeToLabel(measurement.khaiGrade, {
        pollutant: "pm10",
        value: measurement.pm10Value
      })
  };
}

async function fetchJson(baseUrl, params, { fetchImpl = global.fetch, headers = {} } = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("Требуется реализация fetch.");
  }

  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  url.search = searchParams.toString();
  const response = await fetchImpl(url, {
    headers,
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    if (response.status === 403) {
      throw new Error(
        "AirKorea вернул 403 Forbidden. Возможные причины: ожидание синхронизации после регистрации приложения (1–2 часа), вызов незарегистрированного API, ошибка кодировки/значения сервисного ключа, незарегистрированный домен или IP.",
      );
    }

    throw new Error(`Запрос к AirKorea не удался с кодом ${response.status} для ${url}${body ? ` :: ${body.slice(0, 200)}` : ""}`);
  }

  return JSON.parse(await response.text());
}

async function fetchStationLookup({ regionHint = null, stationName = null, serviceKey, fetchImpl = global.fetch, headers = {}, stationServiceUrl = STATION_SERVICE_URL }) {
  if (!serviceKey) {
    throw new Error("AIR_KOREA_OPEN_API_KEY не настроен на прокси-сервере.");
  }

  const common = {
    serviceKey,
    returnType: "json",
    numOfRows: 50,
    pageNo: 1
  };

  if (regionHint || stationName) {
    return {
      lookupMode: "запасной вариант",
      payload: await fetchJson(`${stationServiceUrl}/getMsrstnList`, {
        ...common,
        addr: regionHint,
        stationName
      }, {
        fetchImpl,
        headers
      })
    };
  }

  throw new Error("Необходимо указать regionHint или stationName.");
}

async function fetchMeasurementPayload({ stationName, serviceKey, fetchImpl = global.fetch, headers = {}, measurementServiceUrl = MEASUREMENT_SERVICE_URL }) {
  if (!serviceKey) {
    throw new Error("AIR_KOREA_OPEN_API_KEY не настроен на прокси-сервере.");
  }

  return fetchJson(`${measurementServiceUrl}/getMsrstnAcctoRltmMesureDnsty`, {
    serviceKey,
    returnType: "json",
    numOfRows: 100,
    pageNo: 1,
    stationName,
    dataTerm: "DAILY",
    ver: "1.4"
  }, {
    fetchImpl,
    headers
  });
}

async function fetchCtprvnMeasurementPayload({ sidoName, serviceKey, fetchImpl = global.fetch, headers = {}, measurementServiceUrl = MEASUREMENT_SERVICE_URL }) {
  if (!serviceKey) {
    throw new Error("AIR_KOREA_OPEN_API_KEY не настроен на прокси-сервере.");
  }

  return fetchJson(`${measurementServiceUrl}/getCtprvnRltmMesureDnsty`, {
    serviceKey,
    returnType: "json",
    numOfRows: 100,
    pageNo: 1,
    sidoName,
    ver: "1.4"
  }, {
    fetchImpl,
    headers
  });
}

async function fetchFineDustReport({ regionHint = null, stationName = null, serviceKey, fetchImpl = global.fetch, headers = {}, stationServiceUrl = STATION_SERVICE_URL, measurementServiceUrl = MEASUREMENT_SERVICE_URL }) {
  let stationLookup;
  let stationItems;
  let station;

  try {
    stationLookup = await fetchStationLookup({
      regionHint,
      stationName,
      serviceKey,
      fetchImpl,
      headers,
      stationServiceUrl
    });
    stationItems = extractItems(stationLookup.payload);
    station = resolveStation(stationItems, {
      regionHint,
      stationName
    });
  } catch (error) {
    const candidates = buildStationNameCandidates({ stationName, regionHint });
    const canTryMeasurementOnlyFallback =
      String(error?.message || "").includes("403 Forbidden") &&
      candidates.length > 0;

    if (!canTryMeasurementOnlyFallback) {
      throw error;
    }

    for (const candidate of candidates) {
      const measurementPayload = await fetchMeasurementPayload({
        stationName: candidate,
        serviceKey,
        fetchImpl,
        headers,
        measurementServiceUrl
      });
      const measurementItems = extractItems(measurementPayload);

      try {
        const matchedMeasurement = findMeasurement(measurementItems, candidate);
        return buildReport({
          stationItems: [{ stationName: matchedMeasurement.stationName, addr: null }],
          measurementItems,
          regionHint,
          stationName: matchedMeasurement.stationName,
          lookupMode: "запасной вариант",
          selectedStation: { stationName: matchedMeasurement.stationName, addr: null }
        });
      } catch {
        // попробовать следующего кандидата
      }
    }

    const regionTokens = buildRegionTokens(regionHint);
    const sidoName = regionTokens[0];
    if (sidoName) {
      const ctprvnPayload = await fetchCtprvnMeasurementPayload({
        sidoName,
        serviceKey,
        fetchImpl,
        headers,
        measurementServiceUrl
      });
      const cityItems = extractItems(ctprvnPayload);
      const specificTokens = regionTokens.length > 1 ? regionTokens.slice(1) : regionTokens;
      const tokenMatches = cityItems.filter((item) =>
        specificTokens.some((token) => String(item.stationName || "").includes(token))
      );

      if (tokenMatches.length > 0) {
        const selectedStation = tokenMatches[0];
        return buildReport({
          stationItems: [{ stationName: selectedStation.stationName, addr: null }],
          measurementItems: cityItems,
          regionHint,
          stationName: selectedStation.stationName,
          lookupMode: "запасной вариант",
          selectedStation: { stationName: selectedStation.stationName, addr: null }
        });
      }

      const stationSamples = cityItems
        .slice(0, 8)
        .map((item) => item.stationName)
        .filter(Boolean);
      const lookupError = new Error(
        `Для '${regionHint}' не удалось однозначно определить станцию мониторинга. Повторите запрос с точным названием станции из списка ниже.`,
      );
      lookupError.statusCode = 400;
      lookupError.code = "ambiguous_location";
      lookupError.sidoName = sidoName;
      lookupError.candidateStations = stationSamples;
      throw lookupError;
    }

    throw error;
  }

  const measurementPayload = await fetchMeasurementPayload({
    stationName: station.stationName,
    serviceKey,
    fetchImpl,
    headers,
    measurementServiceUrl
  });

  return buildReport({
    stationItems,
    measurementItems: extractItems(measurementPayload),
    regionHint,
    stationName: station.stationName,
    lookupMode: stationLookup.lookupMode,
    selectedStation: station
  });
}

module.exports = {
  GRADE_LABELS,
  STATION_SERVICE_URL,
  MEASUREMENT_SERVICE_URL,
  buildReport,
  extractItems,
  fetchFineDustReport,
  fetchCtprvnMeasurementPayload,
  fetchMeasurementPayload,
  fetchStationLookup,
  findMeasurement,
  gradeToLabel,
  pickStation,
  resolveStation,
  toFloat
};

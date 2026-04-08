/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
function cleanText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || null;
}

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
function stripHtml(value) {
  if (!value) {
    return null;
  }

  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<\/(ul|ol)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s+([,.:;!?])/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() || null;
}

/**
 * @param {any} area
 * @returns {object | null}
 */
function normalizeArea(area) {
  if (!area) {
    return null;
  }

  return {
    areaId: cleanText(area.id),
    parentAreaId: cleanText(area.parent_id),
    name: cleanText(area.name),
    utcOffset: cleanText(area.utc_offset),
    latitude: typeof area.lat === "number" ? area.lat : null,
    longitude: typeof area.lng === "number" ? area.lng : null
  };
}

/**
 * @param {any} employer
 * @returns {object | null}
 */
function normalizeEmployer(employer) {
  if (!employer) {
    return null;
  }

  return {
    employerId: cleanText(employer.id),
    name: cleanText(employer.name),
    trusted: Boolean(employer.trusted),
    accreditedItEmployer: Boolean(employer.accredited_it_employer),
    employerUrl: cleanText(employer.alternate_url)
  };
}

/**
 * @param {any} salary
 * @param {any} salaryRange
 * @returns {object | null}
 */
function normalizeSalary(salary, salaryRange) {
  if (!salary && !salaryRange) {
    return null;
  }

  return {
    from: salary?.from ?? salaryRange?.from ?? null,
    to: salary?.to ?? salaryRange?.to ?? null,
    currency: cleanText(salary?.currency ?? salaryRange?.currency),
    gross: salary?.gross ?? salaryRange?.gross ?? null,
    period: cleanText(salaryRange?.mode?.name),
    payoutFrequency: cleanText(salaryRange?.frequency?.name)
  };
}

/**
 * @param {any} snippet
 * @returns {object | null}
 */
function normalizeSnippet(snippet) {
  if (!snippet) {
    return null;
  }

  return {
    requirement: cleanText(snippet.requirement),
    responsibility: cleanText(snippet.responsibility)
  };
}

/**
 * @param {any} item
 */
function normalizeVacancyCard(item) {
  return {
    vacancyId: cleanText(item.id),
    title: cleanText(item.name),
    area: normalizeArea(item.area),
    salary: normalizeSalary(item.salary, item.salary_range),
    publishedAt: cleanText(item.published_at),
    vacancyUrl: cleanText(item.alternate_url),
    employer: normalizeEmployer(item.employer),
    snippet: normalizeSnippet(item.snippet),
    schedule: cleanText(item.schedule?.name),
    experience: cleanText(item.experience?.name),
    employment: cleanText(item.employment?.name),
    workFormats: Array.isArray(item.work_format) ? item.work_format.map((entry) => cleanText(entry.name)).filter(Boolean) : [],
    professionalRoles: Array.isArray(item.professional_roles)
      ? item.professional_roles.map((entry) => cleanText(entry.name)).filter(Boolean)
      : []
  };
}

/**
 * @param {any} payload
 */
function parseVacancySearchResponse(payload) {
  if (!Array.isArray(payload?.items)) {
    throw new Error("HH vacancies payload did not contain an items array.");
  }

  return {
    found: payload.found ?? 0,
    pages: payload.pages ?? 0,
    page: payload.page ?? 0,
    perPage: payload.per_page ?? payload.perPage ?? 0,
    searchUrl: cleanText(payload.alternate_url),
    items: payload.items.map(normalizeVacancyCard)
  };
}

/**
 * @param {any} address
 * @returns {object | null}
 */
function normalizeAddress(address) {
  if (!address) {
    return null;
  }

  return {
    raw: cleanText(address.raw),
    city: cleanText(address.city),
    street: cleanText(address.street),
    building: cleanText(address.building),
    latitude: typeof address.lat === "number" ? address.lat : null,
    longitude: typeof address.lng === "number" ? address.lng : null,
    nearestMetro: address.metro
      ? {
          stationName: cleanText(address.metro.station_name),
          lineName: cleanText(address.metro.line_name)
        }
      : null,
    metroStations: Array.isArray(address.metro_stations)
      ? address.metro_stations.map((entry) => ({
          stationName: cleanText(entry.station_name),
          lineName: cleanText(entry.line_name)
        })).filter((entry) => entry.stationName)
      : []
  };
}

/**
 * @param {any} payload
 */
function parseVacancyResponse(payload) {
  if (!payload?.id) {
    throw new Error("HH vacancy payload did not contain vacancy id.");
  }

  return {
    vacancyId: cleanText(payload.id),
    title: cleanText(payload.name),
    area: normalizeArea(payload.area),
    salary: normalizeSalary(payload.salary, payload.salary_range),
    address: normalizeAddress(payload.address),
    experience: cleanText(payload.experience?.name),
    schedule: cleanText(payload.schedule?.name),
    employment: cleanText(payload.employment?.name),
    employmentForm: cleanText(payload.employment_form?.name),
    descriptionText: stripHtml(payload.description),
    keySkills: Array.isArray(payload.key_skills) ? payload.key_skills.map((entry) => cleanText(entry.name)).filter(Boolean) : [],
    employer: normalizeEmployer(payload.employer),
    publishedAt: cleanText(payload.published_at),
    vacancyUrl: cleanText(payload.alternate_url),
    professionalRoles: Array.isArray(payload.professional_roles)
      ? payload.professional_roles.map((entry) => cleanText(entry.name)).filter(Boolean)
      : [],
    workFormats: Array.isArray(payload.work_format) ? payload.work_format.map((entry) => cleanText(entry.name)).filter(Boolean) : [],
    workingHours: Array.isArray(payload.working_hours)
      ? payload.working_hours.map((entry) => cleanText(entry.name)).filter(Boolean)
      : [],
    workScheduleByDays: Array.isArray(payload.work_schedule_by_days)
      ? payload.work_schedule_by_days.map((entry) => cleanText(entry.name)).filter(Boolean)
      : []
  };
}

/**
 * @param {any} payload
 */
function parseAreaResponse(payload) {
  if (!payload?.id) {
    throw new Error("HH area payload did not contain area id.");
  }

  return {
    areaId: cleanText(payload.id),
    parentAreaId: cleanText(payload.parent_id),
    name: cleanText(payload.name),
    utcOffset: cleanText(payload.utc_offset),
    latitude: typeof payload.lat === "number" ? payload.lat : null,
    longitude: typeof payload.lng === "number" ? payload.lng : null,
    children: Array.isArray(payload.areas)
      ? payload.areas.map((entry) => ({
          areaId: cleanText(entry.id),
          name: cleanText(entry.name)
        })).filter((entry) => entry.areaId)
      : []
  };
}

module.exports = {
  parseAreaResponse,
  parseVacancyResponse,
  parseVacancySearchResponse,
  stripHtml
};

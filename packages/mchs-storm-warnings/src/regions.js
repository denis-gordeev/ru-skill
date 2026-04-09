/**
 * Mapping of Russian region names to their MChS regional hosts.
 *
 * Sources:
 * - https://mchs.gov.ru/ministerstvo/glavnye-upravleniya-po-subektam-rossiyskoy-federacii
 * - Regional site patterns like https://XX.mchs.gov.ru or https://name.mchs.gov.ru
 *
 * Numeric hosts correspond to OKATO-like regional codes used by MChS CMS.
 * Named hosts are used for federal cities and special cases.
 */

const REGIONS = {
  // Центральный федеральный округ
  moscow: { name: "г. Москва", host: "moscow" },
  "77": { name: "г. Москва", host: "moscow" },
  belgorod: { name: "Белгородская область", host: "31" },
  "31": { name: "Белгородская область", host: "31" },
  bryansk: { name: "Брянская область", host: "32" },
  "32": { name: "Брянская область", host: "32" },
  vladimir: { name: "Владимирская область", host: "33" },
  "33": { name: "Владимирская область", host: "33" },
  voronezh: { name: "Воронежская область", host: "36" },
  "36": { name: "Воронежская область", host: "36" },
  ivanovo: { name: "Ивановская область", host: "37" },
  "37": { name: "Ивановская область", host: "37" },
  kaluga: { name: "Калужская область", host: "40" },
  "40": { name: "Калужская область", host: "40" },
  kostroma: { name: "Костромская область", host: "44" },
  "44": { name: "Костромская область", host: "44" },
  kursk: { name: "Курская область", host: "46" },
  "46": { name: "Курская область", host: "46" },
  lipetsk: { name: "Липецкая область", host: "48" },
  "48": { name: "Липецкая область", host: "48" },
  "moskovskaya oblast": { name: "Московская область", host: "50" },
  "50": { name: "Московская область", host: "50" },
  orel: { name: "Орловская область", host: "57" },
  "57": { name: "Орловская область", host: "57" },
  ryazan: { name: "Рязанская область", host: "62" },
  "62": { name: "Рязанская область", host: "62" },
  smolensk: { name: "Смоленская область", host: "67" },
  "67": { name: "Смоленская область", host: "67" },
  tambov: { name: "Тамбовская область", host: "68" },
  "68": { name: "Тамбовская область", host: "68" },
  tver: { name: "Тверская область", host: "69" },
  "69": { name: "Тверская область", host: "69" },
  tula: { name: "Тульская область", host: "71" },
  "71": { name: "Тульская область", host: "71" },
  yaroslavl: { name: "Ярославская область", host: "76" },
  "76": { name: "Ярославская область", host: "76" },

  // Приволжский федеральный округ
  bashkortostan: { name: "Республика Башкортостан", host: "02" },
  "02": { name: "Республика Башкортостан", host: "02" },
  "mariy el": { name: "Республика Марий Эл", host: "12" },
  "12": { name: "Республика Марий Эл", host: "12" },
  mordovia: { name: "Республика Мордовия", host: "13" },
  "13": { name: "Республика Мордовия", host: "13" },
  tatarstan: { name: "Республика Татарстан", host: "16" },
  "16": { name: "Республика Татарстан", host: "16" },
  udmurtia: { name: "Удмуртская Республика", host: "18" },
  "18": { name: "Удмуртская Республика", host: "18" },
  chuvashia: { name: "Чувашская Республика", host: "21" },
  "21": { name: "Чувашская Республика", host: "21" },
  kirov: { name: "Кировская область", host: "43" },
  "43": { name: "Кировская область", host: "43" },
  "nizhny novgorod": { name: "Нижегородская область", host: "52" },
  "52": { name: "Нижегородская область", host: "52" },
  orenburg: { name: "Оренбургская область", host: "56" },
  "56": { name: "Оренбургская область", host: "56" },
  penza: { name: "Пензенская область", host: "58" },
  "58": { name: "Пензенская область", host: "58" },
  perm: { name: "Пермский край", host: "59" },
  "59": { name: "Пермский край", host: "59" },
  samara: { name: "Самарская область", host: "63" },
  "63": { name: "Самарская область", host: "63" },
  saratov: { name: "Саратовская область", host: "64" },
  "64": { name: "Саратовская область", host: "64" },
  ulyanovsk: { name: "Ульяновская область", host: "73" },
  "73": { name: "Ульяновская область", host: "73" },

  // Северо-Западный федеральный округ
  karelia: { name: "Республика Карелия", host: "10" },
  "10": { name: "Республика Карелия", host: "10" },
  komi: { name: "Республика Коми", host: "11" },
  "11": { name: "Республика Коми", host: "11" },
  arkhangelsk: { name: "Архангельская область", host: "29" },
  "29": { name: "Архангельская область", host: "29" },
  vologda: { name: "Вологодская область", host: "35" },
  "35": { name: "Вологодская область", host: "35" },
  kaliningrad: { name: "Калининградская область", host: "39" },
  "39": { name: "Калининградская область", host: "39" },
  "leningradskaya oblast": { name: "Ленинградская область", host: "47" },
  "47": { name: "Ленинградская область", host: "47" },
  murmansk: { name: "Мурманская область", host: "51" },
  "51": { name: "Мурманская область", host: "51" },
  novgorod: { name: "Новгородская область", host: "53" },
  "53": { name: "Новгородская область", host: "53" },
  pskov: { name: "Псковская область", host: "60" },
  "60": { name: "Псковская область", host: "60" },
  "saint petersburg": { name: "г. Санкт-Петербург", host: "78" },
  "78": { name: "г. Санкт-Петербург", host: "78" },
  spb: { name: "г. Санкт-Петербург", host: "78" },
  "nentskiy": { name: "Ненецкий АО", host: "83" },
  "83": { name: "Ненецкий АО", host: "83" },

  // Южный федеральный округ
  adygea: { name: "Республика Адыгея", host: "01" },
  "01": { name: "Республика Адыгея", host: "01" },
  kalmykia: { name: "Республика Калмыкия", host: "08" },
  "08": { name: "Республика Калмыкия", host: "08" },
  krasnodar: { name: "Краснодарский край", host: "23" },
  "23": { name: "Краснодарский край", host: "23" },
  astrakhan: { name: "Астраханская область", host: "30" },
  "30": { name: "Астраханская область", host: "30" },
  volgograd: { name: "Волгоградская область", host: "34" },
  "34": { name: "Волгоградская область", host: "34" },
  rostov: { name: "Ростовская область", host: "61" },
  "61": { name: "Ростовская область", host: "61" },
  crimea: { name: "Республика Крым", host: "91" },
  "91": { name: "Республика Крым", host: "91" },
  sevastopol: { name: "г. Севастополь", host: "92" },
  "92": { name: "г. Севастополь", host: "92" },

  // Северо-Кавказский федеральный округ
  dagestan: { name: "Республика Дагестан", host: "05" },
  "05": { name: "Республика Дагестан", host: "05" },
  ingushetia: { name: "Республика Ингушетия", host: "06" },
  "06": { name: "Республика Ингушетия", host: "06" },
  "kabardino-balkaria": { name: "Кабардино-Балкарская Республика", host: "07" },
  "07": { name: "Кабардино-Балкарская Республика", host: "07" },
  "karachay-cherkessia": { name: "Карачаево-Черкесская Республика", host: "09" },
  "09": { name: "Карачаево-Черкесская Республика", host: "09" },
  "north ossetia": { name: "Республика Северная Осетия - Алания", host: "15" },
  "15": { name: "Республика Северная Осетия - Алания", host: "15" },
  stavropol: { name: "Ставропольский край", host: "26" },
  "26": { name: "Ставропольский край", host: "26" },
  chechnya: { name: "Чеченская Республика", host: "20" },
  "20": { name: "Чеченская Республика", host: "20" },

  // Уральский федеральный округ
  kurgan: { name: "Курганская область", host: "45" },
  "45": { name: "Курганская область", host: "45" },
  sverdlovsk: { name: "Свердловская область", host: "66" },
  "66": { name: "Свердловская область", host: "66" },
  tyumen: { name: "Тюменская область", host: "72" },
  "72": { name: "Тюменская область", host: "72" },
  chelyabinsk: { name: "Челябинская область", host: "74" },
  "74": { name: "Челябинская область", host: "74" },
  "yamalo-nenets": { name: "Ямало-Ненецкий АО", host: "89" },
  "89": { name: "Ямало-Ненецкий АО", host: "89" },
  "khanty-mansiysk": { name: "Ханты-Мансийский АО - Югра", host: "86" },
  "86": { name: "Ханты-Мансийский АО - Югра", host: "86" },

  // Сибирский федеральный округ
  altai: { name: "Республика Алтай", host: "04" },
  "04": { name: "Республика Алтай", host: "04" },
  tuva: { name: "Республика Тыва", host: "17" },
  "17": { name: "Республика Тыва", host: "17" },
  khakassia: { name: "Республика Хакасия", host: "19" },
  "19": { name: "Республика Хакасия", host: "19" },
  "altai krai": { name: "Алтайский край", host: "22" },
  "22": { name: "Алтайский край", host: "22" },
  krasnoyarsk: { name: "Красноярский край", host: "24" },
  "24": { name: "Красноярский край", host: "24" },
  irkutsk: { name: "Иркутская область", host: "38" },
  "38": { name: "Иркутская область", host: "38" },
  kemerovo: { name: "Кемеровская область - Кузбасс", host: "42" },
  "42": { name: "Кемеровская область - Кузбасс", host: "42" },
  novosibirsk: { name: "Новосибирская область", host: "54" },
  "54": { name: "Новосибирская область", host: "54" },
  omsk: { name: "Омская область", host: "55" },
  "55": { name: "Омская область", host: "55" },
  tomsk: { name: "Томская область", host: "70" },
  "70": { name: "Томская область", host: "70" },

  // Дальневосточный федеральный округ
  buryatia: { name: "Республика Бурятия", host: "03" },
  "03": { name: "Республика Бурятия", host: "03" },
  sakha: { name: "Республика Саха (Якутия)", host: "14" },
  yakutia: { name: "Республика Саха (Якутия)", host: "14" },
  "14": { name: "Республика Саха (Якутия)", host: "14" },
  "primorsky krai": { name: "Приморский край", host: "25" },
  "25": { name: "Приморский край", host: "25" },
  vladivostok: { name: "Приморский край", host: "25" },
  khabarovsk: { name: "Хабаровский край", host: "27" },
  "27": { name: "Хабаровский край", host: "27" },
  amur: { name: "Амурская область", host: "28" },
  "28": { name: "Амурская область", host: "28" },
  kamchatka: { name: "Камчатский край", host: "41" },
  "41": { name: "Камчатский край", host: "41" },
  magadan: { name: "Магаданская область", host: "49" },
  "49": { name: "Магаданская область", host: "49" },
  sakhalin: { name: "Сахалинская область", host: "65" },
  "65": { name: "Сахалинская область", host: "65" },
  "zabaykalsky krai": { name: "Забайкальский край", host: "75" },
  "75": { name: "Забайкальский край", host: "75" },
  "jewish ao": { name: "Еврейская АО", host: "79" },
  "79": { name: "Еврейская АО", host: "79" },
  chukotka: { name: "Чукотский АО", host: "87" },
  "87": { name: "Чукотский АО", host: "87" }
};

/**
 * Build a lookup map from region name (lowercase) to region info.
 */
const NAME_TO_REGION = {};
for (const [key, info] of Object.entries(REGIONS)) {
  // Index all keys, but prioritize non-numeric ones for name lookups
  const keyLower = key.toLowerCase();
  if (!NAME_TO_REGION[keyLower]) {
    NAME_TO_REGION[keyLower] = info;
  }
}

// Additionally index by full Russian names
for (const [key, info] of Object.entries(REGIONS)) {
  if (/^\d+$/.test(key)) {
    // For numeric keys, index by the Russian name
    const nameLower = info.name.toLowerCase();
    if (!NAME_TO_REGION[nameLower]) {
      NAME_TO_REGION[nameLower] = info;
    }
  }
}

/**
 * Look up a region by name or host and return the normalized host.
 * @param {string} query - Region name or host (e.g. "Москва", "moscow", "46", "Курская область")
 * @returns {{ name: string, host: string } | null}
 */
function lookupRegion(query) {
  if (!query) {
    return null;
  }

  const trimmed = query.trim();

  // Direct host match (numeric or named)
  const directMatch = REGIONS[trimmed.toLowerCase()];
  if (directMatch) {
    return { name: directMatch.name, host: directMatch.host };
  }

  // Name-based lookup
  const nameLower = trimmed.toLowerCase();
  const nameMatch = NAME_TO_REGION[nameLower];
  if (nameMatch) {
    return { name: nameMatch.name, host: nameMatch.host };
  }

  // Fuzzy substring match against region names
  for (const [nameKey, info] of Object.entries(NAME_TO_REGION)) {
    if (nameKey.includes(nameLower) || nameLower.includes(nameKey)) {
      return { name: info.name, host: info.host };
    }
  }

  return null;
}

/**
 * List all available regions with their names and hosts.
 * @returns {Array<{ name: string, host: string }>}
 */
function listRegions() {
  const seen = new Set();
  const result = [];

  for (const info of Object.values(REGIONS)) {
    if (!seen.has(info.host)) {
      seen.add(info.host);
      result.push({ name: info.name, host: info.host });
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

module.exports = {
  REGIONS,
  listRegions,
  lookupRegion
};

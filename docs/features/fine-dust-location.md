# Гайд по fine dust для текущего местоположения

## Что умеет этот сценарий

- Искать станции наблюдения по району, `행정구역` или `지역명`.
- Возвращать список кандидатов, если однозначно выбрать станцию нельзя.
- Повторно запрашивать данные по точному имени станции.
- Сводить PM10, PM2.5, уровень и время измерения.

## Что нужно заранее

- Прочитать [общую настройку](../setup.md)
- Прочитать [политику по секретам](../security-and-secrets.md)
- Либо `k-skill-proxy`, либо ключ Air Korea OpenAPI

## Нужные переменные окружения

Базовый клиентский режим:

- Внешний proxy URL по умолчанию: `https://k-skill-proxy.nomadamas.org`
- `KSKILL_PROXY_BASE_URL` задаётся только если нужно переопределение

Только для direct fallback без proxy:

- `AIR_KOREA_OPEN_API_KEY`

### Порядок разрешения учётных данных

1. Если переменные уже есть в окружении, использовать их.
2. Если агент работает через отдельный secret vault, можно брать значения оттуда.
3. Если env нет, сначала искать `~/.config/ru-skill/secrets.env`, затем `~/.config/k-skill/secrets.env`.
4. Если источников нет, запросить секрет у пользователя и сохранить его в vault или `secrets.env`.

## Входные данные

- Базовый запрос: административная подсказка `regionHint`, то есть `행정구역` или `지역명`
- Повторный запрос: точное имя станции `stationName`

## Базовый поток

1. Если задан `KSKILL_PROXY_BASE_URL`, сначала вызвать `/v1/fine-dust/report` на `k-skill-proxy`.
2. Если пришёл `regionHint`, proxy сначала выделяет название региона и получает список станций через `getCtprvnRltmMesureDnsty`.
3. Если токен из региона однозначно соответствует одной станции, proxy вызывает `getMsrstnAcctoRltmMesureDnsty` для неё.
4. Если однозначности нет, proxy возвращает `ambiguous_location` и `candidate_stations`.
5. Клиент повторяет запрос с точным `stationName`.
6. В итоговый ответ попадают PM10, PM2.5, уровни и момент измерения, а также `조회 시각` или `조회 시점`.

Пример через proxy:

```bash
python3 scripts/fine_dust.py report --region-hint "서울 강남구" --json
```

Пример, когда proxy возвращает кандидатов:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=광주 광산구'
```

Повторный запрос по точному имени станции:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'stationName=우산동(광주)'
```

Если нужен почти raw-доступ к AirKorea, можно использовать passthrough endpoint. При этом proxy сам инжектирует `serviceKey`, а отдельный client API не нужен.

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty' \
  --data-urlencode 'returnType=json' \
  --data-urlencode 'numOfRows=1' \
  --data-urlencode 'pageNo=1' \
  --data-urlencode 'stationName=강남구' \
  --data-urlencode 'dataTerm=DAILY' \
  --data-urlencode 'ver=1.4'
```

## Примеры

Direct fallback по региону:

```bash
curl -sG "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList" \
  --data-urlencode "serviceKey=${AIR_KOREA_OPEN_API_KEY}" \
  --data-urlencode "returnType=json" \
  --data-urlencode "numOfRows=50" \
  --data-urlencode "pageNo=1" \
  --data-urlencode "addr=서울 강남구"
```

Запрос текущих значений:

```bash
curl -sG "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty" \
  --data-urlencode "serviceKey=${AIR_KOREA_OPEN_API_KEY}" \
  --data-urlencode "returnType=json" \
  --data-urlencode "numOfRows=100" \
  --data-urlencode "pageNo=1" \
  --data-urlencode "stationName=중구" \
  --data-urlencode "dataTerm=DAILY" \
  --data-urlencode "ver=1.4"
```

Проверка helper-скрипта на fixture'ах:

```bash
python3 scripts/fine_dust.py report \
  --station-file scripts/fixtures/fine-dust-stations.json \
  --measurement-file scripts/fixtures/fine-dust-measurements.json \
  --region-hint "서울 강남구"
```

## fallback / 대체 흐름

- Сначала принимать район или административную подсказку.
- Если станцию выбрать нельзя, возвращать список кандидатов.
- Затем просить пользователя выбрать один вариант и повторять запрос по `stationName`.
- Даже если station-list API отдаёт `403`, можно обойтись комбинацией `getCtprvnRltmMesureDnsty` и измерений по станции.

## Ограничения

- Поскольку значения real-time, в ответе нужно указывать время измерения.
- Если PM10 или PM2.5 приходят как `-` или выглядят некорректно, нужно перепроверять уровень вместе со значением.
- Если API не прислал `khaiGrade`, интегральный уровень нужно выводить как `정보없음`.
- `regionHint` описывает место в естественном языке, поэтому неоднозначность там частая.
- В hosted-режиме upstream AirKorea key должен оставаться только на proxy, а не на клиенте.

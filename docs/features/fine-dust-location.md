# Руководство по мелкой пыли для текущего местоположения

## Граничное примечание

Этот сценарий не считается новым целевым навыком `ru-skill`. Он сохраняется как устаревшая/переходная утилита вокруг AirKorea и `k-skill-proxy`, чтобы не ломать совместимость, но не должен выглядеть как скрытый перечень задач новых русскоязычных интеграций на публичных источниках.

## Что делает навык

- Искать станции наблюдения по району, административному делению или названию региона.
- Возвращать список кандидатов, если однозначно выбрать станцию нельзя.
- Повторно запрашивать данные по точному имени станции.
- Сводить PM10, PM2.5, уровень и время измерения.

## Предварительные условия

- Прочитать [общую настройку](../setup.md)
- Прочитать [политику по секретам](../security-and-secrets.md)
- Либо `k-skill-proxy`, либо ключ Air Korea OpenAPI

## Нужные переменные окружения

Предпочтительный клиентский режим:

- Внешний URL прокси по умолчанию: `https://k-skill-proxy.nomadamas.org`
- `KSKILL_PROXY_BASE_URL` задаётся только если нужно переопределить эту конечную точку
- Отдельный клиентский ключ API в этом режиме не нужен

Только для прямой резервный доступ без прокси или для собственного прокси-сервера:

- `AIR_KOREA_OPEN_API_KEY`

### Порядок разрешения учётных данных

1. Если переменные уже есть в окружении, использовать их.
2. Если агент работает через отдельное хранилище секретов, можно брать значения оттуда.
3. Если переменных окружения нет, сначала искать `~/.config/ru-skill/secrets.env`, затем устаревший резерв `~/.config/k-skill/secrets.env`.
4. Если источников нет, запросить секрет у пользователя и сохранить его в хранилище секретов или `secrets.env`.

## Входные данные

- Базовый запрос: административная подсказка `regionHint` (район или название региона)
- Повторный запрос: точное имя станции `stationName`

## Рабочий процесс

1. Если задан `KSKILL_PROXY_BASE_URL`, сначала вызвать `/v1/fine-dust/report` на этом прокси; если переменная не задана, использовать опубликованный совместимую конечную точку `https://k-skill-proxy.nomadamas.org`.
2. Если пришёл `regionHint`, прокси сначала выделяет название региона и получает список станций через `getCtprvnRltmMesureDnsty`.
3. Если токен из региона однозначно соответствует одной станции, прокси вызывает `getMsrstnAcctoRltmMesureDnsty` для неё.
4. Если однозначности нет, прокси возвращает `ambiguous_location` и `candidate_stations`.
5. Клиент повторяет запрос с точным `stationName`.
6. В итоговый ответ попадают PM10, PM2.5, уровни и момент измерения, а также время запроса.

Пример через прокси:

```bash
python3 scripts/fine_dust.py report --region-hint "서울 강남구" --json
```

Пример, когда прокси возвращает кандидатов:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=광주 광산구'
```

Повторный запрос по точному имени станции:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'stationName=우산동(광주)'
```

Если нужен почти прямой доступ к AirKorea, можно использовать конечную точку сквозного маршрута. При этом прокси сам подставляет `serviceKey`, а отдельный клиентский API не нужен.

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

Прямой резервный доступ по региону:

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

Проверка вспомогательного скрипта на эталонных данных:

```bash
python3 scripts/fine_dust.py report \
  --station-file scripts/fixtures/fine-dust-stations.json \
  --measurement-file scripts/fixtures/fine-dust-measurements.json \
  --region-hint "서울 강남구"
```

## Резервный поток (запасной вариант)

- Сначала принимать район или административную подсказку.
- Если станцию выбрать нельзя, возвращать список кандидатов (`candidate_stations`).
- Затем просить пользователя выбрать один вариант и повторять запрос по `stationName`.
- Даже если station-list API отдаёт `403`, можно обойтись комбинацией `getCtprvnRltmMesureDnsty` и измерений по станции.

## Ограничения

- Поскольку значения поступают в реальном времени, в ответе нужно указывать время измерения.
- Если PM10 или PM2.5 приходят как `-` или выглядят некорректно, нужно перепроверять уровень вместе со значением.
- Если API не прислал `khaiGrade`, интегральный уровень нужно выводить как «Нет данных».
- `regionHint` описывает место в естественном языке, поэтому неоднозначность там частая.
- При развёртывании на сервере ключ вышестоящего API AirKorea должен оставаться только на прокси, а не на клиенте.
- Публичный прокси и устаревшее именование здесь остаются слоем совместимости, а не рекомендацией расширять `ru-skill` новыми корейскими сценариями источников данных.

# Руководство по отслеживанию доставки

## Что делает навык

- Отслеживать отправления CJ Logistics.
- Отслеживать отправления Korea Post.
- Сводить текущий статус и последние события.
- Держать единые правила модуля-посредника перевозчика внутри одного навыка.

## Граничное примечание

Этот сценарий остаётся `устаревший без развития`: он полезен для обратной совместимости и как эталонный сценарий отслеживания через модули-посредники, но не считается следующим российским направлением целевой линейки репозитория. Пока не подтверждён устойчивый российский публичный источник с сопоставимой ценностью, `delivery-tracking` не должен выглядеть как скрытый перечень задач на новую замену.

## Предварительные условия

- Доступ в интернет
- `python3`
- `curl`

Дополнительные пакеты `npm` или Python не нужны: достаточно официальных конечных точек.

## Входные данные

- Перевозчик: `cj` или `epost`
- Номер отслеживания
  - CJ Logistics: 10 или 12 цифр
  - Korea Post: 13 цифр

## Рабочий процесс

1. Сначала проверить длину номера через модуль проверки конкретного перевозчика.
2. Для CJ прочитать `_csrf` с официальной страницы и только потом вызвать конечную точку в формате JSON `tracking-detail`.
3. Для Korea Post отправить `sid1` в `trace.RetrieveDomRigiTraceList.comm` и разобрать HTML.
4. Нормализовать ответы в общий формат.
5. При добавлении нового перевозчика придерживаться той же схемы полей модуля-посредника: `модуль проверки / точка входа / транспорт / программа разбора / таблица статусов / политика повторных попыток`.

## Пример для CJ Logistics

- Страница входа: `https://www.cjlogistics.com/ko/tool/parcel/tracking`
- Конечная точка деталей: `https://www.cjlogistics.com/ko/tool/parcel/tracking-detail`
- Параметры: `_csrf`, `paramInvcNo`

```bash
tmp_body="$(mktemp)"
tmp_cookie="$(mktemp)"
tmp_json="$(mktemp)"
invoice="1234567890"

curl -sS -L -c "$tmp_cookie" \
  "https://www.cjlogistics.com/ko/tool/parcel/tracking" \
  -o "$tmp_body"

csrf="$(python3 - <<'PY' "$tmp_body"
import re
import sys
text = open(sys.argv[1], encoding="utf-8", errors="ignore").read()
print(re.search(r'name="_csrf" value="([^"]+)"', text).group(1))
PY
)"

curl -sS -L -b "$tmp_cookie" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
  --data-urlencode "_csrf=$csrf" \
  --data-urlencode "paramInvcNo=$invoice" \
  "https://www.cjlogistics.com/ko/tool/parcel/tracking-detail" \
  -o "$tmp_json"

python3 - <<'PY' "$tmp_json"
import json
import sys

status_map = {
    "11": "Принято",
    "21": "В пути",
    "41": "В пути",
    "42": "Прибыло в пункт доставки",
    "44": "В пути",
    "82": "Доставка начата",
    "91": "Доставлено",
}

payload = json.load(open(sys.argv[1], encoding="utf-8"))
events = payload["parcelDetailResultMap"]["resultList"]
if not events:
    raise SystemExit("Результаты запроса не найдены.")

latest = events[-1]
normalized_events = [
    {
        "timestamp": event.get("dTime"),
        "location": event.get("regBranNm"),
        "status_code": event.get("crgSt"),
        "status": status_map.get(event.get("crgSt"), event.get("scanNm") or "Неизвестно"),
    }
    for event in events
]
print(json.dumps({
    "carrier": "cj",
    "invoice": payload["parcelDetailResultMap"]["paramInvcNo"],
    "status_code": latest.get("crgSt"),
    "status": status_map.get(latest.get("crgSt"), latest.get("scanNm") or "Неизвестно"),
    "timestamp": latest.get("dTime"),
    "location": latest.get("regBranNm"),
    "event_count": len(events),
    "recent_events": normalized_events[-min(3, len(normalized_events)):],
}, ensure_ascii=False, indent=2))
PY

rm -f "$tmp_body" "$tmp_cookie" "$tmp_json"
```

#### Пример вывода CJ Logistics

Ниже приведён результат нормализации, подтверждённый проверочный тест (`1234567890`) на 2026-03-27.

```json
{
  "carrier": "cj",
  "invoice": "1234567890",
  "status_code": "91",
  "status": "Доставлено",
  "timestamp": "2026-03-21 12:22:13",
  "location": "Кёнги-Кванджу-Опхо",
  "event_count": 3,
  "recent_events": [
    {
      "timestamp": "2026-03-10 03:01:45",
      "location": "Чхонвон-HUB",
      "status_code": "44",
      "status": "В пути"
    },
    {
      "timestamp": "2026-03-21 10:53:19",
      "location": "Кёнги-Кванджу-Опхо",
      "status_code": "82",
      "status": "Доставка начата"
    },
    {
      "timestamp": "2026-03-21 12:22:13",
      "location": "Кёнги-Кванджу-Опхо",
      "status_code": "91",
      "status": "Доставлено"
    }
  ]
}
```

Для CJ Logistics надёжнее всего читать статус из `parcelDetailResultMap.resultList`. В итоговой выдаче лучше оставлять только общую схему результатов (`carrier`, `invoice`, `status`, `timestamp`, `location`, `event_count`, `recent_events`, опционально `status_code`) и не выводить исходные поля вроде `crgNm`, где может оказаться имя сотрудника или телефон.

## Пример для Korea Post

- Страница входа: `https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=`
- Конечная точка запроса: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm`
- Параметр: `sid1`

```bash
tmp_html="$(mktemp)"
python3 - <<'PY' "$tmp_html"
import html
import json
import re
import subprocess
import sys

invoice = "1234567890123"
output_path = sys.argv[1]

subprocess.run(
    [
        "curl",
        "--http1.1",
        "--tls-max",
        "1.2",
        "--silent",
        "--show-error",
        "--location",
        "--retry",
        "3",
        "--retry-all-errors",
        "--retry-delay",
        "1",
        "--max-time",
        "30",
        "-o",
        output_path,
        "-d",
        f"sid1={invoice}",
        "https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm",
    ],
    check=True,
)

page = open(output_path, encoding="utf-8", errors="ignore").read()
summary = re.search(
    r"<th scope=\"row\">(?P<tracking>[^<]+)</th>.*?"
    r"<td>(?P<sender>.*?)</td>.*?"
    r"<td>(?P<receiver>.*?)</td>.*?"
    r"<td>(?P<delivered_to>.*?)</td>.*?"
    r"<td>(?P<kind>.*?)</td>.*?"
    r"<td>(?P<result>.*?)</td>",
    page,
    re.S,
)
if not summary:
    raise SystemExit("Не удалось найти таблицу основной информации.")

def clean(raw: str) -> str:
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", raw)).split())

def clean_location(raw: str) -> str:
    text = clean(raw)
    return re.sub(r"\s*(TEL\s*:?\s*)?\d{2,4}[.\-]\d{3,4}[.\-]\d{4}", "", text).strip()

events = re.findall(
    r"<tr>\s*<td>(\d{4}\.\d{2}\.\d{2})</td>\s*"
    r"<td>(\d{2}:\d{2})</td>\s*"
    r"<td>(.*?)</td>\s*"
    r"<td>\s*<span class=\"evtnm\">(.*?)</span>(.*?)</td>\s*</tr>",
    page,
    re.S,
)

normalized_events = [
    {
        "timestamp": f"{day} {time_}",
        "location": clean_location(location),
        "status": clean(status),
    }
    for day, time_, location, status, _detail in events
]

latest_event = normalized_events[-1] if normalized_events else None

print(json.dumps({
    "carrier": "epost",
    "invoice": clean(summary.group("tracking")),
    "status": clean(summary.group("result")),
    "timestamp": latest_event["timestamp"] if latest_event else None,
    "location": latest_event["location"] if latest_event else None,
    "event_count": len(normalized_events),
    "recent_events": normalized_events[-min(3, len(normalized_events)):],
}, ensure_ascii=False, indent=2))
PY
rm -f "$tmp_html"
```

#### Пример вывода Почтовой службы Кореи

Ниже приведён результат нормализации, подтверждённый проверочный тест (`1234567890123`) на 2026-03-27.

```json
{
  "carrier": "epost",
  "invoice": "1234567890123",
  "status": "Доставлено",
  "timestamp": "2025.12.04 15:13",
  "location": "Чеджудо-почтамт",
  "event_count": 2,
  "recent_events": [
    {
      "timestamp": "2025.12.04 15:13",
      "location": "Чеджудо-почтамт",
      "status": "Подготовка к доставке"
    },
    {
      "timestamp": "2025.12.04 15:13",
      "location": "Чеджудо-почтамт",
      "status": "Доставлено"
    }
  ]
}
```

У Почтовой службы Кореи ответ приходит в HTML, поэтому нужно разбирать базовую таблицу `table_col` и детальные события из `processTable`. В итоговой выдаче стоит оставлять ту же общую схему результатов, что и для CJ Logistics, а примеси вроде `TEL` в location и исходные заметки получателя удалять.

## Критерии структурирования результатов

### Общая схема результатов

- `carrier`: идентификатор перевозчика (`cj` или `epost`)
- `invoice`: нормализованный номер отслеживания
- `status`: текущий статус доставки
- `timestamp`: время последнего события
- `location`: место последнего события
- `event_count`: число событий
- `recent_events`: до трёх последних событий
- `status_code`: исходный код статуса, если он нужен; сейчас используется только для CJ Logistics

## Правила расширения

Если подключается другой перевозчик, сначала явно определите только эти части модуля-посредника:

- модуль проверки
- официальная точка входа
- транспорт (`JSON / HTML / CLI`)
- программа разбора
- таблица статусов
- политика повторных попыток

## Ограничения

- Для CJ нельзя сразу вызывать `tracking-detail` без `_csrf`.
- Для Korea Post базовым остаётся путь `curl --http1.1 --tls-max 1.2`.
- Для Korea Post нужно быть готовым к формату HTML, а не к формату JSON.
- Не следует автоматически уходить на неофициальные агрегаторы доставки.

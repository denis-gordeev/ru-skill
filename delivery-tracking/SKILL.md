---
name: delivery-tracking
description: Legacy-compatible tracking of CJ Logistics and Korea Post parcels. Retained for backward compatibility; not a target direction for new Russian logistics integrations.
license: MIT
metadata:
  category: logistics
  locale: ru-RU
  phase: v1
---

# Отслеживание доставки

## Граничное примечание

Этот навык остаётся `legacy-only`: он полезен для обратной совместимости и как reference по adapter-based tracking flow, но не считается следующим российским target-направлением репозитория. Прямой российский replacement для отслеживания доставки через публичные free API пока не подтверждён. Адаптер перевозчика сохранён как backward-compatible расширяемый паттерн, а не как активный backlog для новых курьерских интеграций.

## Что делает навык

Получает текущий статус доставки по номеру накладной через официальные поверхности CJ Logistics и Почтовой службы Кореи.

- **CJ Logistics**: используется JSON-эндпоинт, который раскрывает официальная страница отслеживания доставки
- **Почтовая служба Кореи**: используется HTML-эндпоинт, который использует официальная страница отслеживания доставки
- Результаты кратко оформляются в общем формате (перевозчик / номер накладной / текущий статус / последние события)

## Когда использовать

- «Отслеживай посылку CJ Logistics по накладной»
- «Где сейчас почтовая посылка»
- «Проверь, доставлена ли эта посылка»
- «Упорядочи логику запросов по перевозчикам, чтобы потом можно было добавить новые»

## Когда не использовать

- Есть только номер заказа, но нет номера накладной
- Требуется оформление заказа или возврат товара
- Хочется использовать неофициальный агрегатор доставки

## Предварительные условия

- Подключение к интернету
- `python3`
- `curl`
- Опционально: `jq`

## Входные данные

- Идентификатор перевозчика: `cj` или `epost`
- Номер накладной
  - CJ Logistics: 10 или 12 цифр
  - Почтовая служба Кореи: 13 цифр

## Правило адаптера перевозчика

Этот навык разделяет логику по перевозчикам на уровне **адаптера перевозчика**.

При подключении нового перевозчика сначала определяются следующие поля.

- `carrier id`: например, `cj`, `epost`
- `validator`: длина/паттерн номера накладной
- `entrypoint`: официальный URL для запроса статуса
- `transport`: что используется — JSON API / HTML-форма / CLI
- `parser`: из каких полей или таблиц извлекается статус
- `status map`: как привести исходные коды статусов перевозчика к общим статусам
- `retry policy`: правила таймаута и повторных попыток

Текущие адаптеры:

| адаптер перевозчика | официальный вход | transport | валидатор | фокус парсера |
| --- | --- | --- | --- | --- |
| `cj` | `https://www.cjlogistics.com/ko/tool/parcel/tracking` | GET страницы + POST JSON `tracking-detail` | 10 или 12 цифр | `parcelDetailResultMap.resultList` |
| `epost` | `https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=` | POST HTML-формы | 13 цифр | основная информация `table_col` + детали `processTable` |

## Рабочий процесс

### 0. Сначала нормализуйте входные данные

- Приведите название перевозчика к одному из значений: `cj` / `epost`.
- Удалите пробелы и `-` из номера накладной.
- Если проверка длины не проходит, не отправляйте запрос.

### 1. CJ Logistics: официальный JSON-поток

Прочитайте `_csrf` со страницы входа и отправьте это значение вместе с POST-запросом к `tracking-detail`.

- Страница входа: `https://www.cjlogistics.com/ko/tool/parcel/tracking`
- Эндпоинт деталей: `https://www.cjlogistics.com/ko/tool/parcel/tracking-detail`
- Обязательные поля: `_csrf`, `paramInvcNo`

Базовый пример использует `curl` для получения `_csrf` и сохранения cookie, а Python — только для разбора JSON.

```bash
tmp_body="$(mktemp)"
tmp_cookie="$(mktemp)"
tmp_json="$(mktemp)"
invoice="1234567890"  # официальная страница, placeholder для smoke-test

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

payload = json.load(open(sys.argv[1], encoding="utf-8"))
events = payload["parcelDetailResultMap"]["resultList"]
if not events:
    raise SystemExit("Результаты запроса не найдены.")

status_map = {
    "11": "Принято",
    "21": "В пути",
    "41": "В пути",
    "42": "Прибыло в пункт доставки",
    "44": "В пути",
    "82": "Доставка начата",
    "91": "Доставлено",
}

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

#### Пример вывода CJ

Ниже приведён результат нормализации, подтверждённый live smoke test (`1234567890`) на 2026-03-27.

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

В качестве дополнительного smoke test можно использовать `000000000000`.

Даже если `parcelResultMap.resultList` пуст, события могут поступать через `parcelDetailResultMap.resultList`, поэтому приоритет отдаётся массиву детальных событий. Опубликованный пример оставляет только обезличенные поля в соответствии с общей схемой результатов (`carrier`, `invoice`, `status`, `timestamp`, `location`, `event_count`, `recent_events`, опциональный `status_code`), не раскрывая исходный текст `crgNm`, в который могут попасть имена и контакты ответственных лиц.

### 2. Почтовая служба Кореи: официальный HTML-поток

У Почтовой службы Кореи официальная страница входа повторно отправляет `sid1` через POST на `trace.RetrieveDomRigiTraceList.comm`.

- Страница входа: `https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=`
- Фактический эндпоинт запроса: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm`
- Обязательное поле: `sid1`

Для Почтовой службы Кореи путь `curl --http1.1 --tls-max 1.2` стабильнее локального Python HTTP-клиента, поэтому в базовом примере используется именно эта комбинация.

```bash
tmp_html="$(mktemp)"
python3 - <<'PY' "$tmp_html"
import html
import json
import re
import subprocess
import sys

invoice = "1234567890123"  # официальная страница, placeholder для smoke-test
output_path = sys.argv[1]

cmd = [
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
]
subprocess.run(cmd, check=True)

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
    text = re.sub(r"<[^>]+>", " ", raw)
    return " ".join(html.unescape(text).split())

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

Ниже приведён результат нормализации, подтверждённый live smoke test (`1234567890123`) на 2026-03-27.

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

Таблица основной информации Почтовой службы Кореи использует порядок «регистрационный номер», «отправитель/дата приёма», «получатель», «подписавший/дата доставки», «тип обработки», «результат доставки», а детальные события считываются из строк `processTable`: «дата / время / пункт обработки / статус обработки». Опубликованный пример оставляет только значения, необходимые для статуса доставки, в соответствии с общей схемой результатов, общей для CJ Logistics (`carrier`, `invoice`, `status`, `timestamp`, `location`, `event_count`, `recent_events`). Номера телефонов, которые могут встречаться в расположении событий, также удаляются, а исходный текст получателя и детальных заметок не раскрывается.

### 3. Нормализация для человека

Не копируйте исходный ответ как есть, а суммируйте его по общей схеме результатов.

#### Общая схема результатов

- `carrier`: идентификатор перевозчика (`cj` или `epost`)
- `invoice`: нормализованный номер накладной
- `status`: текущий статус доставки
- `timestamp`: время последнего события
- `location`: место последнего события
- `event_count`: общее количество событий
- `recent_events`: список последних 3 событий
- `status_code`: исходный код статуса, оставляется только при необходимости (сейчас используется только в примере CJ)

### 4. Политика повторных попыток и fallback

- При неправильной длине номера — немедленно остановитесь и запросите корректный формат.
- Для CJ: после повторного получения `_csrf` попробуйте ещё раз.
- Для Почтовой службы Кореи: сохраняйте `curl --retry 3 --retry-all-errors --retry-delay 1`.
- Не переключайтесь на другие перевозчики.

## Критерии завершения

- Перевозчик и номер накладной правильно идентифицированы
- Текущий статус и последние события задокументированы
- Можно объяснить, какая официальная поверхность использовалась
- Понятно, какие поля адаптера перевозчика нужны для существующих корейских перевозчиков

## Возможные ошибки

- CJ Logistics: не удалось извлечь `_csrf` или изменилась схема ответа `tracking-detail`
- CJ Logistics: длина номера накладной не 10 и не 12 цифр
- Почтовая служба Кореи: `sid1` не состоит из 13 цифр
- Почтовая служба Кореи: изменение HTML-разметки ломает правила извлечения таблиц
- Почтовая служба Кореи: таймаут/сброс при использовании клиента, отличного от `curl`

## Примечания

- Это навык запроса статуса.
- Базовая поверхность использует только официальные эндпоинты перевозчиков.
- Добавление новых перевозчиков поддерживается через паттерн адаптера, но не является активным направлением развития.

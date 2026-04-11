# Гайд по отслеживанию доставки

## Что умеет этот сценарий

- Отслеживать отправления CJ Logistics.
- Отслеживать отправления Korea Post.
- Сводить текущий статус и последние события.
- Держать единые правила carrier adapter внутри одного навыка.

## Что нужно заранее

- Доступ в интернет
- `python3`
- `curl`

Дополнительные npm- или Python-пакеты не нужны: достаточно официальных endpoint'ов.

## Входные данные

- Перевозчик: `cj` или `epost`
- Трек-номер
  - CJ Logistics: 10 или 12 цифр (`10자리 또는 12자리`)
  - Korea Post: 13 цифр (`13자리`)

## Базовый поток

1. Сначала проверить длину номера через validator конкретного перевозчика.
2. Для CJ прочитать `_csrf` с официальной страницы и только потом дернуть JSON endpoint `tracking-detail`.
3. Для Korea Post отправить `sid1` в `trace.RetrieveDomRigiTraceList.comm` и распарсить HTML.
4. Нормализовать ответы в общий формат.
5. При добавлении нового перевозчика придерживаться той же схемы adapter fields: `validator / entrypoint / transport / parser / status map / retry policy`.

## Пример для CJ Logistics

- Страница входа: `https://www.cjlogistics.com/ko/tool/parcel/tracking`
- Endpoint деталей: `https://www.cjlogistics.com/ko/tool/parcel/tracking-detail`
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
    "11": "상품인수",
    "21": "상품이동중",
    "41": "상품이동중",
    "42": "배송지도착",
    "44": "상품이동중",
    "82": "배송출발",
    "91": "배달완료",
}

payload = json.load(open(sys.argv[1], encoding="utf-8"))
events = payload["parcelDetailResultMap"]["resultList"]
if not events:
    raise SystemExit("조회 결과가 없습니다.")

latest = events[-1]
normalized_events = [
    {
        "timestamp": event.get("dTime"),
        "location": event.get("regBranNm"),
        "status_code": event.get("crgSt"),
        "status": status_map.get(event.get("crgSt"), event.get("scanNm") or "알수없음"),
    }
    for event in events
]
print(json.dumps({
    "carrier": "cj",
    "invoice": payload["parcelDetailResultMap"]["paramInvcNo"],
    "status_code": latest.get("crgSt"),
    "status": status_map.get(latest.get("crgSt"), latest.get("scanNm") or "알수없음"),
    "timestamp": latest.get("dTime"),
    "location": latest.get("regBranNm"),
    "event_count": len(events),
    "recent_events": normalized_events[-min(3, len(normalized_events)):],
}, ensure_ascii=False, indent=2))
PY

rm -f "$tmp_body" "$tmp_cookie" "$tmp_json"
```

#### Пример вывода CJ

아래 값은 2026-03-27 기준 live smoke test(`1234567890`)에서 확인한 정규화 결과다.

```json
{
  "carrier": "cj",
  "invoice": "1234567890",
  "status_code": "91",
  "status": "배달완료",
  "timestamp": "2026-03-21 12:22:13",
  "location": "경기광주오포",
  "event_count": 3,
  "recent_events": [
    {
      "timestamp": "2026-03-10 03:01:45",
      "location": "청원HUB",
      "status_code": "44",
      "status": "상품이동중"
    },
    {
      "timestamp": "2026-03-21 10:53:19",
      "location": "경기광주오포",
      "status_code": "82",
      "status": "배송출발"
    },
    {
      "timestamp": "2026-03-21 12:22:13",
      "location": "경기광주오포",
      "status_code": "91",
      "status": "배달완료"
    }
  ]
}
```

Для CJ надёжнее всего читать статус из `parcelDetailResultMap.resultList`. В итоговой выдаче лучше оставлять только `공통 포맷` и `공통 결과 스키마` (`carrier`, `invoice`, `status`, `timestamp`, `location`, `event_count`, `recent_events`, опционально `status_code`) и не выводить сырые поля вроде `crgNm`, где может оказаться имя сотрудника или телефон.

## Пример для Korea Post

- Страница входа: `https://service.epost.go.kr/trace.RetrieveRegiPrclDeliv.postal?sid1=`
- Endpoint запроса: `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm`
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
    raise SystemExit("기본정보 테이블을 찾지 못했습니다.")

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

#### Пример вывода 우체국

아래 값은 2026-03-27 기준 live smoke test(`1234567890123`)에서 확인한 정규화 결과다.

```json
{
  "carrier": "epost",
  "invoice": "1234567890123",
  "status": "배달완료",
  "timestamp": "2025.12.04 15:13",
  "location": "제주우편집중국",
  "event_count": 2,
  "recent_events": [
    {
      "timestamp": "2025.12.04 15:13",
      "location": "제주우편집중국",
      "status": "배달준비"
    },
    {
      "timestamp": "2025.12.04 15:13",
      "location": "제주우편집중국",
      "status": "배달완료"
    }
  ]
}
```

У Korea Post ответ приходит в HTML, поэтому нужно парсить базовую таблицу `table_col` и детальные события из `processTable`. В итоговой выдаче стоит оставить тот же `공통 결과 스키마`, что и для CJ, а примеси вроде `TEL` в location и сырые заметки получателя удалять.

## 결과 정리 기준

### 공통 결과 스키마

- `carrier`: идентификатор перевозчика (`cj` или `epost`)
- `invoice`: нормализованный трек-номер
- `status`: текущий статус доставки
- `timestamp`: время последнего события
- `location`: место последнего события
- `event_count`: число событий
- `recent_events`: до трёх последних событий, то есть `최근 최대 3개 이벤트` и раздел `최근 이벤트`
- `status_code`: исходный код статуса, если он нужен; сейчас используется только для CJ

## 확장 규칙

Если подключается новый перевозчик, то есть `다른 택배사`, сначала явно определите только эти части adapter'а:

- validator
- official entrypoint
- transport (`JSON / HTML / CLI`)
- parser
- status map
- retry policy

## Ограничения

- Для CJ нельзя сразу вызывать `tracking-detail` без `_csrf`.
- Для Korea Post базовым остаётся путь `curl --http1.1 --tls-max 1.2`.
- Для Korea Post нужно быть готовым к HTML, а не к JSON.
- Не следует автоматически уходить на неофициальные агрегаторы доставки.

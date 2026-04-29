---
name: srt-booking
description: Legacy-compatible Korean SRT booking flow for existing users. Use when the user asks for SRT seat availability, booking, canceling, or sold-out retry plans, not for new Russian railway integrations.
license: MIT
metadata:
  category: travel
  locale: ru-RU
  phase: v1
---

# Бронирование SRT

> Legacy-совместимый корейский railway skill. Он сохранён ради обратной совместимости и не считается шаблоном для новых российских write-интеграций. Для российских поездов используйте `yandex-rasp` как базовый read-only discovery, а replacement boundary смотрите в `docs/booking-replacements.md`.

## Что делает этот навык

Ищет поезда SRT через `SRTrain`, а при явном выборе пользователя позволяет перейти к бронированию, просмотру и отмене.

## Когда использовать

- "수서에서 부산 가는 SRT 찾아줘"
- "내일 오전 SRT 빈자리 있으면 잡아줘"
- "예약 내역 확인해줘"
- "이 SRT 예약 취소해줘"

## Когда не использовать

- 결제까지 자동으로 끝내야 하는 경우
- 비밀번호를 채팅창에 직접 보내려는 경우
- SRT가 아니라 KTX/Korail 예매인 경우
- Если нужен новый российский железнодорожный сценарий: для этого в репозитории целевым базовым путём считается `yandex-rasp`, а не расширение legacy-booking навыков.

## Предварительные требования

- Python 3.10+
- `python3 -m pip install SRTrain`

## Необходимые переменные окружения

- `KSKILL_SRT_ID`
- `KSKILL_SRT_PASSWORD`

### Порядок разрешения учётных данных

1. **Если переменные уже есть в окружении**, использовать их как есть.
2. **Если агент использует secret vault** (1Password CLI, Bitwarden CLI, macOS Keychain и т.д.), извлечь секреты оттуда и инжектировать как env.
3. **Если env нет**, сначала искать значения в `~/.config/ru-skill/secrets.env`, затем в legacy fallback `~/.config/k-skill/secrets.env`.
4. **Если источников нет**, запросить данные у пользователя и сохранить их в vault или `secrets.env`.

Путь по умолчанию остаётся fallback-вариантом, а не жёстким требованием.

## Входные данные

- 출발역
- 도착역
- 날짜: `YYYYMMDD`
- 희망 시작 시각: `HHMMSS`
- 인원 수와 승객 유형
- 좌석 선호: 일반실 / 특실

## Рабочий процесс

### 0. Установка пакета при отсутствии

Если `python3 -c 'import SRT'` завершается ошибкой, не обходить это альтернативными неофициальными потоками, а сначала установить пакет.

```bash
python3 -m pip install SRTrain
```

### 1. Обеспечить доступ к учётным данным

Проверить, что `KSKILL_SRT_ID` и `KSKILL_SRT_PASSWORD` доступны. Если нет, получить их по порядку выше.

Из-за отсутствия секретов не переходить на прямой парсинг веб-сайта или другие неофициальные пути.

### 2. Сначала выполнить поиск

Сначала получить список поездов и только потом переходить к side effects.

```bash
python3 - <<'PY'
import os
from SRT import SRT

srt = SRT(os.environ["KSKILL_SRT_ID"], os.environ["KSKILL_SRT_PASSWORD"])
trains = srt.search_train("수서", "부산", "20260328", "080000", time_limit="120000")

for idx, train in enumerate(trains[:5], start=1):
    print(idx, train)
PY
```

### 3. Коротко суммировать варианты до side effects

Перед бронированием всегда кратко показать:

- 출발/도착 시각
- 일반실/특실 가능 여부
- 예상 운임

### 4. Бронировать только после однозначного выбора поезда

Бронирование имеет side effects, поэтому выполнять его только после явного выбора конкретного поезда.

```bash
python3 - <<'PY'
import os
from SRT import Adult, SRT, SeatType

srt = SRT(os.environ["KSKILL_SRT_ID"], os.environ["KSKILL_SRT_PASSWORD"])
trains = srt.search_train("수서", "부산", "20260328", "080000", time_limit="120000")
reservation = srt.reserve(
    trains[0],
    passengers=[Adult(1)],
    special_seat=SeatType.GENERAL_FIRST,
)
print(reservation)
PY
```

### 5. Проверка и отмена

Перед отменой заново идентифицировать нужную бронь.

```bash
python3 - <<'PY'
import os
from SRT import SRT

srt = SRT(os.environ["KSKILL_SRT_ID"], os.environ["KSKILL_SRT_PASSWORD"])
reservations = srt.get_reservations()
print(reservations)
PY
```

## Считается выполненным, когда

- Для поиска: список кандидатов понятен пользователю
- Для бронирования: подтверждены результат, стоимость и срок выкупа
- Для отмены: однозначно понятно, какая бронь отменена

## Режимы сбоев

- Ошибка входа: проверить учётные данные и изменения политики SRT
- Sold out: предложить повторный поиск по другому времени или типу места
- Сетевая ошибка: сделать короткий retry без aggressive polling

## Примечания

- `SRTrain` остаётся профильной библиотекой именно для SRT, поэтому legacy-поток проще поддерживать отдельно от KTX.
- Этот навык относится к legacy-коридору репозитория и не должен расширяться в сторону новых российских checkout/write flows.
- 결제 완료까지는 자동화하지 않는다
- Автоматические retry-циклы должны оставаться короткими и консервативными ради безопасности аккаунта.

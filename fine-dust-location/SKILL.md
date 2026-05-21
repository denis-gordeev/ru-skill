---
name: fine-dust-location
description: Проверяет PM10/PM2.5 по региону или location hint через совместимый `k-skill-proxy` report endpoint; `KSKILL_PROXY_BASE_URL` используется только как optional override.
license: MIT
metadata:
  category: utility
  locale: ru-RU
  phase: v1
---

# Fine Dust By Location

## Что делает этот навык

По умолчанию навык обращается к published compatibility endpoint `https://k-skill-proxy.nomadamas.org/v1/fine-dust/report` и возвращает короткую сводку по PM10, PM2.5 и общей категории качества воздуха.

## Boundary note

Этот навык остаётся `legacy/transition utility`, а не новым `target`-направлением `ru-skill`. Он нужен, чтобы сохранить совместимость с AirKorea + `k-skill-proxy`, а published proxy endpoint и legacy naming существуют только как compatibility-layer, а не как новый продуктовый default для русскоязычных сценариев.

## Когда использовать

- "Какая сейчас мелкая пыль в районе Каннама?"
- "Покажи PM2.5 рядом с моей локацией"
- "Насколько сейчас хорошее качество воздуха здесь?"

## Входные данные

- Обычный ввод: название района или location hint
- Для повторного запроса: точное имя станции замера

## Как задавать регион

Лучше всего передавать **корейское административное название, близкое к имени станции измерения**.

- Хорошо: `강남구`, `서울 강남구`, `종로구`, `수원시`
- Неоднозначно: `강남`, `서울 남쪽`, `코엑스 근처`

Если в подсказке несколько токенов, helper или proxy обычно берут **самую конкретную часть**. Пример: `서울 강남구` -> `강남구`.

## Путь по умолчанию

Отдельный client-side API layer не нужен: обычно достаточно прямого HTTP-запроса к report endpoint.

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=서울 강남구'
```

Локальный helper использует тот же report endpoint как compatibility default.

```bash
python3 scripts/fine_dust.py report --region-hint '서울 강남구' --json
```

## Порядок разрешения учётных данных

1. Если значение уже есть в переменной окружения, использовать его как есть.
2. Если агент работает с secret vault, извлечь значение оттуда и инжектировать в env.
3. Если env пуст, сначала искать `~/.config/ru-skill/secrets.env`, затем legacy fallback `~/.config/k-skill/secrets.env`.
4. Если значений нет, запросить у пользователя `AIR_KOREA_OPEN_API_KEY` для direct fallback или self-hosted proxy. `KSKILL_PROXY_BASE_URL` спрашивать только если нужен явный override endpoint.

`KSKILL_PROXY_BASE_URL` не считается credential: это только optional endpoint override. Реальным секретом остаётся `AIR_KOREA_OPEN_API_KEY`, если published compatibility proxy не используется.

## Неоднозначные локации

Если региональная подсказка не маппится в одну станцию, proxy вернёт `ambiguous_location` и список кандидатов.

Пример:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=광주 광산구'
```

После этого нужно выбрать одну из `candidate_stations` и повторить запрос уже через `stationName`.

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'stationName=우산동(광주)'
```

## Детальные пути API

Подробности про passthrough-маршрут `/B552584/...` и direct fallback держим в отдельных документах, чтобы не дублировать длинный legacy-контекст в skill-level copy.

- `docs/features/fine-dust-location.md`
- `docs/features/k-skill-proxy.md`

## Как отвечать пользователю

Сначала сводите только главное:

- станция измерения
- время запроса
- значение и категория PM10
- значение и категория PM2.5
- итоговая категория качества воздуха
- режим запроса (`proxy` или `fallback`)

## Режимы сбоев

- `regionHint` слишком широкий и не даёт выбрать одну станцию
- proxy недоступен или upstream key отсутствует
- location hint не совпадает с фактическим названием станции, и нужен direct fallback

## Примечания

- Базовый compatibility path остаётся report endpoint на `k-skill-proxy.nomadamas.org`.
- `KSKILL_PROXY_BASE_URL` задаётся только если нужно заменить published proxy на другой endpoint; это не секрет и не обязательная часть стартовой настройки.
- Для location-based lookup сначала получайте кандидатов, а затем при необходимости делайте точный запрос по `stationName`.
- Детали passthrough/direct AirKorea лучше не повторять в каждом ответе пользователю, если они не нужны для решения задачи.
- Published proxy default не должен интерпретироваться как сигнал, что fine dust снова стал активным target-сценарием репозитория.

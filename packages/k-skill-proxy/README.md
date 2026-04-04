# k-skill-proxy

`k-skill-proxy` - Fastify-прокси для бесплатных и публичных API, который пока используется как базовый серверный слой во время миграции `ru-skill` на российские и русскоязычные сценарии.

Сейчас пакет в основном обслуживает legacy-кейс с AirKorea и fine dust, но его архитектура рассчитана на добавление других read-only adapter'ов с узкой allowlist-поверхностью.

## Текущие endpoint'ы

- `GET /health`
- `GET /v1/fine-dust/report`
- `GET /B552584/:service/:operation`

`/B552584/:service/:operation` ограничен allowlist-набором AirKorea маршрутов и не является общим произвольным проксированием.

## Переменные окружения

- `AIR_KOREA_OPEN_API_KEY` - upstream-ключ для AirKorea на стороне сервера
- `KSKILL_PROXY_HOST` - по умолчанию `127.0.0.1`
- `KSKILL_PROXY_PORT` - по умолчанию `4020`
- `KSKILL_PROXY_CACHE_TTL_MS` - по умолчанию `300000`
- `KSKILL_PROXY_RATE_LIMIT_WINDOW_MS` - по умолчанию `60000`
- `KSKILL_PROXY_RATE_LIMIT_MAX` - по умолчанию `60`
- `KSKILL_PROXY_NAME` - имя сервиса для `/health`, по умолчанию `k-skill-proxy`

Базовая политика пакета: бесплатный API proxy по умолчанию остаётся публичным и без аутентификации, но с узким списком маршрутов, кэшем и rate limit.

## Локальный запуск

```bash
node packages/k-skill-proxy/src/server.js
```

Перед запуском нужно подготовить переменные окружения, включая `AIR_KOREA_OPEN_API_KEY`, если нужен legacy fine-dust сценарий.

## Операционная модель

- upstream-ключи не выдаются клиенту
- клиент обращается только к прокси
- новые upstream'ы добавляются как узкие адаптеры для бесплатных API
- приоритет у read-only endpoint'ов с понятным источником данных

## Развёртывание

Для фонового запуска в репозитории используются `ecosystem.config.cjs` и `scripts/run-k-skill-proxy.sh`.

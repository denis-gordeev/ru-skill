# Гайд по `k-skill-proxy`

`k-skill-proxy` - это Fastify-прокси для бесплатных и публичных API, который сохраняется в `ru-skill` как базовая серверная заготовка для новых русскоязычных сценариев.

Сейчас в коде уже реализован legacy-адаптер для AirKorea и сводка по fine dust. Это не основной будущий фокус репозитория, но хороший референс того, как в проекте должен выглядеть безопасный read-only proxy.

## Для чего нужен прокси

- Хранить upstream API key только на стороне сервера
- Сужать наружную поверхность до allowlist-маршрутов
- Давать один стабильный endpoint для навыков и агентов
- Добавлять cache, rate limit и минимальную нормализацию ответа

Базовая схема остаётся такой:

```text
client/skill -> k-skill-proxy -> upstream public API
```

## Текущие endpoint'ы

- `GET /health`
- `GET /v1/fine-dust/report`
- `GET /B552584/:service/:operation`

Последний маршрут ограничен allowlist-набором AirKorea операций и нужен только для legacy-сценариев.

## Рекомендуемые переменные окружения

На стороне клиента:

- `KSKILL_PROXY_BASE_URL=https://k-skill-proxy.nomadamas.org`

На стороне сервера:

- `AIR_KOREA_OPEN_API_KEY=...`
- `KSKILL_PROXY_HOST=127.0.0.1`
- `KSKILL_PROXY_PORT=4020`
- `KSKILL_PROXY_CACHE_TTL_MS=300000`
- `KSKILL_PROXY_RATE_LIMIT_WINDOW_MS=60000`
- `KSKILL_PROXY_RATE_LIMIT_MAX=60`

## Политика по безопасности и доступу

- Прокси в этом репозитории предназначен только для бесплатных API.
- Базовый режим: публичный read-only endpoint без proxy auth.
- Безопасность достигается не авторизацией "на всякий случай", а узкой allowlist-поверхностью, кэшем и rate limit.
- Если появится злоупотребление или операционные проблемы, ограничения можно усилить отдельным изменением.

## Локальный запуск

```bash
node packages/k-skill-proxy/src/server.js
```

Перед запуском нужно экспортировать переменные окружения вручную или загрузить их из своего локального секрета.

## Развёртывание через PM2

В репозитории уже подготовлены:

- `ecosystem.config.cjs`
- `scripts/run-k-skill-proxy.sh`

Типовой порядок:

1. `pm2 start ecosystem.config.cjs`
2. `pm2 save`
3. `pm2 startup`
4. Привязать внешний ingress или tunnel к `http://localhost:4020`

## Как использовать существующий legacy endpoint

Сводка по fine dust:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/v1/fine-dust/report' \
  --data-urlencode 'regionHint=서울 강남구'
```

AirKorea passthrough:

```bash
curl -fsS --get 'https://k-skill-proxy.nomadamas.org/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty' \
  --data-urlencode 'returnType=json' \
  --data-urlencode 'numOfRows=1' \
  --data-urlencode 'pageNo=1' \
  --data-urlencode 'stationName=강남구' \
  --data-urlencode 'dataTerm=DAILY' \
  --data-urlencode 'ver=1.4'
```

## Как использовать прокси в новых русскоязычных сценариях

- Добавлять только публичные и бесплатные upstream-источники.
- Сначала фиксировать источник и ограничения в [docs/sources.md](/Users/denis/programming/autowork/ru-skill/docs/sources.md).
- Затем добавлять узкий endpoint вместо общего универсального passthrough, если это возможно.
- По умолчанию нормализовать ответы на русском там, где это улучшает UX и не скрывает важные поля upstream.

## Ограничения текущей реализации

- Прокси ещё завязан на legacy-название `k-skill-proxy`.
- Единственный полностью реализованный upstream сейчас - AirKorea.
- Русскоязычные proxy-адаптеры пока не добавлены и остаются задачей следующих раундов разработки.

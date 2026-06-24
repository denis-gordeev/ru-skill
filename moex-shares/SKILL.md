---
name: moex-shares
description: Проверка публичных метаданных акций Московской биржи и задержанных рыночных снимков через официальный ISS API. Использовать, когда пользователь спрашивает данные по тикеру MOEX: SBER, GAZP, LKOH, размер лота, ISIN, предыдущее закрытие или текущий задержанный снимок цены.
license: MIT
metadata:
  category: finance
  locale: ru-RU
  phase: v1
---

# Акции Мосбиржи

## Что делает навык

Пакет `moex-shares` получает по публичному ISS API Московской биржи базовые метаданные акции и отложенный рыночный снимок по тикеру.

## Когда использовать

- "Покажи цену SBER на Московской бирже"
- "Какой ISIN у GAZP"
- "Дай размер лота и предыдущую цену для LKOH"
- "Покажи первые тикеры с основной доски TQBR"

## Предварительные условия

- Node.js 18+
- После публикации: `npm install -g moex-shares`
- Перед запуском: `export NODE_PATH="$(npm root -g)"`
- При разработке в этом репозитории: `npm install` в корне

## Входные данные

- Тикер MOEX, например `SBER`, `GAZP`, `LKOH`
- Необязательный идентификатор доски торгов, по умолчанию `TQBR`

## Рабочий процесс

### 0. Установить пакет глобально, если отсутствует

Если `node -e 'require("moex-shares")'` не проходит, сначала ставится пакет, а не собирается разовый запрос к ISS вручную.

```bash
npm install -g moex-shares
export NODE_PATH="$(npm root -g)"
```

### 1. Получить нормализованную сводку по тикеру

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { getSecurityOverview } = require("moex-shares");
getSecurityOverview("SBER").then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

### 2. Получить первую страницу акций на TQBR

```bash
NODE_PATH="$(npm root -g)" node - <<'JS'
const { listShares } = require("moex-shares");
listShares().then((result) => console.log(JSON.stringify(result, null, 2)));
JS
```

## Критерии завершения

- Подтверждён тикер MOEX и доска торгов
- Показаны ключевые поля: `shortName`, `isin`, `lotSize`
- Если нужен рынок, показаны `lastPrice`, `change`, `lastChangePercent` и время обновления

## Возможные ошибки

- Публичный ISS может вернуть задержанные данные, а не в реальном времени
- Для несуществующего тикера или неподдерживаемой доски ответ может быть пустым или с ошибкой HTTP

## Примечания

- Навык работает только в режиме чтения
- Пользовательские секреты не нужны

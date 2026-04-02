# Установка

## Базовый сценарий установки

Рекомендуемый порядок такой.

1. Сначала установить весь текущий набор навыков из репозитория.
2. Затем запустить `k-skill-setup` и завершить общую настройку окружения.
3. После этого вызывать только нужные прикладные навыки.

Установку не делим на отдельные ветки только из-за авторизации. Базовый подход такой: сначала ставится весь комплект, а подготовка секретов и переменных окружения передаётся `k-skill-setup`.

## Если поручить установку агенту

В Codex или Claude Code можно вставить эту фразу без изменений.

```text
Прочитай документацию по установке в этом репозитории и сначала установи все доступные навыки. После установки используй навык k-skill-setup, чтобы проверить credential и переменные окружения. В конце коротко перечисли установленные навыки и следующий шаг.
```

## Ручная установка

Достаточно любого из этих трёх вариантов команды `skills`.

```bash
npx --yes skills add denis-gordeev/ru-skill --list
pnpm dlx skills add denis-gordeev/ru-skill --list
bunx skills add denis-gordeev/ru-skill --list
```

Рекомендуется сначала поставить весь набор навыков.

```bash
npx --yes skills add denis-gordeev/ru-skill --all -g
```

После установки запустите `k-skill-setup` для общей настройки.

```text
Используй навык k-skill-setup и выполни общую настройку окружения.
```

Точечную установку имеет смысл делать только если это действительно нужно, например для быстрого теста read-only-навыков.

```bash
npx --yes skills add denis-gordeev/ru-skill \
  --skill hwp \
  --skill kbo-results \
  --skill kleague-results \
  --skill toss-securities \
  --skill lotto-results \
  --skill kakaotalk-mac \
  --skill fine-dust-location \
  --skill daiso-product-search \
  --skill blue-ribbon-nearby \
  --skill kakao-bar-nearby \
  --skill zipcode-search \
  --skill delivery-tracking
```

Если ставите только навыки с авторизацией, `k-skill-setup` всё равно должен идти вместе с ними.

```bash
npx --yes skills add denis-gordeev/ru-skill \
  --skill k-skill-setup \
  --skill srt-booking \
  --skill ktx-booking \
  --skill seoul-subway-arrival \
  --skill fine-dust-location
```

Проверка полной установки прямо из локального репозитория:

```bash
npx --yes skills add . --all -g
```

## Локальная проверка

Проверка списка навыков из текущего каталога:

```bash
npx --yes skills add . --list
```

Проверка, что установка действительно отразилась в глобальном списке:

```bash
npx --yes skills ls -g
```

Если нужно проверить ещё и пакеты с релизной конфигурацией:

```bash
npm install
npm run ci
```

## Что делать, если зависимостей нет

Если для навыка не хватает Node/Python-пакетов, базовое правило простое: сначала пробуем штатную глобальную установку, а не изобретаем обходной путь.

### Node-пакеты

```bash
npm install -g @ohah/hwpjs kbo-game kleague-results toss-securities k-lotto
export NODE_PATH="$(npm root -g)"
```

### Бинарники для macOS

`kakaotalk-mac` ставится не через npm, а через Homebrew tap.

```bash
brew install silver-flight-group/tap/kakaocli
brew tap JungHoonGhae/tossinvest-cli
brew install tossctl
```

### Python-пакеты

```bash
python3 -m pip install SRTrain korail2 pycryptodome
```

Если глобальная установка заблокирована политиками ОС или правами доступа, не подменяйте её самодельной альтернативой. Сначала нужно явно объяснить пользователю причину блокировки и только потом выбрать следующий шаг.

## Если нет даже `npx`

Если отсутствуют `npx`, `pnpm dlx` и `bunx`, сначала нужен runtime из экосистемы Node.js.

- Для `npx` нужны Node.js и npm
- Для `pnpm dlx` нужен pnpm
- Для `bunx` нужен Bun

## Навыки, которым нужен setup

Перед запуском этих навыков сначала пройдите через `k-skill-setup`:

- `srt-booking`
- `ktx-booking`
- `seoul-subway-arrival`
- `fine-dust-location`

Связанные документы:

- [Общая настройка](setup.md)
- [Политика секретов](security-and-secrets.md)

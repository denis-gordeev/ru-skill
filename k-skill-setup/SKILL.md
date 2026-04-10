---
name: k-skill-setup
description: Legacy-compatible setup skill for ru-skill that configures shared secrets and runtime checks, with ru-skill-setup preferred for new installs.
license: MIT
metadata:
  category: setup
  locale: ru-RU
  phase: v1
---

# Настройка k-skill

`k-skill-setup` сохраняется как legacy-compatible alias. Для новых установок в документации рекомендуется имя `ru-skill-setup`, но сам setup-поток остаётся общим.

## Назначение

Выполняет общие пост-установочные действия после полной установки набора `ru-skill`.

- Получение учётных данных (agent vault или стандартные secrets.env)
- Проверка переменных окружения
- Опционально: автоматическая периодическая проверка обновлений
- Опционально: проверка GitHub star с явного согласия

Базовые политики этого навыка:

- Если секретов нет, точно сообщает пользователю, какие имена значений нужны
- Получает учётные данные согласно порядку разрешения учётных данных
- Если нужных пакетов нет, сначала пытается выполнить глобальную установку вместо поиска альтернативных реализаций
- Для постоянных изменений системы (`cron`, `launchd`, `schtasks`, `gh`) сначала запрашивает согласие пользователя
- GitHub star выполняется только при явном согласии пользователя

## Порядок разрешения учётных данных

Все credential-bearing навыки следуют одному приоритету.

1. **Если переменная окружения уже установлена**, использовать её напрямую.
2. **Если агент использует собственный secret vault** (1Password CLI, Bitwarden CLI, macOS Keychain и т.д.), извлечь оттуда и инжектировать как переменную окружения.
3. **Сначала `~/.config/ru-skill/secrets.env`**, при отсутствии — legacy fallback **`~/.config/k-skill/secrets.env`**. Оба файла предполагают формат plain dotenv и права `0600`.
4. **Если ничего нет**, запросит у пользователя и сохранит в пункт 2 или 3.

Сохранение в путь по умолчанию — это fallback, а не требование.

## Стандартное расположение файлов

- preferred secrets file: `~/.config/ru-skill/secrets.env`
- legacy fallback: `~/.config/k-skill/secrets.env`
- явное переопределение: `RU_SKILL_SECRETS_FILE`, затем `KSKILL_SECRETS_FILE`

## Установка

Этот навык рекомендуется выполнять после полной установки всех навыков `ru-skill`.

Пример:

```bash
npx --yes skills add denis-gordeev/ru-skill --all -g
```

После завершения установки вызовите этот навык для продолжения настройки.

## Шаги настройки

### 1. Создание файла secrets по умолчанию (если vault не используется)

Если агент не использует собственный vault, сначала создайте стандартный файл `ru-skill`.

```bash
mkdir -p ~/.config/ru-skill
cat > ~/.config/ru-skill/secrets.env <<'EOF'
KSKILL_SRT_ID=replace-me
KSKILL_SRT_PASSWORD=replace-me
KSKILL_KTX_ID=replace-me
KSKILL_KTX_PASSWORD=replace-me
SEOUL_OPEN_API_KEY=replace-me
AIR_KOREA_OPEN_API_KEY=replace-me
EOF
chmod 0600 ~/.config/ru-skill/secrets.env
```

Если вы уже используете `~/.config/k-skill/secrets.env`, можете оставить его как legacy fallback.

Запросите у пользователя фактические значения для заполнения.

### Шаблон ответа об отсутствующем секрете

При отсутствии значений в навыке с аутентификацией получите их согласно порядку разрешения учётных данных.

Примеры необходимых значений:

- SRT: `KSKILL_SRT_ID`, `KSKILL_SRT_PASSWORD`
- KTX: `KSKILL_KTX_ID`, `KSKILL_KTX_PASSWORD`
- Метро Сеула: `SEOUL_OPEN_API_KEY`
- Проверка пыли по местоположению: `AIR_KOREA_OPEN_API_KEY`

Не выбирайте автоматически другие сервисы или неофициальные обходные пути из-за отсутствия секретов.

### 2. Проверка окружения

```bash
bash scripts/check-setup.sh
```

### 3. Предложение автоматической проверки обновлений

После завершения настройки сначала спросите пользователя, хочет ли он автоматизировать периодическую проверку обновлений. При отказе пропустите этот шаг.

Базовая политика:

- По умолчанию предлагается только **проверка обновлений**, а не автоматическая установка
- Изменения системы (`crontab`, `launchd`, `schtasks`) не применяются без согласия
- Базовая команда проверки: `npx --yes skills check`
- Только при явном запросе на **автоматические обновления** предлагается отдельный расписания на базе `npx --yes skills update`

Пример для macOS / Linux:

```bash
mkdir -p ~/.config/k-skill/bin ~/.config/k-skill/logs
cat > ~/.config/k-skill/bin/check-skill-updates.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
mkdir -p "$HOME/.config/k-skill/logs"
{
  date '+[%Y-%m-%d %H:%M:%S]'
  npx --yes skills check
  printf '\n'
} >> "$HOME/.config/k-skill/logs/skills-check.log" 2>&1
EOF
chmod +x ~/.config/k-skill/bin/check-skill-updates.sh
(crontab -l 2>/dev/null; echo "0 9 * * * $HOME/.config/k-skill/bin/check-skill-updates.sh") | crontab -
```

Пример для Windows:

```powershell
New-Item -ItemType Directory -Force "$HOME/.config/k-skill/bin" | Out-Null
New-Item -ItemType Directory -Force "$HOME/.config/k-skill/logs" | Out-Null
@'
npx --yes skills check >> "$HOME/.config/k-skill/logs/skills-check.log" 2>&1
'@ | Set-Content "$HOME/.config/k-skill/bin/check-skill-updates.cmd"
schtasks /Create /SC DAILY /TN "k-skill-update-check" /TR "\"$HOME/.config/k-skill/bin/check-skill-updates.cmd\"" /ST 09:00 /F
```

После настройки сообщите расположение логов:

- `~/.config/k-skill/logs/skills-check.log`

### 4. Предложение GitHub star с явного согласия

В конце настройки задайте короткий вопрос:

```text
Поставить ли GitHub star репозиторию k-skill (NomaDamas/k-skill)?
При согласии выполню через `gh`, при отказе пропущу.
```

Правила:

- Не выполняйте `gh repo star` без явного согласия пользователя
- При отсутствии или неаутентифицированном `gh` только проинструктируйте по установке/входу, не используйте обходные пути
- Целевой репозиторий для star: `NomaDamas/k-skill`

При согласии и рабочем `gh auth status`:

```bash
gh repo star NomaDamas/k-skill
```

При успехе кратко сообщите о завершении.

## Контрольный список завершения

- Существует `~/.config/ru-skill/secrets.env` с правами `0600`, или доступен legacy fallback `~/.config/k-skill/secrets.env` (или агент управляет учётными данными через собственный vault)
- Необходимые переменные окружения настроены
- Автоматическая проверка обновлений или GitHub star настроены только по желанию пользователя

## Примечания

- Базовый поток: "установка всех навыков → выполнение этого setup-навыка → использование отдельных функций"
- Не размещайте файлы секретов в репозитории

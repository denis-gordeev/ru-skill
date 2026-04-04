# Общая настройка

После установки полного набора `ru-skill` именно эта процедура подготавливает навыки, которым нужны секреты или API-ключи, например `srt-booking`, `ktx-booking`, `seoul-subway-arrival` и `fine-dust-location`.

## Порядок разрешения credential

Все навыки, которым нужны секреты, придерживаются одного и того же порядка.

1. Если значение уже есть в переменной окружения, используется оно.
2. Если агент работает с собственным secret vault, например 1Password CLI, Bitwarden CLI или macOS Keychain, секрет можно достать оттуда и пробросить в окружение.
3. Если vault нет, сначала используется `~/.config/ru-skill/secrets.env`, а при его отсутствии допускается legacy fallback `~/.config/k-skill/secrets.env`; оба файла должны быть в формате dotenv с правами `0600`.
4. Если значения нет нигде, агент должен запросить его у пользователя и сохранить через вариант 2 или 3.

Если у агента уже есть штатный secret vault, этап с fallback-файлом можно пропустить.

## Настройка через стандартный путь

Если отдельного vault нет, создайте стандартный fallback-файл.

```bash
mkdir -p ~/.config/ru-skill
cat > ~/.config/ru-skill/secrets.env <<'EOF'
KSKILL_SRT_ID=replace-me
KSKILL_SRT_PASSWORD=replace-me
KSKILL_KTX_ID=replace-me
KSKILL_KTX_PASSWORD=replace-me
SEOUL_OPEN_API_KEY=replace-me
AIR_KOREA_OPEN_API_KEY=replace-me
KSKILL_PROXY_BASE_URL=https://k-skill-proxy.nomadamas.org
EOF
chmod 0600 ~/.config/ru-skill/secrets.env
```

Заполните файл реальными значениями.

Если у вас уже есть legacy-файл `~/.config/k-skill/secrets.env`, его можно оставить: скрипты репозитория сначала смотрят `~/.config/ru-skill/secrets.env`, затем fallback-ятся на legacy-путь. Для явного переопределения используются `RU_SKILL_SECRETS_FILE` и `KSKILL_SECRETS_FILE`.

## Проверка

```bash
bash scripts/check-setup.sh
```

## Если секрета не хватает

Если у навыка с авторизацией нет нужного значения, агент не должен искать неофициальный обходной путь. Нужно действовать по порядку разрешения credential.

- Явно назвать отсутствующую переменную окружения.
- Объяснить пользователю, как получить или сохранить её через vault либо `secrets.env`.

## Какие значения нужны конкретным навыкам

| Навык | Нужные значения |
| --- | --- |
| `srt-booking` | `KSKILL_SRT_ID`, `KSKILL_SRT_PASSWORD` |
| `ktx-booking` | `KSKILL_KTX_ID`, `KSKILL_KTX_PASSWORD` |
| `seoul-subway-arrival` | `SEOUL_OPEN_API_KEY` |
| `fine-dust-location` | `KSKILL_PROXY_BASE_URL` или `AIR_KOREA_OPEN_API_KEY` |

## Что читать дальше

- [Гайд по SRT](features/srt-booking.md)
- [Гайд по KTX](features/ktx-booking.md)
- [Гайд по метро Сеула](features/seoul-subway-arrival.md)
- [Гайд по fine dust](features/fine-dust-location.md)
- [Политика секретов](security-and-secrets.md)

Базовый поток остаётся таким: сначала установка полного набора, потом общая настройка, потом запуск нужных навыков.

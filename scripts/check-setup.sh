#!/usr/bin/env bash
set -euo pipefail

default_ru_skill_secrets_file="$HOME/.config/ru-skill/secrets.env"
default_legacy_secrets_file="$HOME/.config/k-skill/secrets.env"

resolve_secrets_file() {
  if [[ $# -gt 0 && -n "${1:-}" ]]; then
    printf '%s\n' "$1"
    return
  fi

  if [[ -n "${RU_SKILL_SECRETS_FILE:-}" ]]; then
    printf '%s\n' "$RU_SKILL_SECRETS_FILE"
    return
  fi

  if [[ -n "${KSKILL_SECRETS_FILE:-}" ]]; then
    printf '%s\n' "$KSKILL_SECRETS_FILE"
    return
  fi

  if [[ -f "$default_ru_skill_secrets_file" ]]; then
    printf '%s\n' "$default_ru_skill_secrets_file"
    return
  fi

  printf '%s\n' "$default_legacy_secrets_file"
}

secrets_file="$(resolve_secrets_file "${1:-}")"

missing=0

if [[ ! -f "$secrets_file" ]]; then
  echo "Файл secrets не найден: $secrets_file"
  missing=1
else
  perms=$(stat -f '%Lp' "$secrets_file" 2>/dev/null || stat -c '%a' "$secrets_file" 2>/dev/null)
  if [[ "$perms" != "600" ]]; then
    echo "Небезопасные права доступа для $secrets_file: $perms (ожидается 600)"
    missing=1
  fi
fi

if [[ "$missing" -ne 0 ]]; then
  cat <<EOF
Следующие шаги:
  1. создайте ~/.config/ru-skill/secrets.env со своими учётными данными
  2. выполните chmod 0600 ~/.config/ru-skill/secrets.env
  3. добавляйте KSKILL_PROXY_BASE_URL только если нужно переопределить адрес конечной точки fine-dust
  4. либо направьте RU_SKILL_SECRETS_FILE / KSKILL_SECRETS_FILE на существующий файл окружения (dotenv)
  5. запустите эту проверку ещё раз
EOF
  exit 1
fi

echo "Конфигурация ru-skill выглядит рабочей: $secrets_file"

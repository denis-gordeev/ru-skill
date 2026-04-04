#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_RU_SKILL_SECRETS_FILE="$HOME/.config/ru-skill/secrets.env"
DEFAULT_LEGACY_SECRETS_FILE="$HOME/.config/k-skill/secrets.env"

resolve_secrets_file() {
  if [[ -n "${RU_SKILL_SECRETS_FILE:-}" ]]; then
    printf '%s\n' "$RU_SKILL_SECRETS_FILE"
    return
  fi

  if [[ -n "${KSKILL_SECRETS_FILE:-}" ]]; then
    printf '%s\n' "$KSKILL_SECRETS_FILE"
    return
  fi

  if [[ -f "$DEFAULT_RU_SKILL_SECRETS_FILE" ]]; then
    printf '%s\n' "$DEFAULT_RU_SKILL_SECRETS_FILE"
    return
  fi

  printf '%s\n' "$DEFAULT_LEGACY_SECRETS_FILE"
}

SECRETS_FILE="$(resolve_secrets_file)"

if [[ -f "$SECRETS_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$SECRETS_FILE"
  set +a
fi

cd "$ROOT_DIR"
exec node packages/k-skill-proxy/src/server.js

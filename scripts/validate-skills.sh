#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status=0

while IFS= read -r -d '' skill_dir; do
  skill_name="$(basename "$skill_dir")"
  skill_file="$skill_dir/SKILL.md"

  if [[ ! -f "$skill_file" ]]; then
    echo "Не найден SKILL.md: $skill_name"
    status=1
    continue
  fi

  if ! head -n 1 "$skill_file" | grep -qx -- "---"; then
    echo "Не найдено начало frontmatter: $skill_file"
    status=1
  fi

  if ! grep -q '^name: ' "$skill_file"; then
    echo "Не найдено поле name: $skill_file"
    status=1
  fi

  if ! grep -q '^description: ' "$skill_file"; then
    echo "Не найдено поле description: $skill_file"
    status=1
  fi

  declared_name="$(sed -n 's/^name: //p' "$skill_file" | head -n 1 | tr -d '"')"
  if [[ "$declared_name" != "$skill_name" ]]; then
    echo "Несовпадение name: $skill_file объявляет '$declared_name', а каталог называется '$skill_name'"
    status=1
  fi
done < <(
  find "$root" -mindepth 1 -maxdepth 1 -type d \
    ! -name '.*' \
    ! -name .git \
    ! -name .github \
    ! -name .omx \
    ! -name .changeset \
    ! -name data \
    ! -name docs \
    ! -name inbox \
    ! -name node_modules \
    ! -name packages \
    ! -name python-packages \
    ! -name scripts \
    ! -name tg \
    ! -name examples \
    -print0
)

if [[ "$status" -ne 0 ]]; then
  exit "$status"
fi

echo "Структура навыков выглядит корректной"

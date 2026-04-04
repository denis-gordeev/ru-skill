from __future__ import annotations

import os
from pathlib import Path

DEFAULT_RU_SKILL_SECRETS_FILE = Path.home() / ".config" / "ru-skill" / "secrets.env"
DEFAULT_LEGACY_SECRETS_FILE = Path.home() / ".config" / "k-skill" / "secrets.env"
DEFAULT_SECRETS_FILES = (
    DEFAULT_RU_SKILL_SECRETS_FILE,
    DEFAULT_LEGACY_SECRETS_FILE,
)


def iter_secret_files() -> tuple[Path, ...]:
    return DEFAULT_SECRETS_FILES


def parse_dotenv_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].lstrip()
        if "=" not in line:
            continue

        key, raw_value = line.split("=", 1)
        key = key.strip()
        value = raw_value.strip()
        if not key:
            continue
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value

    return values


def resolve_secret_value(name: str) -> str | None:
    value = os.environ.get(name)
    if value and value != "replace-me":
        return value

    for path in iter_secret_files():
        candidate = parse_dotenv_file(path).get(name)
        if candidate and candidate != "replace-me":
            return candidate

    return None


def build_missing_secret_message(names: list[str] | tuple[str, ...]) -> str:
    joined = ", ".join(names)
    return (
        f"Для этой операции нужны переменные окружения: {joined}. "
        f"Если они не заданы, сначала добавьте их в {DEFAULT_RU_SKILL_SECRETS_FILE}, "
        f"затем при необходимости используйте legacy fallback {DEFAULT_LEGACY_SECRETS_FILE} "
        "или секретное хранилище агента."
    )

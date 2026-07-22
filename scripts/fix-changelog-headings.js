#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const headingReplacements = {
  "### Major Changes": "### Крупные изменения",
  "### Minor Changes": "### Незначительные изменения",
  "### Patch Changes": "### Исправления",
};

const packagesDir = path.join(__dirname, "..", "packages");

if (!fs.existsSync(packagesDir)) {
  console.error("Каталог пакетов не найден:", packagesDir);
  process.exitCode = 1;
} else {
  let processed = 0;
  let unchanged = 0;

  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const changelogPath = path.join(packagesDir, entry.name, "CHANGELOG.md");
    if (!fs.existsSync(changelogPath)) continue;

    let content;
    try {
      content = fs.readFileSync(changelogPath, "utf8");
    } catch (err) {
      console.error("Не удалось прочитать:", changelogPath, err.message);
      continue;
    }

    let modified = false;

    for (const [english, russian] of Object.entries(headingReplacements)) {
      if (content.includes(english)) {
        content = content.replaceAll(english, russian);
        modified = true;
      }
    }

    if (modified) {
      try {
        fs.writeFileSync(changelogPath, content, "utf8");
        processed += 1;
      } catch (err) {
        console.error("Не удалось записать:", changelogPath, err.message);
      }
    } else {
      unchanged += 1;
    }
  }

  if (processed > 0) {
    console.log(`Заголовки CHANGELOG русифицированы: ${processed} файл(ов) обновлено, ${unchanged} без изменений.`);
  } else {
    console.log(`Все заголовки CHANGELOG уже на русском (${unchanged} файл(ов) без изменений).`);
  }
}

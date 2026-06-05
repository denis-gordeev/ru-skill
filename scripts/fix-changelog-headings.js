#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const headingReplacements = {
  "### Major Changes": "### Крупные изменения",
  "### Minor Changes": "### Незначительные изменения",
  "### Patch Changes": "### Исправления",
};

const packagesDir = path.join(__dirname, "..", "packages");

for (const entry of fs.readdirSync(packagesDir)) {
  const changelogPath = path.join(packagesDir, entry, "CHANGELOG.md");
  if (!fs.existsSync(changelogPath)) continue;

  let content = fs.readFileSync(changelogPath, "utf8");
  let modified = false;

  for (const [english, russian] of Object.entries(headingReplacements)) {
    if (content.includes(english)) {
      content = content.replaceAll(english, russian);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(changelogPath, content, "utf8");
  }
}

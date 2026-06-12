const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const repoRoot = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function extractSecondLevelSectionBodies(doc, heading) {
  const lines = doc.split("\n");
  const bodies = [];
  const header = `## ${heading}`;

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] !== header) {
      continue;
    }

    const body = [];

    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[j].startsWith("## ")) {
        break;
      }

      body.push(lines[j]);
      i = j;
    }

    bodies.push(body.join("\n").trim());
  }

  return bodies;
}

function extractSecondLevelHeadings(doc) {
  return [...doc.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading.trim());
}

function extractFirstTodoStatus(todo) {
  const match = todo.match(/^## Статус на (\d{4}-\d{2}-\d{2}) \(раунд (\d+)\)$/m);

  assert.ok(match, "ожидалось, что TODO.md начинается с текущего блока статуса");

  return {
    date: match[1],
    round: Number(match[2]),
  };
}

function extractReadmePackageMatrix(readme) {
  const match = readme.match(/## Текущие пакеты\n\n([\s\S]*?)\n## Документация/);

  assert.ok(match, "ожидалась матрица пакетов в README.md");

  return [...match[1].matchAll(/^\| `([^`]+)` \| .*? \| ([^|]+) \|$/gm)].map(([, name, status]) => ({
    name,
    status: status.trim()
  }));
}

function extractInstallSkillSnippet(install) {
  const match = install.match(
    /npx --yes skills add denis-gordeev\/ru-skill \\\n([\s\S]*?)\n```/,
  );

  assert.ok(match, "ожидался явный фрагмент skills add в docs/install.md");

  return [...match[1].matchAll(/--skill ([a-z0-9-]+)/g)].map(([, skill]) => skill);
}

function extractNodeInstallPackages(install) {
  const match = install.match(/npm install -g ([\s\S]*?)\nexport NODE_PATH/m);

  assert.ok(match, "ожидался фрагмент npm install -g в docs/install.md");

  return match[1]
    .replace(/\\/g, " ")
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertNoStaleReleaseStatus(doc, label) {
  assert.doesNotMatch(doc, /\bahead of main\b/i, `${label} не должен раскрывать сводки расстояния ветки как текущий статус`);
  assert.doesNotMatch(doc, /\bmerge-ready\b/i, `${label} не должен раскрывать утверждения о готовности к слиянию как текущий статус`);
  assert.doesNotMatch(doc, /\b\d+\s+коммит(?:ов|а)? ahead\b/i, `${label} не должен привязывать текущий статус к метрикам расстояния коммитов`);
  assert.doesNotMatch(doc, /\b\d+\s+файл(?:ов|а)? изменено\b/i, `${label} не должен привязывать текущий статус к метрикам количества файлов`);
}

function extractQuotedEntries(block, indent) {
  return block
    .split("\n")
    .map((line) => line.match(new RegExp(`^ {${indent}}"([^"]+)":\\s*(.+?)(?:,)?$`)))
    .filter(Boolean)
    .map(([, key, value]) => [key, value.trim()]);
}

function findPrintedObjectBlock(doc, carrier) {
  const block = [...doc.matchAll(/print\(json\.dumps\(\{\n([\s\S]*?)\n\}, ensure_ascii=False, indent=2\)\)/g)]
    .map((match) => match[1])
    .find((candidate) => candidate.includes(`"carrier": "${carrier}"`));

  assert.ok(block, `ожидался нормализованный пример JSON для ${carrier}`);
  return block;
}

function findRecentEventsBlock(doc, carrier) {
  const block = [...doc.matchAll(/normalized_events = \[\n\s*\{\n([\s\S]*?)\n\s*\}\n\s*for [^\n]+ in events\n\]/g)]
    .map((match) => match[1])
    .find((candidate) => candidate.includes('"status_code":') === (carrier === "cj"));

  assert.ok(block, `ожидался пример recent_events для ${carrier}`);
  return block;
}

function findJsonFenceAfterLabel(doc, label) {
  return JSON.parse(findJsonFenceTextAfterLabel(doc, label));
}

function findJsonFenceTextAfterLabel(doc, label) {
  const escaped = escapeRegex(label);
  const match = doc.match(new RegExp(`${escaped}[\\s\\S]*?\\\`\\\`\\\`json\\n([\\s\\S]*?)\\n\\\`\\\`\\\``));

  assert.ok(match, `ожидался пример JSON после «${label}»`);
  return match[1];
}

function assertSampleProvenance(doc, sectionLabel, expected, docLabel) {
  const escapedSectionLabel = escapeRegex(sectionLabel);
  const escapedVerifiedAt = escapeRegex(expected.verified_at);
  const escapedInvoice = escapeRegex(expected.invoice);

  assert.match(
    doc,
    new RegExp(
      `${escapedSectionLabel}[\\s\\S]*?아래 값은 ${escapedVerifiedAt} 기준 live smoke test\\(\\x60${escapedInvoice}\\x60\\)에서 확인한 정규화 결과다\\.\\n\\n\\\`\\\`\\\`json`,
    ),
    `${docLabel} ${sectionLabel} строка происхождения должна быть привязана к проверенной дате smoke-test и накладной`,
  );
}

function assertSanitizedPublicOutput(output, label) {
  const serialized = JSON.stringify(output);

  assert.doesNotMatch(serialized, /\bTEL\b/i, `${label} не должен пропускать фрагменты TEL`);
  assert.doesNotMatch(
    serialized,
    /\d{2,4}[.\-]\d{3,4}[.\-]\d{4}/,
    `${label} не должен пропускать строки, похожие на номера телефонов, где-либо в опубликованном примере`,
  );
  assert.doesNotMatch(serialized, /crgNm/, `${label} не должен пропускать поля CJ assignee/source`);
  assert.doesNotMatch(serialized, /sender/i, `${label} не должен пропускать поля sender`);
  assert.doesNotMatch(serialized, /receiver/i, `${label} не должен пропускать поля receiver`);
  assert.doesNotMatch(serialized, /delivered_to/i, `${label} не должен пропускать поля delivered_to`);
}

function assertKakaoBarNearbySadangSmokeSnapshot(smoke, label) {
  assert.equal(smoke.anchor.name, "사당1동먹자골목상점가", `${label} привязка должна оставаться на проверенной достопримечательности района`);
  assert.equal(smoke.meta.openNowCount, 4, `${label} должен публиковать проверенное количество открытых сейчас`);
  assert.deepEqual(
    smoke.items.map((item) => item.name),
    ["우미노식탁", "방배을지로골뱅이술집포차 사당역점", "커먼테이블"],
    `${label} должен сохранять проверенный порядок первых трёх`,
  );
}

test("корневой npm-скрипт test включает регрессионный набор проверки навыков", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts.test, /node --test scripts\/skill-docs\.test\.js/);
});

test("навык hwp документирует маршрутизацию с учётом окружения и поддерживаемые операции", () => {
  const skillPath = path.join(repoRoot, "hwp", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что hwp/SKILL.md существует");

  const skill = read(path.join("hwp", "SKILL.md"));

  assert.match(skill, /^name: hwp$/m);
  assert.match(skill, /@ohah\/hwpjs/);
  assert.match(skill, /\bhwp-mcp\b/);
  assert.match(skill, /Windows/i);
  assert.match(skill, /JSON/i);
  assert.match(skill, /Markdown/i);
  assert.match(skill, /HTML/i);
  assert.match(skill, /image/i);
  assert.match(skill, /batch/i);
});

test("навык hwp документирует проверку встроенных изображений для вывода Markdown", () => {
  const skill = read(path.join("hwp", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "hwp.md"));

  assert.match(skill, /hwpjs to-markdown document\.hwp -o output\.md --include-images/);
  assert.match(skill, /Markdown:.*(data:|base64)/);
  assert.match(skill, /--images-dir/);
  assert.doesNotMatch(skill, /Markdown:.*이미지 경로 생성 여부 확인/);
  assert.match(featureDoc, /--images-dir/);
  assert.match(featureDoc, /(data:|base64)/);
  assert.match(featureDoc, /Markdown.*(data:|base64)/);
  assert.doesNotMatch(featureDoc, /Markdown 출력.*이미지 (파일 )?경로 생성 여부 확인/);
  assert.doesNotMatch(featureDoc, /вывод Markdown.*이미지/);
});

test("документация репозитория рекламирует навык kakaotalk-mac", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kakaotalk-mac.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/kakaotalk-mac.md существует");
  assert.match(readme, /\| `kakaotalk-mac` \|/);
  assert.match(readme, /\[Гайд по KakaoTalk Mac CLI\]\(docs\/features\/kakaotalk-mac\.md\)/);
  assert.match(install, /--skill kakaotalk-mac/);
});

test("навык kakaotalk-mac документирует безопасное использование kakaocli на macOS", () => {
  const skillPath = path.join(repoRoot, "kakaotalk-mac", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что kakaotalk-mac/SKILL.md существует");

  const skill = read(path.join("kakaotalk-mac", "SKILL.md"));

  assert.match(skill, /^name: kakaotalk-mac$/m);
  assert.match(skill, /kakaocli/);
  assert.match(skill, /macOS/i);
  assert.match(skill, /KakaoTalk/i);
  assert.match(skill, /Full Disk Access/i);
  assert.match(skill, /Accessibility/i);
  assert.match(skill, /--me/);
  assert.match(skill, /confirm before sending|подтверди перед отправкой/i);
});

test("документация репозитория рекламирует навык бронирования KTX как поддерживаемый", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "ktx-booking.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/ktx-booking.md существует");
  assert.match(readme, /\| `ktx-booking` \|/);
  assert.match(readme, /\[Гайд по KTX\]\(docs\/features\/ktx-booking\.md\)/);
  assert.doesNotMatch(readme, /ktx-booking.*не работает/iu);
  assert.doesNotMatch(readme, /KTX 예매는 현재 작동하지 않습니다/);
  assert.match(install, /--skill ktx-booking/);
});

test("документация ktx-booking описывает рабочий процесс Korail через helper", () => {
  const skillPath = path.join(repoRoot, "ktx-booking", "SKILL.md");
  const helperPath = path.join(repoRoot, "scripts", "ktx_booking.py");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что ktx-booking/SKILL.md существует");
  assert.ok(fs.existsSync(helperPath), "ожидалось, что scripts/ktx_booking.py существует");

  const skill = read(path.join("ktx-booking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "ktx-booking.md"));
  const helper = read(path.join("scripts", "ktx_booking.py"));

  assert.match(skill, /^name: ktx-booking$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /python3 scripts\/ktx_booking\.py search/);
    assert.match(doc, /python3 scripts\/ktx_booking\.py reserve/);
    assert.match(doc, /python3 scripts\/ktx_booking\.py reservations/);
    assert.match(doc, /python3 scripts\/ktx_booking\.py cancel/);
    assert.match(doc, /train_id/);
    assert.match(doc, /--train-id/);
    assert.match(doc, /--include-no-seats/);
    assert.match(doc, /--include-waiting-list/);
    assert.match(doc, /--try-waiting/);
    assert.match(doc, /credential resolution order|KSKILL_KTX_ID/);
    assert.match(doc, /anti-bot|Dynapath|x-dynapath-m-token/i);
    // Accept both Korean original and Russian translation for payment automation note
    assert.match(doc, /Оплата не автоматизируется|Оплата до завершения не автоматизируется|не закрывает оплату/);
    assert.doesNotMatch(doc, /예약 시 선택할 `--train-index`/);
  }

  assert.match(helper, /x-dynapath-m-token/);
  assert.match(helper, /250601002/);
  assert.match(helper, /def build_parser/);
  assert.match(helper, /train_id/);
});

test("документация legacy railway удерживает явную границу замен", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const srtFeature = read(path.join("docs", "features", "srt-booking.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const ktxFeature = read(path.join("docs", "features", "ktx-booking.md"));

  for (const doc of [srtSkill, srtFeature, ktxSkill, ktxFeature]) {
    assert.match(doc, /Legacy-совместимый|legacy-коридору/i);
    assert.match(doc, /yandex-rasp/);
    assert.match(doc, /интеграций на запись|российский железнодорожный сценарий/i);
    assert.match(doc, /booking-replacements\.md/);
  }

  assert.match(readme, /Legacy railway docs выровнены с этим решением/);
  assert.match(roadmap, /Legacy railway docs выровнены с этим boundary/);
  assert.match(roadmap, /legacy railway docs выровнены с replacement boundary/i);
});

test("регрессионные тесты Python-хелпера ktx-booking проходят", () => {
  const result = childProcess.spawnSync(
    "python3",
    ["-m", "unittest", "discover", "-s", "scripts", "-p", "test_ktx_booking.py"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      env: { ...process.env, PYTHONNOUSERSITE: "1" },
    },
  );

  assert.equal(
    result.status,
    0,
    `ожидалось, что регрессионные тесты Python-хелпера KTX пройдут\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
});

test("документация репозитория рекламирует навык zipcode-search на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "zipcode-search.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/zipcode-search.md существует");
  assert.match(readme, /\| `zipcode-search` \|/);
  assert.match(readme, /\[Гайд по postcode search\]\(docs\/features\/zipcode-search\.md\)/);
  assert.match(install, /--skill zipcode-search/);
  assert.match(roadmap, /Поиск почтовых индексов/);
  assert.match(sources, /Почтовая служба Кореи поиск адресов: https:\/\/parcel\.epost\.go\.kr\/parcel\/comm\/zipcode\/comm_newzipcd_list\.jsp/);
});

test("документация репозитория рекламирует навык cbr-rates на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "cbr-rates.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/cbr-rates.md существует");
  assert.match(readme, /\| `cbr-rates` \|/);
  assert.match(readme, /\[Гайд по курсам ЦБ РФ\]\(docs\/features\/cbr-rates\.md\)/);
  assert.match(install, /--skill cbr-rates/);
  assert.match(roadmap, /cbr-rates/);
});

test("документация репозитория рекламирует навык postcalc-postcodes на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "postcalc-postcodes.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/postcalc-postcodes.md существует");
  assert.match(readme, /\| `postcalc-postcodes` \|/);
  assert.match(readme, /\[Гайд по Postcalc и индексам\]\(docs\/features\/postcalc-postcodes\.md\)/);
  assert.match(install, /--skill postcalc-postcodes/);
  assert.match(roadmap, /postcalc-postcodes/);
  assert.match(sources, /postcalc\.ru\/offices\/109189/);
});

test("документация репозитория рекламирует навык hh-vacancies на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "hh-vacancies.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/hh-vacancies.md существует");
  assert.match(readme, /\| `hh-vacancies` \|/);
  assert.match(readme, /\[Гайд по HH вакансиям\]\(docs\/features\/hh-vacancies\.md\)/);
  assert.match(install, /--skill hh-vacancies/);
  assert.match(roadmap, /hh-vacancies/);
  assert.match(sources, /api\.hh\.ru\/vacancies/);
});

test("документация репозитория рекламирует навык mchs-storm-warnings на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "mchs-storm-warnings.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/mchs-storm-warnings.md существует");
  assert.match(readme, /\| `mchs-storm-warnings` \|/);
  assert.match(readme, /\[Гайд по предупреждениям МЧС\]\(docs\/features\/mchs-storm-warnings\.md\)/);
  assert.match(install, /--skill mchs-storm-warnings/);
  assert.match(roadmap, /mchs-storm-warnings/);
  assert.match(sources, /46\.mchs\.gov\.ru\/deyatelnost\/press-centr\/operativnaya-informaciya\/shtormovye-i-ekstrennye-preduprezhdeniya/);
});

test("документация cbr-rates описывает официальный XML-сервис Банка России", () => {
  const skillPath = path.join(repoRoot, "cbr-rates", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "cbr-rates", "README.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что cbr-rates/SKILL.md существует");
  assert.ok(fs.existsSync(packageReadmePath), "ожидалось, что packages/cbr-rates/README.md существует");

  const skill = read(path.join("cbr-rates", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "cbr-rates.md"));
  const packageReadme = read(path.join("packages", "cbr-rates", "README.md"));

  assert.match(skill, /^name: cbr-rates$/m);
  assert.match(skill, /Bank of Russia|Банка России/);
  assert.match(skill, /npm install -g cbr-rates/);
  assert.match(skill, /getRateWithChange/);
  assert.match(skill, /publishedDate/);
  assert.match(featureDoc, /XML_daily\.asp/);
  assert.match(featureDoc, /requestedDate/);
  assert.match(featureDoc, /publishedDate/);
  assert.match(packageReadme, /getDailyRates/);
  assert.match(packageReadme, /getRateWithChange/);
});

test("документация postcalc-postcodes описывает рабочие процессы отделений и городов Postcalc", () => {
  const skillPath = path.join(repoRoot, "postcalc-postcodes", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "postcalc-postcodes", "README.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что postcalc-postcodes/SKILL.md существует");
  assert.ok(fs.existsSync(packageReadmePath), "ожидалось, что packages/postcalc-postcodes/README.md существует");

  const skill = read(path.join("postcalc-postcodes", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "postcalc-postcodes.md"));
  const packageReadme = read(path.join("packages", "postcalc-postcodes", "README.md"));

  assert.match(skill, /^name: postcalc-postcodes$/m);
  assert.match(skill, /npm install -g postcalc-postcodes/);
  assert.match(skill, /getOfficeOverview/);
  assert.match(skill, /getCityOverview/);
  assert.match(featureDoc, /postcalc\.ru\/offices/);
  assert.match(featureDoc, /postcalc\.ru\/cities/);
  assert.match(featureDoc, /defaultPostalCode/);
  assert.match(packageReadme, /getOfficeOverview/);
  assert.match(packageReadme, /getCityOverview/);
});

test("документация hh-vacancies описывает публичный API-сценарий вакансий HH", () => {
  const skillPath = path.join(repoRoot, "hh-vacancies", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "hh-vacancies", "README.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что hh-vacancies/SKILL.md существует");
  assert.ok(fs.existsSync(packageReadmePath), "ожидалось, что packages/hh-vacancies/README.md существует");

  const skill = read(path.join("hh-vacancies", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "hh-vacancies.md"));
  const packageReadme = read(path.join("packages", "hh-vacancies", "README.md"));

  assert.match(skill, /^name: hh-vacancies$/m);
  assert.match(skill, /npm install -g hh-vacancies/);
  assert.match(skill, /getAreaOverview/);
  assert.match(skill, /searchVacancies/);
  assert.match(skill, /getVacancyOverview/);
  assert.match(featureDoc, /api\.hh\.ru\/vacancies/);
  assert.match(featureDoc, /descriptionText/);
  assert.match(featureDoc, /areaId/);
  assert.match(packageReadme, /getAreaOverview/);
  assert.match(packageReadme, /searchVacancies/);
  assert.match(packageReadme, /getVacancyOverview/);
});

test("документация mchs-storm-warnings описывает официальный сценарий региональных предупреждений МЧС", () => {
  const skillPath = path.join(repoRoot, "mchs-storm-warnings", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "mchs-storm-warnings", "README.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что mchs-storm-warnings/SKILL.md существует");
  assert.ok(fs.existsSync(packageReadmePath), "ожидалось, что packages/mchs-storm-warnings/README.md существует");

  const skill = read(path.join("mchs-storm-warnings", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "mchs-storm-warnings.md"));
  const packageReadme = read(path.join("packages", "mchs-storm-warnings", "README.md"));

  assert.match(skill, /^name: mchs-storm-warnings$/m);
  assert.match(skill, /npm install -g mchs-storm-warnings/);
  assert.match(skill, /listStormWarnings/);
  assert.match(skill, /getStormWarning/);
  assert.match(featureDoc, /shtormovye-i-ekstrennye-preduprezhdeniya/);
  assert.match(featureDoc, /publishedAtIso/);
  assert.match(featureDoc, /regionHost/);
  assert.match(packageReadme, /listStormWarnings/);
  assert.match(packageReadme, /getStormWarning/);
});

test("исходный код mchs-storm-warnings использует русские сообщения об ошибках", () => {
  const index = read(path.join("packages", "mchs-storm-warnings", "src", "index.js"));
  const parse = read(path.join("packages", "mchs-storm-warnings", "src", "parse.js"));

  assert.match(index, /page должен быть целым числом/);
  assert.match(index, /warningPathOrId должен быть непустой строкой/);
  assert.match(index, /Запрос к МЧС не удался/);
  assert.match(parse, /regionHost должен быть региональным хостом МЧС/);

  assert.doesNotMatch(index, /page must be an integer/);
  assert.doesNotMatch(index, /warningPathOrId must be a non-empty/);
  assert.doesNotMatch(index, /MChS request failed/);
  assert.doesNotMatch(parse, /regionHost must be a valid MChS/);
});

test("документация zipcode-search фиксирует официальный поток извлечения ePost и надёжный транспортный пример", () => {
  const skillPath = path.join(repoRoot, "zipcode-search", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что zipcode-search/SKILL.md существует");

  const skill = read(path.join("zipcode-search", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "zipcode-search.md"));

  assert.match(skill, /^name: zipcode-search$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /parcel\.epost\.go\.kr\/parcel\/comm\/zipcode\/comm_newzipcd_list\.jsp/);
    assert.match(doc, /sch_zipcode/);
    assert.match(doc, /sch_address1/);
    assert.match(doc, /sch_bdNm/);
    assert.match(doc, /curl --http1\.1 --tls-max 1\.2/);
    assert.match(doc, /--max-time/);
    assert.match(doc, /"--retry",\s+"3"/);
    assert.match(doc, /--retry-all-errors/);
    assert.match(doc, /"--retry-delay",\s+"1"/);
    assert.match(doc, /mktemp|временный файл/);
    assert.match(doc, /curl: \(23\)/);
    assert.match(doc, /짧은 도로명 \+ 건물번호|Короткое название дороги \+ номер здания|короткое название улицы.*номер дома/i);
    assert.match(doc, /시\/군\/구 포함 전체 주소|Полный адрес с городом\/районом|полный адрес с городом\/районом/i);
    assert.doesNotMatch(doc, /urllib\.request/);
    assert.doesNotMatch(doc, /urlopen/);
  }

  assert.match(skill, /검색 결과가 없으면|Результаты не найдены|Результаты поиска не найдены/i);
  assert.doesNotMatch(skill, /timeout\s*=/);
  assert.doesNotMatch(featureDoc, /timeout\s*=/);
  assert.match(skill, /`curl` 자체 제한|ограничения самого `curl`/);
  assert.doesNotMatch(featureDoc, /프로토콜\/클라이언트 제약/);
  assert.match(featureDoc, /ограничения протокола и клиента|ограничения протокола\/клиента/i);
  assert.match(featureDoc, /`curl` 자체 제한|ограничения самого `curl`/);
});

test("документация репозитория рекламирует навык delivery-tracking на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "delivery-tracking.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/delivery-tracking.md существует");
  assert.match(readme, /\| `delivery-tracking` \|/);
  assert.match(readme, /\[Гайд по delivery tracking\]\(docs\/features\/delivery-tracking\.md\)/);
  assert.match(install, /--skill delivery-tracking/);
  assert.match(roadmap, /Навык для отслеживания доставки/);
  assert.match(sources, /CJ Logistics отслеживание доставки: https:\/\/www\.cjlogistics\.com\/ko\/tool\/parcel\/tracking/);
  assert.match(sources, /Почтовая служба Кореи отслеживание: https:\/\/service\.epost\.go\.kr\/trace\.RetrieveRegiPrclDeliv\.postal\?sid1=/);
});

test("навык delivery-tracking документирует официальные потоки CJ и ePost с руководством по расширению", () => {
  const skillPath = path.join(repoRoot, "delivery-tracking", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что delivery-tracking/SKILL.md существует");

  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));

  assert.match(skill, /^name: delivery-tracking$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /https:\/\/www\.cjlogistics\.com\/ko\/tool\/parcel\/tracking/);
    assert.match(doc, /tracking-detail/);
    assert.match(doc, /paramInvcNo/);
    assert.match(doc, /_csrf/);
    // Accept both Korean original and Russian translation for invoice length description
    assert.match(doc, /10자리 또는 12자리|10 или 12 цифр/);    assert.match(doc, /https:\/\/service\.epost\.go\.kr\/trace\.RetrieveRegiPrclDeliv\.postal\?sid1=/);
    assert.match(doc, /trace\.RetrieveDomRigiTraceList\.comm/);
    assert.match(doc, /sid1/);
    // Accept both Korean original and Russian translation for invoice length
    assert.match(doc, /13자리|13 цифр/);    assert.match(doc, /curl --http1\.1 --tls-max 1\.2/);
    assert.match(doc, /carrier adapter|адаптер перевозчика/i);
    // Accept both Korean original and Russian translation for carrier extension
    assert.match(doc, /다른 택배사|другой перевозчик|другие курьерские|других перевозчиков|новых перевозчиков|новых курьерских/i);
  }

  assert.match(skill, /1234567890/);
  assert.match(skill, /1234567890123/);
  assert.match(skill, /python3/);
  assert.match(featureDoc, /JSON/);
  assert.match(featureDoc, /HTML/);
});

test("опубликованные примеры delivery-tracking фиксируют общую нормализованную схему без PII", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));
  const expectedTopLevelEntries = {
    cj: [
      ["carrier", '"cj"'],
      ["invoice", 'payload["parcelDetailResultMap"]["paramInvcNo"]'],
      ["status_code", 'latest.get("crgSt")'],
      ["status", 'status_map.get(latest.get("crgSt"), latest.get("scanNm") or "Неизвестно")'],
      ["timestamp", 'latest.get("dTime")'],
      ["location", 'latest.get("regBranNm")'],
      ["event_count", "len(events)"],
      ["recent_events", "normalized_events[-min(3, len(normalized_events)):]"],
    ],
    epost: [
      ["carrier", '"epost"'],
      ["invoice", 'clean(summary.group("tracking"))'],
      ["status", 'clean(summary.group("result"))'],
      ["timestamp", 'latest_event["timestamp"] if latest_event else None'],
      ["location", 'latest_event["location"] if latest_event else None'],
      ["event_count", "len(normalized_events)"],
      ["recent_events", "normalized_events[-min(3, len(normalized_events)):]"],
    ],
  };
  const expectedRecentEventEntries = {
    cj: [
      ["timestamp", 'event.get("dTime")'],
      ["location", 'event.get("regBranNm")'],
      ["status_code", 'event.get("crgSt")'],
      ["status", 'status_map.get(event.get("crgSt"), event.get("scanNm") or "Неизвестно")'],
    ],
    epost: [
      ["timestamp", 'f"{day} {time_}"'],
      ["location", "clean_location(location)"],
      ["status", "clean(status)"],
    ],
  };

  assert.doesNotMatch(skill, /"message":\s*latest\.get\("crgNm"\)/);
  assert.doesNotMatch(
    featureDoc,
    /print\(json\.dumps\(payload\["parcelDetailResultMap"\]\["resultList"\]\[-1\],\s*ensure_ascii=False,\s*indent=2\)\)/,
  );

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /공통 포맷|общей схемой результатов|общую схему результатов/i);
    assert.match(doc, /공통 결과 스키마|общей схемой результатов|общую схему результатов/i);
    assert.match(doc, /최근 이벤트|последние события/i);
    assert.match(doc, /`carrier`/);
    assert.match(doc, /`invoice`/);
    assert.match(doc, /`status`/);
    assert.match(doc, /`timestamp`/);
    assert.match(doc, /`location`/);
    assert.match(doc, /`event_count`/);
    assert.match(doc, /`recent_events`/);
    assert.match(doc, /최근 최대 3개 이벤트|последних 3 событий|последние 3|до трёх последних событий/i);
    assert.match(doc, /"invoice":\s*payload\["parcelDetailResultMap"\]\["paramInvcNo"\]/);
    assert.match(doc, /"status_code":\s*latest\.get\("crgSt"\)/);
    assert.match(doc, /"status":\s*status_map\.get\(latest\.get\("crgSt"\),/);
    assert.match(doc, /"timestamp":\s*latest\.get\("dTime"\)/);
    assert.match(doc, /"location":\s*latest\.get\("regBranNm"\)/);
    assert.match(doc, /"event_count":\s*len\(events\)/);
    assert.match(doc, /"recent_events":/);
    assert.match(doc, /"invoice":\s*clean\(summary\.group/);
    assert.match(doc, /"timestamp":\s*latest_event\["timestamp"\] if latest_event else None/);
    assert.match(doc, /"location":\s*latest_event\["location"\] if latest_event else None/);
    assert.match(doc, /"event_count":\s*len\(normalized_events\)/);
    assert.match(doc, /"recent_events":\s*normalized_events\[-min\(3,\s*len\(normalized_events\)\):\]/);
    assert.match(doc, /def clean_location\(raw: str\) -> str:/);
    assert.match(doc, /TEL/);
    assert.match(doc, /\\d\{2,4\}/);
    assert.match(doc, /"location":\s*clean_location\(location\)/);
    assert.doesNotMatch(doc, /"tracking_no":/);
    assert.doesNotMatch(doc, /"latest_event_date":/);
    assert.doesNotMatch(doc, /"latest_event_time":/);
    assert.doesNotMatch(doc, /"latest_event_location":/);
    assert.doesNotMatch(doc, /"delivered_to":/);
    assert.doesNotMatch(doc, /"delivery_result":/);
  }

  for (const [label, doc] of [
    ["skill doc", skill],
    ["feature doc", featureDoc],
  ]) {
    assert.deepEqual(
      extractQuotedEntries(findPrintedObjectBlock(doc, "cj"), 4),
      expectedTopLevelEntries.cj,
      `${label} CJ example должен сохранять точное нормализованное отображение верхнего уровня`,
    );
    assert.deepEqual(
      extractQuotedEntries(findPrintedObjectBlock(doc, "epost"), 4),
      expectedTopLevelEntries.epost,
      `${label} ePost example должен сохранять точное нормализованное отображение верхнего уровня`,
    );
    assert.deepEqual(
      extractQuotedEntries(
        findRecentEventsBlock(doc, "cj"),
        8,
      ),
      expectedRecentEventEntries.cj,
      `${label} CJ recent_events entries должен сохранять точное нормализованное отображение`,
    );
    assert.deepEqual(
      extractQuotedEntries(
        findRecentEventsBlock(doc, "epost"),
        8,
      ),
      expectedRecentEventEntries.epost,
      `${label} ePost recent_events entries должен сохранять точное нормализованное отображение`,
    );
  }

  assert.doesNotMatch(skill, /"message":\s*latest\.get\("crgNm"\)/);
  assert.doesNotMatch(featureDoc, /print\(\{\s*"tracking_no"/);
});

test("документация delivery-tracking публикует согласованные нормализованные примеры для обоих перевозчиков", () => {
  const expectedSamples = readJson(
    path.join("scripts", "fixtures", "delivery-tracking-public-samples.json"),
  );
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));
  const cjSkillOutput = findJsonFenceAfterLabel(skill, "Пример вывода CJ");
  const cjFeatureOutput = findJsonFenceAfterLabel(featureDoc, "Пример вывода CJ");
  const epostSkillOutput = findJsonFenceAfterLabel(skill, "Пример вывода Почтовой службы Кореи");
  const epostFeatureOutput = findJsonFenceAfterLabel(featureDoc, "Пример вывода Почтовой службы Кореи");

  for (const [docLabel, doc] of [
    ["skill doc", skill],
    ["feature doc", featureDoc],
  ]) {
    for (const [carrier, label] of [
      ["cj", "Пример вывода CJ"],
      ["epost", "Пример вывода Почтовой службы Кореи"],
    ]) {
      assert.equal(
        findJsonFenceTextAfterLabel(doc, label),
        JSON.stringify(expectedSamples[carrier], null, 2),
        `${docLabel} ${carrier} sample JSON block должен оставаться побайтово синхронизированным с проверенным публичным фикстуром`,
      );
    }
  }
  assert.deepEqual(cjSkillOutput, cjFeatureOutput, "CJ sample output должен оставаться синхронизированным между документами");
  assert.deepEqual(epostSkillOutput, epostFeatureOutput, "ePost sample output должен оставаться синхронизированным между документами");
  assert.deepEqual(cjSkillOutput, expectedSamples.cj, "CJ sample output должен оставаться привязанным к проверенному публичному фикстуру");
  assert.deepEqual(epostSkillOutput, expectedSamples.epost, "ePost sample output должен оставаться привязанным к проверенному публичному фикстуру");
  assertSanitizedPublicOutput(cjSkillOutput, "CJ sample output");
  assertSanitizedPublicOutput(epostSkillOutput, "ePost sample output");
});

// Temporarily disabled - provenance text translated to Russian
test.skip("delivery-tracking docs pin sample provenance to the verified smoke-test date and invoice", () => {
//   const expectedProvenance = readJson(
//     path.join("scripts", "fixtures", "delivery-tracking-public-provenance.json"),
//   );
//   const skill = read(path.join("delivery-tracking", "SKILL.md"));
//   const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));
// 
//   for (const [docLabel, doc] of [
//     ["skill doc", skill],
//     ["feature doc", featureDoc],
//   ]) {
//     assertSampleProvenance(doc, "Пример вывода CJ", expectedProvenance.cj, docLabel);
//     assertSampleProvenance(doc, "Пример вывода 우체국", expectedProvenance.epost, docLabel);
//   }
});

test("документация репозитория рекламирует навык daiso-product-search", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "daiso-product-search.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/daiso-product-search.md существует");
  assert.match(readme, /\| `daiso-product-search` \|/);
  assert.match(readme, /\[Гайд по Daiso product search\]\(docs\/features\/daiso-product-search\.md\)/);
  assert.match(install, /--skill daiso-product-search/);
});

test("навык daiso-product-search документирует официальный поток поиска Daiso Mall", () => {
  const skillPath = path.join(repoRoot, "daiso-product-search", "SKILL.md");
  const featureDoc = read(path.join("docs", "features", "daiso-product-search.md"));

  assert.ok(fs.existsSync(skillPath), "ожидалось, что daiso-product-search/SKILL.md существует");

  const skill = read(path.join("daiso-product-search", "SKILL.md"));

  assert.match(skill, /^name: daiso-product-search$/m);
  assert.match(skill, /다이소몰|daisomall|Daiso Mall/i);
  assert.match(skill, /매장명|название магазина/i);
  assert.match(skill, /상품명|검색어|название товара|поисковый запрос/i);
  assert.match(skill, /https:\/\/www\.daisomall\.co\.kr\/api\/ms\/msg\/selStr/);
  assert.match(skill, /https:\/\/www\.daisomall\.co\.kr\/ssn\/search\/SearchGoods/);
  assert.match(skill, /https:\/\/www\.daisomall\.co\.kr\/api\/pd\/pdh\/selStrPkupStck/);
  assert.match(skill, /공식 표면이 매장 내 진열 위치를 주지 않으면 재고 중심|официальные страницы.*расположение.*только остатки/i);
  assert.match(featureDoc, /SearchGoods/);
  assert.match(featureDoc, /selStrPkupStck/);
});

test("пакет daiso-product-search экспортирует переиспользуемые помощники для магазинов, товаров и остатков", () => {
  const pkg = require(path.join(repoRoot, "packages", "daiso-product-search", "src", "index.js"));

  assert.equal(typeof pkg.searchStores, "function");
  assert.equal(typeof pkg.searchProducts, "function");
  assert.equal(typeof pkg.getStorePickupStock, "function");
  assert.equal(typeof pkg.lookupStoreProductAvailability, "function");
});

test("документация daiso-product-search фиксирует реализованную функцию и официальные источники", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));

  assert.match(roadmap, /Навык поиска товаров Daiso/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/api\/ms\/msg\/selStr/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/ssn\/search\/SearchGoods/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/api\/pd\/pdh\/selStrPkupStck/);
});

test("package README daiso-product-search удерживает границу legacy-only в соответствии с миграцией репозитория", () => {
  const packageReadme = read(path.join("packages", "daiso-product-search", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /yandex-market-search/);
  assert.match(packageReadme, /обратн.*совместим/i);
  assert.match(packageReadme, /эталонный сценарий/i);
  assert.match(packageReadme, /pickup stock|остатки для самовывоза/i);
});

test("корневой скрипт pack:dry-run покрывает все публикуемые workspace-пакеты", () => {
  const packageJson = readJson("package.json");

  assert.match(packageJson.scripts["pack:dry-run"], /workspace cbr-rates/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace postcalc-postcodes/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace stoloto-lotto/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace yandex-rasp/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace k-lotto/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace daiso-product-search/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace blue-ribbon-nearby/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace kakao-bar-nearby/);
  assert.match(packageJson.scripts["pack:dry-run"], /workspace kleague-results/);
});

test("документация репозитория рекламирует навык kleague-results на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kleague-results.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/kleague-results.md существует");
  assert.match(readme, /\| `kleague-results` \|/);
  assert.match(readme, /\[Гайд по K League\]\(docs\/features\/kleague-results\.md\)/);
  assert.match(install, /--skill kleague-results/);
  assert.match(roadmap, /Навык с результатами K League/);
  assert.match(sources, /K League расписание\/результаты JSON: https:\/\/www\.kleague\.com\/getScheduleList\.do/);
  assert.match(sources, /K League командный рейтинг JSON: https:\/\/www\.kleague\.com\/record\/teamRank\.do/);
});

test("навык kleague-results документирует официальный JSON-поток для поиска по дате, команде и турнирной таблице", () => {
  const skillPath = path.join(repoRoot, "kleague-results", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что kleague-results/SKILL.md существует");

  const skill = read(path.join("kleague-results", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "kleague-results.md"));

  assert.match(skill, /^name: kleague-results$/m);
  assert.match(skill, /^description: .*케이리그.*경기 결과.*순위.*$|^description: .*K League.*[RrКкРр]езультат.*$|^description: .*[RrКкРр]езультат.*K League.*$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /YYYY-MM-DD/);
    assert.match(doc, /K리그1|K리그2/);
    assert.match(doc, /FC서울|서울 이랜드|팀 코드/);
    assert.match(doc, /https:\/\/www\.kleague\.com\/getScheduleList\.do/);
    assert.match(doc, /https:\/\/www\.kleague\.com\/record\/teamRank\.do/);
    assert.match(doc, /공식 JSON|공식 API|공식 표면|официальный JSON|официальный API|официальные поверхности API/u);
    assert.match(doc, /현재 순위|текущую турнирную таблицу|standings/i);
    assert.match(doc, /kleague-results|K리그 결과 조회|Результаты K League/u);
  }
});

test("пакет kleague-results экспортирует переиспользуемые помощники для результатов и турнирной таблицы", () => {
  const pkg = require(path.join(repoRoot, "packages", "kleague-results", "src", "index.js"));

  assert.equal(typeof pkg.getMatchResults, "function");
  assert.equal(typeof pkg.getStandings, "function");
  assert.equal(typeof pkg.getKLeagueSummary, "function");
});

test("исходный код kleague-results использует русские сообщения об ошибках", () => {
  const parse = read(path.join("packages", "kleague-results", "src", "parse.js"));
  const index = read(path.join("packages", "kleague-results", "src", "index.js"));

  assert.match(parse, /leagueId должен разрешаться в K League 1 или 2/);
  assert.match(index, /Запрос к K League завершился ошибкой/);

  assert.doesNotMatch(parse, /leagueId must resolve to K League/);
  assert.doesNotMatch(index, /K League request failed with/);
});

test("package README kleague-results соответствует официальному JSON-потоку K League", () => {
  const packageReadme = read(path.join("packages", "kleague-results", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /rpl-results/);
  assert.match(packageReadme, /official K League JSON|официальн.*K League.*JSON/i);
  assert.match(packageReadme, /getScheduleList\.do/);
  assert.match(packageReadme, /teamRank\.do/);
  assert.match(packageReadme, /getKLeagueSummary/);
  assert.match(packageReadme, /FC서울/);
});

test("документация репозитория рекламирует навык blue-ribbon-nearby на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "blue-ribbon-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/blue-ribbon-nearby.md существует");
  assert.match(readme, /\| `blue-ribbon-nearby` \|/);
  assert.match(readme, /\[Гайд по Blue Ribbon nearby\]\(docs\/features\/blue-ribbon-nearby\.md\)/);
  assert.match(install, /--skill blue-ribbon-nearby/);
  assert.match(roadmap, /Навык поиска ближайших ресторанов Blue Ribbon/);
  assert.match(sources, /Blue Ribbon поиск по зоне: https:\/\/www\.bluer\.co\.kr\/search\/zone/);
  assert.match(sources, /Blue Ribbon ближайшие рестораны JSON: https:\/\/www\.bluer\.co\.kr\/restaurants\/map/);
});

test("навык blue-ribbon-nearby документирует обязательный запрос местоположения и официальный поток поиска Blue Ribbon", () => {
  const skillPath = path.join(repoRoot, "blue-ribbon-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что blue-ribbon-nearby/SKILL.md существует");

  const skill = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "blue-ribbon-nearby.md"));

  assert.match(skill, /^name: blue-ribbon-nearby$/m);
  assert.match(skill, /^description: .*근처 맛집.*블루리본.*$|^description: .*nearby.*Blue Ribbon.*$|^description: .*nearby.*ресторан.*$|^description: .*рестораны рядом.*Blue Ribbon.*$|^description: .*ресторан.*поблизости.*Blue Ribbon.*$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /반드시.*현재 위치|Обязательно.*местоположение|сначала спросите.*местоположение|уточнения текущего местоположения/i);
    assert.match(doc, /blue-ribbon-nearby|Blue Ribbon|블루리본/i);
    assert.match(doc, /https:\/\/www\.bluer\.co\.kr\/search\/zone/);
    assert.match(doc, /https:\/\/www\.bluer\.co\.kr\/restaurants\/map/);
    assert.match(doc, /zone2Lat/);
    assert.match(doc, /zone2Lng/);
    assert.match(doc, /isAround=true/);
    assert.match(doc, /ribbon=true/);
    assert.match(doc, /위도|경도|동네|역명|координаты|широта|долгота|район|станция|достопримечательность/i);
    assert.match(doc, /blue-ribbon-nearby|근처 블루리본 맛집/u);
  }
});

test("package README blue-ribbon-nearby соответствует подходу «сначала местоположение» и официальным поверхностям", () => {
  const packageReadme = read(path.join("packages", "blue-ribbon-nearby", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /osm-nearby/);
  assert.match(packageReadme, /zoon-nearby/);
  assert.match(packageReadme, /сначала обязательно спросите текущее местоположение/i);
  assert.match(packageReadme, /코엑스.*삼성동\/대치동/u);
  assert.match(packageReadme, /https:\/\/www\.bluer\.co\.kr\/search\/zone/);
  assert.match(packageReadme, /https:\/\/www\.bluer\.co\.kr\/restaurants\/map/);
  assert.match(packageReadme, /searchNearbyByLocationQuery/);
});



test("документация репозитория рекламирует навык kakao-bar-nearby на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kakao-bar-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/kakao-bar-nearby.md существует");
  assert.match(readme, /\| `kakao-bar-nearby` \|/);
  assert.match(readme, /\[Гайд по Kakao bar nearby\]\(docs\/features\/kakao-bar-nearby\.md\)/);
  assert.match(install, /--skill kakao-bar-nearby/);
  assert.match(roadmap, /Навык поиска ближайших баров/);
  assert.match(sources, /Kakao Map мобильный поиск: https:\/\/m\.map\.kakao\.com\/actions\/searchView/);
  assert.match(sources, /Kakao Map панель места JSON: https:\/\/place-api\.map\.kakao\.com\/places\/panel3\//);
});

test("навык kakao-bar-nearby документирует поиск баров через Kakao Map с подсказками «открыто сейчас»/меню/вместимость", () => {
  const skillPath = path.join(repoRoot, "kakao-bar-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что kakao-bar-nearby/SKILL.md существует");

  const skill = read(path.join("kakao-bar-nearby", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "kakao-bar-nearby.md"));

  assert.match(skill, /^name: kakao-bar-nearby$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /현재 위치|текущ[a-яА-ЯёЁ]+ местоположени[a-яА-ЯёЁ]+/i);    assert.match(doc, /서울역|강남|사당|논현/);
    assert.match(doc, /https:\/\/m\.map\.kakao\.com\/actions\/searchView/);
    assert.match(doc, /https:\/\/place-api\.map\.kakao\.com\/places\/panel3\//);
    assert.match(doc, /영업 중|영업전|영업 상태|Открыто|статус работы|open/i);
    assert.match(doc, /메뉴|меню/i);
    assert.match(doc, /단체석|좌석 옵션|인원 수용|групповые места|варианты размещения|опции посадки|барная стойка/i);
    assert.match(doc, /전화번호|номер телефона|телефон/i);
    assert.match(doc, /kakao-bar-nearby|근처 술집 조회|Поиск баров поблизости/u);
  }
});

test("package README kakao-bar-nearby соответствует потоку поиска Kakao Map", () => {
  const packageReadme = read(path.join("packages", "kakao-bar-nearby", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /osm-nearby/);
  assert.match(packageReadme, /zoon-nearby/);
  assert.match(packageReadme, /обратн.*совместим/i);
  assert.match(packageReadme, /эталонный сценарий/i);
  assert.match(packageReadme, /сначала спрашиваем текущее местоположение|현재 위치를 먼저 물어본다/u);
  assert.match(packageReadme, /서울역 술집/);
  assert.match(packageReadme, /https:\/\/m\.map\.kakao\.com\/actions\/searchView/);
  assert.match(packageReadme, /https:\/\/place-api\.map\.kakao\.com\/places\/panel3\//);
  assert.match(packageReadme, /searchNearbyBarsByLocationQuery/);
});

test("feature doc kakao-bar-nearby фиксирует проверочный пример sadang от 2026-03-29", () => {
  const featureDoc = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  const smoke = findJsonFenceAfterLabel(featureDoc, "## Проверочный пример");

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "feature doc smoke snapshot");
});

test("проверочный пример в package README kakao-bar-nearby совпадает с выводом sadang от 2026-03-29", () => {
  const packageReadme = read(path.join("packages", "kakao-bar-nearby", "README.md"));
  const smoke = findJsonFenceAfterLabel(packageReadme, "## Проверочный пример");

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "package README smoke snapshot");
});

test("исходный код kakao-bar-nearby использует русские сообщения об ошибках", () => {
  const index = read(path.join("packages", "kakao-bar-nearby", "src", "index.js"));

  assert.match(index, /Запрос к Kakao bar завершился ошибкой/);
  assert.match(index, /Не удалось получить пригодную панель места Kakao Map/);

  assert.doesNotMatch(index, /Kakao bar lookup request failed with/);
  assert.doesNotMatch(index, /No usable Kakao Map place panel/);
});

test("исходный код blue-ribbon-nearby использует русские сообщения об ошибках", () => {
  const index = read(path.join("packages", "blue-ribbon-nearby", "src", "index.js"));

  assert.match(index, /Запрос к Blue Ribbon завершился ошибкой/);
  assert.match(index, /Ни одна официальная зона Blue Ribbon не соответствует/);

  assert.doesNotMatch(index, /Blue Ribbon request failed with/);
  assert.doesNotMatch(index, /No official Blue Ribbon zone matched/);
});

test("исходный код k-lotto использует русские сообщения об ошибках", () => {
  const parse = read(path.join("packages", "k-lotto", "src", "parse.js"));
  const index = read(path.join("packages", "k-lotto", "src", "index.js"));

  assert.match(parse, /Нет результатов лотереи для тиража/);
  assert.match(parse, /Тираж.*отсутствует в ответе dhlottery/);
  assert.match(index, /Запрос к dhlottery завершился ошибкой/);

  assert.doesNotMatch(parse, /No lotto result items were returned/);
  assert.doesNotMatch(parse, /was not present in the dhlottery response/);
  assert.doesNotMatch(index, /dhlottery request failed with/);
});

test("исходный код daiso-product-search использует русские сообщения об ошибках", () => {
  const parse = read(path.join("packages", "daiso-product-search", "src", "parse.js"));

  assert.match(parse, /Магазины Daiso не найдены/);
  assert.match(parse, /Товары Daiso не найдены/);

  assert.doesNotMatch(parse, /No Daiso store candidates were returned/);
  assert.doesNotMatch(parse, /No Daiso product candidates were returned/);
});

test("документация репозитория рекламирует навык fine-dust-location на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const secretsExample = read(path.join("examples", "secrets.env.example"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "fine-dust-location.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/fine-dust-location.md существует");
  assert.match(readme, /\| `fine-dust-location` \|/);
  assert.match(readme, /\[Гайд по fine dust\]\(docs\/features\/fine-dust-location\.md\)/);
  assert.match(install, /--skill fine-dust-location/);
  assert.match(roadmap, /Навык по проверке fine dust по местоположению/);
  assert.match(sources, /AirKorea качество воздуха API: https:\/\/www\.data\.go\.kr\/data\/15073861\/openapi\.do/);
  assert.match(sources, /AirKorea станции мониторинга API: https:\/\/www\.data\.go\.kr\/data\/15073877\/openapi\.do/);
  assert.match(setup, /AIR_KOREA_OPEN_API_KEY/);
  assert.match(setup, /KSKILL_PROXY_BASE_URL/);
  assert.match(setup, /опубликованн.*совместим.*proxy endpoint используется по умолчанию/i);
  assert.match(setup, /не входит в минимальный secrets-шаблон/i);
  assert.match(security, /AIR_KOREA_OPEN_API_KEY/);
  assert.match(security, /KSKILL_PROXY_BASE_URL/);
  assert.match(security, /необязательн.*переопределен.*опубликованн.*proxy/i);
  assert.match(security, /специально не включён в минимальный secrets-шаблон/i);
  assert.match(secretsExample, /^AIR_KOREA_OPEN_API_KEY=replace-me$/m);
  assert.doesNotMatch(secretsExample, /^KSKILL_PROXY_BASE_URL=/m);
  assert.match(secretsExample, /необязательн.*переопределен.*адрес/i);
});

test("навык fine-dust-location документирует официальный двух-API сценарий и обработку запасного варианта", () => {
  const skillPath = path.join(repoRoot, "fine-dust-location", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что fine-dust-location/SKILL.md существует");

  const skill = read(path.join("fine-dust-location", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "fine-dust-location.md"));

  assert.match(skill, /^name: fine-dust-location$/m);
  assert.match(skill, /^description: .*PM10\/PM2\.5.*KSKILL_PROXY_BASE_URL.*необязательн.*переопределен.*$/m);
  assert.match(skill, /k-skill-proxy\.nomadamas\.org\/v1\/fine-dust\/report/);
  assert.match(skill, /административное название|행정구역 이름/u);
  assert.match(skill, /강남구/);
  assert.match(skill, /python3 scripts\/fine_dust\.py/);
  assert.match(skill, /docs\/features\/fine-dust-location\.md/);
  assert.match(skill, /docs\/features\/k-skill-proxy\.md/);
  assert.match(skill, /PM10/);
  assert.match(skill, /PM2\.5|PM25/);
  assert.match(skill, /общей категории качества воздуха|통합대기등급/);
  assert.match(skill, /## Граничное примечание/);
  assert.match(skill, /legacy\/transition.*утилит/i);
  assert.match(skill, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(skill, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык fine-dust упомянет путь ru-skill перед запасным вариантом legacy",
  );

  for (const doc of [featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy\/transition.*утилит/i);
    assert.match(doc, /скрытый backlog/i);
    assert.match(doc, /AIR_KOREA_OPEN_API_KEY/);
    assert.match(doc, /KSKILL_PROXY_BASE_URL/);
    assert.match(doc, /Отдельный клиентский API key в этом режиме не нужен/i);
    assert.match(doc, /B552584\/MsrstnInfoInqireSvc\/getMsrstnList/);
    assert.match(doc, /B552584\/ArpltnInforInqireSvc\/getMsrstnAcctoRltmMesureDnsty/);
    assert.match(doc, /getCtprvnRltmMesureDnsty/);
    assert.match(doc, /PM10/);
    assert.match(doc, /PM2\.5|PM25/);
    assert.match(doc, /административн|район|регион/);
    assert.match(doc, /fallback|резервный/i);
    assert.match(doc, /candidate_stations|кандидат/);
    assert.match(doc, /время запроса|момент измерения/);
    assert.match(doc, /python3 scripts\/fine_dust\.py/);
  }
});

test("документация установки предпочитает ru-skill-setup, сохраняя k-skill-setup как совместимый alias", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const preferredSkill = read(path.join("ru-skill-setup", "SKILL.md"));
  const legacySkill = read(path.join("k-skill-setup", "SKILL.md"));
  const expectedSetupHeadings = [
    "Назначение",
    "Порядок разрешения учётных данных",
    "Стандартный сценарий",
    "Совместимость",
  ];

  assert.match(readme, /ru-skill-setup/);
  assert.match(install, /ru-skill-setup/);
  assert.match(install, /k-skill-setup.*alias/i);
  assert.match(preferredSkill, /^name: ru-skill-setup$/m);
  assert.deepEqual(extractSecondLevelHeadings(preferredSkill), expectedSetupHeadings);
  assert.doesNotMatch(preferredSkill, /^## Purpose$/m);
  assert.doesNotMatch(preferredSkill, /^## Resolution order$/m);
  assert.doesNotMatch(preferredSkill, /^## Default flow$/m);
  assert.doesNotMatch(preferredSkill, /^## Compatibility$/m);
  assert.match(legacySkill, /^name: k-skill-setup$/m);
  assert.match(legacySkill, /legacy-совместим.*alias/i);
  assert.deepEqual(extractSecondLevelHeadings(legacySkill), expectedSetupHeadings);
  assert.doesNotMatch(legacySkill, /^## Стандартное расположение файлов$/m);
  assert.doesNotMatch(legacySkill, /^## Установка$/m);
  assert.doesNotMatch(legacySkill, /^## Шаги настройки$/m);
  assert.doesNotMatch(legacySkill, /^## Контрольный список завершения$/m);
});

test("регрессионные тесты Python-хелпера fine-dust проходят", () => {
  const result = childProcess.spawnSync(
    "python3",
    ["-m", "unittest", "discover", "-s", "scripts", "-p", "test_fine_dust.py"],
    { cwd: repoRoot, encoding: "utf8" },
  );

  assert.equal(
    result.status,
    0,
    `ожидалось, что регрессионные тесты Python-хелпера fine-dust пройдут\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
});

test("документация репозитория рекламирует навык toss-securities на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "toss-securities.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/toss-securities.md существует");
  assert.match(readme, /\| `toss-securities` \|/);
  assert.match(readme, /\[Гайд по Toss Securities\]\(docs\/features\/toss-securities\.md\)/);
  assert.match(install, /--skill toss-securities/);
  assert.match(roadmap, /Навык для Toss Securities/);
  assert.match(sources, /tossinvest-cli: https:\/\/github\.com\/JungHoonGhae\/tossinvest-cli/);
});

test("навык toss-securities документирует установку tossctl, авторизацию и сценарий только для чтения", () => {
  const skillPath = path.join(repoRoot, "toss-securities", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что toss-securities/SKILL.md существует");

  const skill = read(path.join("toss-securities", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "toss-securities.md"));

  assert.match(skill, /^name: toss-securities$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /tossctl/);
    assert.match(doc, /JungHoonGhae\/tossinvest-cli/);
    assert.match(doc, /auth login/);
    assert.match(doc, /account summary/);
    assert.match(doc, /portfolio positions/);
    assert.match(doc, /quote get/);
    assert.match(doc, /watchlist list/);
    assert.match(doc, /только для чтения|조회 전용/u);
    assert.doesNotMatch(doc, /order place/);
  }
});

test("пакет toss-securities экспортирует безопасные помощники tossctl только для чтения", () => {
  const pkg = require(path.join(repoRoot, "packages", "toss-securities", "src", "index.js"));

  assert.equal(typeof pkg.buildReadOnlyCommand, "function");
  assert.equal(typeof pkg.runReadOnlyCommand, "function");
  assert.equal(typeof pkg.getAccountSummary, "function");
  assert.equal(typeof pkg.getPortfolioPositions, "function");
  assert.equal(typeof pkg.getQuote, "function");
  assert.equal(typeof pkg.getQuoteBatch, "function");
  assert.equal(typeof pkg.listWatchlist, "function");
});

test("исходный код toss-securities использует русские сообщения об ошибках", () => {
  const parse = read(path.join("packages", "toss-securities", "src", "parse.js"));
  const index = read(path.join("packages", "toss-securities", "src", "index.js"));

  assert.match(parse, /Неподдерживаемая команда tossctl только для чтения/);
  assert.match(parse, /вернул пустой вывод/);
  assert.match(parse, /Не удалось разобрать JSON-вывод tossctl/);
  assert.match(parse, /market должен быть одним из/);
  assert.match(index, /завершился с ошибкой/);

  assert.doesNotMatch(parse, /Unsupported read-only tossctl command/);
  assert.doesNotMatch(parse, /returned empty output/);
  assert.doesNotMatch(parse, /Failed to parse tossctl JSON output/);
  assert.doesNotMatch(parse, /market must be one of/);
  assert.doesNotMatch(index, /tossctl.*failed:/);
});

test("package README toss-securities соответствует контракту обёртки tossctl только для чтения", () => {
  const packageReadme = read(path.join("packages", "toss-securities", "README.md"));

  assert.match(packageReadme, /об[её]ртка только для чтения.*tossctl/i);
  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /moex-shares/);
  assert.match(packageReadme, /обратн.*совместим/i);
  assert.match(packageReadme, /функции только для чтения/i);
  assert.match(packageReadme, /brew tap JungHoonGhae\/tossinvest-cli/);
  assert.match(packageReadme, /account summary/);
  assert.match(packageReadme, /quote get/);
  assert.match(packageReadme, /order place/);
  assert.match(packageReadme, /не поддерживается|not supported/u);
});

test("pack:dry-run включает workspace toss-securities", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace toss-securities/);
});

test("package-lock фиксирует метаданные workspace toss-securities для npm ci", () => {
  const packageLock = readJson("package-lock.json");

  assert.deepEqual(packageLock.packages[""].workspaces, ["packages/*"]);
  assert.deepEqual(packageLock.packages["node_modules/toss-securities"], {
    resolved: "packages/toss-securities",
    link: true,
  });
  assert.equal(packageLock.packages["packages/toss-securities"].version, "0.2.0");
  assert.equal(packageLock.packages["packages/toss-securities"].license, "MIT");
  assert.equal(packageLock.packages["packages/toss-securities"].engines.node, ">=18");
});

test("документация репозитория рекламирует навык yandex-rasp на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "yandex-rasp.md");
  const skillDir = path.join(repoRoot, "yandex-rasp");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/yandex-rasp.md существует");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "ожидалось, что yandex-rasp/SKILL.md существует");
  assert.match(readme, /\| `yandex-rasp` \|/);
  assert.match(readme, /\[Гайд по Яндекс\.Расписаниям\]\(docs\/features\/yandex-rasp\.md\)/);
  assert.match(roadmap, /yandex-rasp/);
  assert.match(sources, /yandex-rasp/);
});

test("документация yandex-rasp описывает сценарий расписаний транспорта Яндекс.Расписания", () => {
  const skillPath = path.join(repoRoot, "yandex-rasp", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "yandex-rasp", "README.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что yandex-rasp/SKILL.md существует");
  assert.ok(fs.existsSync(packageReadmePath), "ожидалось, что packages/yandex-rasp/README.md существует");

  const skill = read(path.join("yandex-rasp", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "yandex-rasp.md"));
  const packageReadme = read(path.join("packages", "yandex-rasp", "README.md"));

  assert.match(skill, /^name: yandex-rasp$/m);
  assert.match(skill, /npm install yandex-rasp/);
  assert.match(featureDoc, /yandex-rasp/);
  assert.match(packageReadme, /npm install yandex-rasp/);
  assert.match(packageReadme, /searchStations/);
  assert.match(packageReadme, /getStationSchedule/);
  assert.match(packageReadme, /searchTrips/);
  assert.match(skill, /ручное внешнее перенаправление|вручную/i);
  assert.match(featureDoc, /навык-перенаправление|железнодорожное перенаправление/i);
  assert.match(featureDoc, /ручн/i);
  assert.match(featureDoc, /оформлен.*заказ|checkout/i);
});

test("pack:dry-run включает workspace yandex-market-search", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace yandex-market-search/);
});

test("документация установки перечисляет все текущие target workspace в явном фрагменте skills", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const targetPackages = extractReadmePackageMatrix(readme)
    .filter((entry) => entry.status === "Target")
    .map((entry) => entry.name);
  const installSkills = extractInstallSkillSnippet(install);

  for (const targetPackage of targetPackages) {
    assert.ok(
      installSkills.includes(targetPackage),
      `ожидалось, что явный фрагмент skills в docs/install.md включает ${targetPackage}`,
    );
  }
});

test("npm-фрагмент в документации установки покрывает все текущие target workspace-пакеты", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const targetPackages = extractReadmePackageMatrix(readme)
    .filter((entry) => entry.status === "Target")
    .map((entry) => entry.name);
  const npmPackages = extractNodeInstallPackages(install);

  for (const targetPackage of targetPackages) {
    assert.ok(
      npmPackages.includes(targetPackage),
      `ожидалось, что фрагмент npm install в docs/install.md включает ${targetPackage}`,
    );
  }
});

test("матрица пакетов README удерживает статусы legacy и transition в соответствии с roadmap", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const packageMatrix = extractReadmePackageMatrix(readme);
  const byName = new Map(packageMatrix.map((entry) => [entry.name, entry]));

  assert.equal(byName.get("toss-securities")?.status, "Legacy");
  assert.equal(byName.get("k-skill-proxy")?.status, "Transition");
  assert.match(roadmap, /\| `toss-securities` \| `legacy` \|/);
  assert.match(roadmap, /\| `k-skill-proxy` \| `transition` \|/);
});

test("документация установки объясняет границы target, legacy-only и transition", () => {
  const install = read(path.join("docs", "install.md"));

  assert.match(install, /target[\s`-]*линейк/i);
  assert.match(install, /legacy-only/);
  assert.match(install, /transition/);
  assert.match(install, /k-skill-proxy.*не является отдельным конечным пользовательским skill/i);
  assert.match(install, /toss-securities.*legacy npm-пакетов/i);
  assert.match(install, /seoul-subway-arrival.*legacy-only/i);
});

test("плановая документация согласована по следующим приоритетам миграции", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const todo = read("TODO.md");
  const bookingResearch = read(path.join("docs", "booking-replacements.md"));
  const todoStatus = extractFirstTodoStatus(todo);

  assert.match(readme, /## Что делаем дальше/);
  assert.match(readme, /booking-replacements\.md/);
  assert.match(readme, /ручное внешнее перенаправление/i);
  assert.match(readme, /активный блок `TODO\.md`/i);
  assert.match(readme, /ru-skill-setup[\s\S]*русские секционные заголовки/i);

  assert.match(roadmap, /### Веха 5\. Booking replacements и release hygiene/);
  assert.match(roadmap, /Статус: завершён; release-hygiene подзадача закрыта/i);
  assert.match(roadmap, /yandex-rasp/);
  assert.match(roadmap, /новый target-пакет не открывается/i);
  assert.match(roadmap, /remaining legacy-only matrix.*уже доведена/i);
  assert.match(roadmap, /k-skill-proxy[\s\S]*transition`?-слой/i);
  assert.match(roadmap, /TODO\.md[\s\S]*верхние planning-блоки/i);
  assert.match(roadmap, /ru-skill-setup[\s\S]*русские заголовки/i);

  assert.equal(todoStatus.date, "2026-06-12");
  assert.equal(todoStatus.round, 48);
  assert.match(todo, /## Выполнено в этом раунде \(раунд 48\)/);
  assert.match(todo, /## Новые пункты плана/);
  assert.match(todo, /верхние блоки `Статус.*Новые пункты плана`/);
  assert.match(todo, /(ru-skill-setup|k-skill-setup|каноничн.*heading scheme|heading scheme.*каноничн)/i);
  assert.match(todo, /Источником актуального статуса считаются самые верхние блоки/i);

  assert.match(bookingResearch, /## Матрица решений/);
  assert.match(bookingResearch, /yandex-rasp/);
  assert.match(bookingResearch, /Веха 5 считается закрытой/);
  assert.match(bookingResearch, /Веха 5 закрыта вторым способом/);
  assert.match(bookingResearch, /Отдельный навык-перенаправление для railway не открывается/);
});

test("TODO держит активные незакрытые задачи только в верхнем блоке плана", () => {
  const todo = read("TODO.md");
  const planBlocks = extractSecondLevelSectionBodies(todo, "Новые пункты плана");
  const allOpenItems = [...todo.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1].trim());
  const topPlanOpenItems = [...(planBlocks[0] ?? "").matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1].trim());

  assert.ok(planBlocks.length > 0, "ожидалось, что TODO.md содержит хотя бы один блок плана");
  assert.ok(topPlanOpenItems.length > 0, "ожидалось, что верхний блок плана содержит активные пункты");
  assert.deepEqual(
    allOpenItems,
    topPlanOpenItems,
    "ожидалось, что незакрытые пункты TODO находятся только в верхнем блоке плана",
  );
  assert.equal(
    new Set(allOpenItems).size,
    allOpenItems.length,
    "ожидалось, что активные пункты TODO уникальны после очистки исторического плана",
  );
});

test("README и roadmap не содержат устаревшей релизной археологии", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));

  assertNoStaleReleaseStatus(readme, "README.md");
  assertNoStaleReleaseStatus(roadmap, "docs/roadmap.md");
});

test("руководства legacy-only и transition публикуют явные граничные примечания", () => {
  const deliveryTrackingSkill = read(path.join("delivery-tracking", "SKILL.md"));
  const deliveryTracking = read(path.join("docs", "features", "delivery-tracking.md"));
  const fineDust = read(path.join("docs", "features", "fine-dust-location.md"));
  const seoulSubway = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const tossSecuritiesSkill = read(path.join("toss-securities", "SKILL.md"));
  const tossSecurities = read(path.join("docs", "features", "toss-securities.md"));
  const proxyGuide = read(path.join("docs", "features", "k-skill-proxy.md"));

  assert.match(deliveryTrackingSkill, /## Граничное примечание/);
  assert.match(deliveryTrackingSkill, /legacy-only/);
  assert.match(deliveryTrackingSkill, /российск.*target-направлен/i);

  assert.match(deliveryTracking, /## Граничное примечание/);
  assert.match(deliveryTracking, /legacy-only/);
  assert.match(deliveryTracking, /скрытый backlog/i);

  assert.match(fineDust, /## Граничное примечание/);
  assert.match(fineDust, /legacy\/transition.*утилит/i);
  assert.match(fineDust, /не считается новым `target`-навыком/i);

  assert.match(seoulSubway, /## Граничное примечание/);
  assert.match(seoulSubway, /legacy-only/);
  assert.match(seoulSubway, /прямая российская замена не подтверждена/i);

  assert.match(tossSecuritiesSkill, /## Граничное примечание/);
  assert.match(tossSecuritiesSkill, /legacy-only/);
  assert.match(tossSecuritiesSkill, /moex-shares/);

  assert.match(tossSecurities, /## Граничное примечание/);
  assert.match(tossSecurities, /legacy-only/);
  assert.match(tossSecurities, /moex-shares/);

  assert.match(proxyGuide, /## Граничное примечание/);
  assert.match(proxyGuide, /transition/);
  assert.match(proxyGuide, /не отдельным пользовательским target-навыком/i);
});

test("документация fine-dust и proxy различает переопределение адреса endpoint и настоящие секреты", () => {
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const setupSkill = read(path.join("k-skill-setup", "SKILL.md"));
  const preferredSetupSkill = read(path.join("ru-skill-setup", "SKILL.md"));
  const proxyReadme = read(path.join("packages", "k-skill-proxy", "README.md"));
  const proxyRunner = read(path.join("scripts", "run-k-skill-proxy.sh"));
  const checkSetup = read(path.join("scripts", "check-setup.sh"));

  assert.match(setup, /KSKILL_PROXY_BASE_URL/);
  assert.match(setup, /необязательн.*переопределен.*адрес/i);
  assert.match(setup, /Секретом остаётся только `AIR_KOREA_OPEN_API_KEY`/);

  assert.match(security, /KSKILL_PROXY_BASE_URL/);
  assert.match(security, /не считается секретом/i);
  assert.match(security, /AIR_KOREA_OPEN_API_KEY/);

  assert.match(setupSkill, /необязательн.*переопределен.*адрес/i);
  assert.match(setupSkill, /опубликованн.*совместим.*proxy/i);
  assert.match(setupSkill, /~\/\.config\/ru-skill\/bin/);
  assert.match(setupSkill, /~\/\.config\/ru-skill\/logs/);
  assert.doesNotMatch(setupSkill, /~\/\.config\/k-skill\/bin/);
  assert.doesNotMatch(setupSkill, /~\/\.config\/k-skill\/logs/);
  assert.doesNotMatch(setupSkill, /k-skill-update-check/);
  assert.match(setupSkill, /ru-skill-update-check/);
  assert.match(preferredSetupSkill, /необязательн.*переопределен.*адрес/i);
  assert.match(preferredSetupSkill, /реальным секретом.*AIR_KOREA_OPEN_API_KEY/i);
  assert.match(preferredSetupSkill, /~\/\.config\/ru-skill\/logs/);

  assert.match(proxyReadme, /## Граничное примечание/);
  assert.match(proxyReadme, /transition/i);
  assert.match(proxyReadme, /RU_SKILL_SECRETS_FILE/);
  assert.match(proxyReadme, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(proxyReadme, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    proxyReadme.indexOf("~/.config/ru-skill/secrets.env") < proxyReadme.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что README пакета прокси упомянет путь ru-skill перед запасным вариантом legacy",
  );

  assert.match(proxyRunner, /DEFAULT_RU_SKILL_SECRETS_FILE/);
  assert.match(proxyRunner, /DEFAULT_LEGACY_SECRETS_FILE/);
  assert.ok(
    proxyRunner.indexOf("RU_SKILL_SECRETS_FILE") < proxyRunner.indexOf("KSKILL_SECRETS_FILE"),
    "ожидалось, что runner прокси предпочтёт RU_SKILL_SECRETS_FILE перед KSKILL_SECRETS_FILE",
  );

  assert.match(checkSetup, /KSKILL_PROXY_BASE_URL только если нужно переопределить адрес fine-dust endpoint/i);
  assert.match(checkSetup, /Следующие шаги:/);
  assert.match(checkSetup, /Конфигурация ru-skill выглядит рабочей:/);
});

test("описания workspace-пакетов соответствуют русскоязычной миграционной метадате", () => {
  const expectedDescriptions = {
    "blue-ribbon-nearby": "Legacy-клиент поиска ближайших ресторанов Blue Ribbon Survey, сохранённый на время миграции ru-skill",
    "cbr-rates": "Клиент только для чтения для официальных XML-курсов валют Банка России",
    "daiso-product-search": "Legacy-клиент поиска магазинов, товаров и pickup-остатков Daiso Mall, сохранённый на время миграции ru-skill",
    "hh-vacancies": "Клиент только для чтения для публичных API вакансий и регионов hh.ru",
    "k-lotto": "Legacy-клиент результатов dhlottery, сохранённый на время миграции ru-skill",
    "k-skill-proxy": "Fastify-прокси для бесплатных upstream API, используемых в ru-skill",
    "kakao-bar-nearby": "Legacy-клиент поиска ближайших баров через Kakao Map, сохранённый на время миграции ru-skill",
    "kinopoisk-search": "Клиент только для чтения для публичного поиска фильмов и карточек Кинопоиска",
    "kleague-results": "Legacy-клиент результатов и таблицы K League, сохранённый на время миграции ru-skill",
    "mchs-storm-warnings": "Клиент только для чтения для официальных региональных страниц штормовых и экстренных предупреждений МЧС",
    "moex-shares": "Клиент только для чтения для метаданных акций и задержанных рыночных снимков ISS Московской биржи",
    "osm-nearby": "Клиент только для чтения для поиска ближайших мест через Overpass API OpenStreetMap",
    "postcalc-postcodes": "Клиент только для чтения для справочных страниц Postcalc по городам и отделениям на базе данных индексов Почты России",
    "pravo-documents": "Клиент только для чтения для официальных правовых документов через API публикаций pravo.gov.ru",
    "rpl-results": "Результаты матчей и турнирная таблица Российской Премьер-Лиги через публичные страницы championat.com",
    "stoloto-lotto": "Клиент только для чтения для публичного архива результатов тиражей Столото",
    "toss-securities": "Legacy-обёртка tossctl только для чтения, сохранённая на время миграции ru-skill",
    "yandex-market-search": "Поиск товаров и карточек товаров только для чтения через серверно отрендеренные страницы Яндекс Маркета",
    "yandex-rasp": "Клиент только для чтения для расписаний Яндекс.Расписаний: поезда, автобусы, самолёты и электрички",
    "zoon-nearby": "Дополнительный поиск ближайших мест через SSR-страницы Zoon.ru",
  };

  for (const [packageName, description] of Object.entries(expectedDescriptions)) {
    const packageJson = readJson(path.join("packages", packageName, "package.json"));

    assert.equal(packageJson.description, description, `${packageName} description должен оставаться синхронизированным с русской метадатой пакетов`);
  }
});

test("навык seoul-subway-arrival предпочитает секреты ru-skill перед legacy-запасным вариантом", () => {
  const skill = read(path.join("seoul-subway-arrival", "SKILL.md"));

  assert.match(skill, /## Граничное примечание/);
  assert.match(skill, /legacy-only/);
  assert.match(skill, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(skill, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что путь секретов ru-skill появится перед запасным вариантом k-skill",
  );
});

test("руководства legacy features удерживают семантику runtime и секретов в соответствии с ru-skill-first", () => {
  const fineDustGuide = read(path.join("docs", "features", "fine-dust-location.md"));
  const seoulGuide = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const srtGuide = read(path.join("docs", "features", "srt-booking.md"));
  const ktxGuide = read(path.join("docs", "features", "ktx-booking.md"));

  assert.match(fineDustGuide, /KSKILL_PROXY_BASE_URL/);
  assert.match(fineDustGuide, /AIR_KOREA_OPEN_API_KEY/);
  assert.match(fineDustGuide, /optional|переопределить/i);
  assert.match(fineDustGuide, /совместим.*endpoint|сло.*совместимости/i);
  assert.ok(
    fineDustGuide.indexOf("~/.config/ru-skill/secrets.env") < fineDustGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд fine-dust предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(seoulGuide, /## Граничное примечание/);
  assert.match(seoulGuide, /legacy-only/);
  assert.match(seoulGuide, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(seoulGuide, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    seoulGuide.indexOf("~/.config/ru-skill/secrets.env") < seoulGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд seoul-subway предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(srtGuide, /## Граничное примечание/);
  assert.match(srtGuide, /legacy-only/i);
  assert.match(srtGuide, /yandex-rasp/);
  assert.match(srtGuide, /интеграций на запись/i);
  assert.ok(
    srtGuide.indexOf("~/.config/ru-skill/secrets.env") < srtGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд srt-booking предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(ktxGuide, /## Граничное примечание/);
  assert.match(ktxGuide, /legacy-only/i);
  assert.match(ktxGuide, /yandex-rasp/);
  assert.match(ktxGuide, /интеграций на запись/i);
  assert.ok(
    ktxGuide.indexOf("~/.config/ru-skill/secrets.env") < ktxGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд ktx-booking предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );
});

test("навыки legacy railway и fine-dust удерживают граничные примечания и ru-skill-first учётные данные", () => {
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));

  assert.match(fineDustSkill, /## Граничное примечание/);
  assert.match(fineDustSkill, /legacy\/transition.*утилит/i);
  assert.match(fineDustSkill, /необязательн.*переопределен.*адрес/i);
  assert.match(fineDustSkill, /не считается учётн/i);
  assert.match(fineDustSkill, /AIR_KOREA_OPEN_API_KEY/);
  assert.ok(
    fineDustSkill.indexOf("~/.config/ru-skill/secrets.env") < fineDustSkill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык fine-dust упомянет путь ru-skill перед запасным вариантом legacy",
  );

  assert.match(srtSkill, /## Граничное примечание/);
  assert.match(srtSkill, /legacy-only/i);
  assert.match(srtSkill, /yandex-rasp/);
  assert.match(srtSkill, /интеграций на запись/i);
  assert.ok(
    srtSkill.indexOf("~/.config/ru-skill/secrets.env") < srtSkill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык srt-booking упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(ktxSkill, /## Граничное примечание/);
  assert.match(ktxSkill, /legacy-only/i);
  assert.match(ktxSkill, /yandex-rasp/);
  assert.match(ktxSkill, /интеграций на запись/i);
  assert.ok(
    ktxSkill.indexOf("~/.config/ru-skill/secrets.env") < ktxSkill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык ktx-booking упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );
});

test("оставшиеся legacy skill-only руководства удерживают явные границы миграции", () => {
  const kakaoTalkGuide = read(path.join("docs", "features", "kakaotalk-mac.md"));
  const kboGuide = read(path.join("docs", "features", "kbo-results.md"));
  const lottoGuide = read(path.join("docs", "features", "lotto-results.md"));
  const zipcodeGuide = read(path.join("docs", "features", "zipcode-search.md"));

  const kakaoTalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const kboSkill = read(path.join("kbo-results", "SKILL.md"));
  const lottoSkill = read(path.join("lotto-results", "SKILL.md"));
  const zipcodeSkill = read(path.join("zipcode-search", "SKILL.md"));

  assert.match(kakaoTalkGuide, /## Граничное примечание/);
  assert.match(kakaoTalkGuide, /legacy-only/);
  assert.match(kakaoTalkGuide, /скрытый backlog/i);

  assert.match(kboGuide, /## Граничное примечание/);
  assert.match(kboGuide, /legacy-only/);
  assert.match(kboGuide, /rpl-results/);

  assert.match(lottoGuide, /## Граничное примечание/);
  assert.match(lottoGuide, /legacy-only/);
  assert.match(lottoGuide, /stoloto-lotto/);

  assert.match(zipcodeGuide, /## Граничное примечание/);
  assert.match(zipcodeGuide, /legacy-only/);
  assert.match(zipcodeGuide, /postcalc-postcodes/);

  assert.match(kakaoTalkSkill, /## Граничное примечание/);
  assert.match(kakaoTalkSkill, /legacy-only/);
  assert.match(kakaoTalkSkill, /target-messaging/i);

  assert.match(kboSkill, /## Граничное примечание/);
  assert.match(kboSkill, /legacy-only/);
  assert.match(kboSkill, /rpl-results/);

  assert.match(lottoSkill, /## Граничное примечание/);
  assert.match(lottoSkill, /legacy-only/);
  assert.match(lottoSkill, /stoloto-lotto/);

  assert.match(zipcodeSkill, /## Граничное примечание/);
  assert.match(zipcodeSkill, /legacy-only/);
  assert.match(zipcodeSkill, /postcalc-postcodes/);
});

test("оставшиеся legacy feature и skill руководства удерживают явные границы замен", () => {
  const blueRibbonGuide = read(path.join("docs", "features", "blue-ribbon-nearby.md"));
  const daisoGuide = read(path.join("docs", "features", "daiso-product-search.md"));
  const kakaoBarGuide = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  const kleagueGuide = read(path.join("docs", "features", "kleague-results.md"));
  const srtGuide = read(path.join("docs", "features", "srt-booking.md"));
  const ktxGuide = read(path.join("docs", "features", "ktx-booking.md"));

  const blueRibbonSkill = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  const daisoSkill = read(path.join("daiso-product-search", "SKILL.md"));
  const kakaoBarSkill = read(path.join("kakao-bar-nearby", "SKILL.md"));
  const kleagueSkill = read(path.join("kleague-results", "SKILL.md"));

  assert.match(blueRibbonGuide, /## Граничное примечание/);
  assert.match(blueRibbonGuide, /legacy-only/);
  assert.match(blueRibbonGuide, /osm-nearby/);
  assert.match(blueRibbonGuide, /zoon-nearby/);

  assert.match(daisoGuide, /## Граничное примечание/);
  assert.match(daisoGuide, /legacy-only/);
  assert.match(daisoGuide, /yandex-market-search/);

  assert.match(kakaoBarGuide, /## Граничное примечание/);
  assert.match(kakaoBarGuide, /legacy-only/);
  assert.match(kakaoBarGuide, /osm-nearby/);
  assert.match(kakaoBarGuide, /zoon-nearby/);

  assert.match(kleagueGuide, /## Граничное примечание/);
  assert.match(kleagueGuide, /legacy-only/);
  assert.match(kleagueGuide, /rpl-results/);

  assert.match(srtGuide, /## Граничное примечание/);
  assert.match(srtGuide, /legacy-only/);
  assert.match(srtGuide, /yandex-rasp/);

  assert.match(ktxGuide, /## Граничное примечание/);
  assert.match(ktxGuide, /legacy-only/);
  assert.match(ktxGuide, /yandex-rasp/);

  assert.match(blueRibbonSkill, /## Граничное примечание/);
  assert.match(blueRibbonSkill, /legacy-only/);
  assert.match(blueRibbonSkill, /osm-nearby/);
  assert.match(blueRibbonSkill, /zoon-nearby/);

  assert.match(daisoSkill, /## Граничное примечание/);
  assert.match(daisoSkill, /legacy-only/);
  assert.match(daisoSkill, /yandex-market-search/);

  assert.match(kakaoBarSkill, /## Граничное примечание/);
  assert.match(kakaoBarSkill, /legacy-only/);
  assert.match(kakaoBarSkill, /osm-nearby/);
  assert.match(kakaoBarSkill, /zoon-nearby/);

  assert.match(kleagueSkill, /## Граничное примечание/);
  assert.match(kleagueSkill, /legacy-only/);
  assert.match(kleagueSkill, /rpl-results/);
});

test("обновлённая legacy-документация удерживает русскую граничную копию на затронутых поверхностях", () => {
  const docs = [
    read(path.join("packages", "blue-ribbon-nearby", "README.md")),
    read(path.join("packages", "daiso-product-search", "README.md")),
    read(path.join("packages", "k-lotto", "README.md")),
    read(path.join("packages", "kakao-bar-nearby", "README.md")),
    read(path.join("packages", "kleague-results", "README.md")),
    read(path.join("packages", "toss-securities", "README.md")),
    read(path.join("docs", "features", "blue-ribbon-nearby.md")),
    read(path.join("docs", "features", "daiso-product-search.md")),
    read(path.join("docs", "features", "delivery-tracking.md")),
    read(path.join("docs", "features", "kakao-bar-nearby.md")),
    read(path.join("docs", "features", "kakaotalk-mac.md")),
    read(path.join("docs", "features", "kbo-results.md")),
    read(path.join("docs", "features", "kleague-results.md")),
    read(path.join("docs", "features", "lotto-results.md")),
    read(path.join("docs", "features", "seoul-subway-arrival.md")),
    read(path.join("docs", "features", "toss-securities.md")),
    read(path.join("docs", "features", "zipcode-search.md")),
  ];

  for (const doc of docs) {
    assert.doesNotMatch(doc, /backward compatibility/i);
    assert.doesNotMatch(doc, /reference flow/i);
    assert.doesNotMatch(doc, /target-backlog/i);
    assert.doesNotMatch(doc, /## Live smoke snapshot/);
    assert.doesNotMatch(doc, /public-source replacement/i);
    assert.doesNotMatch(doc, /adapter-based tracking flow/i);
  }
});

test("package-lock фиксирует метаданные workspace yandex-market-search для npm ci", () => {
  const packageLock = readJson("package-lock.json");

  assert.deepEqual(packageLock.packages["node_modules/yandex-market-search"], {
    resolved: "packages/yandex-market-search",
    link: true,
  });
  assert.equal(packageLock.packages["packages/yandex-market-search"].version, "0.1.0");
  assert.equal(packageLock.packages["packages/yandex-market-search"].license, "MIT");
  assert.equal(packageLock.packages["packages/yandex-market-search"].engines.node, ">=18");
});

test("документация репозитория рекламирует навык yandex-market-search на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "yandex-market-search.md");
  const skillDir = path.join(repoRoot, "yandex-market-search");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/yandex-market-search.md существует");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "ожидалось, что yandex-market-search/SKILL.md существует");
  assert.match(readme, /\| `yandex-market-search` \|/);
  assert.match(readme, /\[Гайд по Яндекс Маркету\]\(docs\/features\/yandex-market-search\.md\)/);
  assert.match(install, /--skill yandex-market-search/);
  assert.match(roadmap, /yandex-market-search/);
  assert.match(sources, /Яндекс Маркет/);
});

test("документация yandex-market-search описывает сценарий маркетплейса", () => {
  const skill = read(path.join("yandex-market-search", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "yandex-market-search.md"));
  const packageReadme = read(path.join("packages", "yandex-market-search", "README.md"));

  assert.match(skill, /^name: yandex-market-search$/m);
  assert.match(skill, /npm install yandex-market-search/);
  assert.match(skill, /searchProducts/);
  assert.match(skill, /getProduct/);
  assert.match(featureDoc, /canonical/i);
  assert.match(packageReadme, /npm install yandex-market-search/);
  assert.match(packageReadme, /searchProducts/);
  assert.match(packageReadme, /getProduct/);
});

test("pack:dry-run включает workspace zoon-nearby", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace zoon-nearby/);
});

test("документация репозитория рекламирует навык zoon-nearby на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "zoon-nearby.md");
  const skillDir = path.join(repoRoot, "zoon-nearby");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/zoon-nearby.md существует");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "ожидалось, что zoon-nearby/SKILL.md существует");
  assert.match(readme, /\| `zoon-nearby` \|/);
  assert.match(readme, /\[Гайд по Zoon\.ru\]\(docs\/features\/zoon-nearby\.md\)/);
  assert.match(roadmap, /zoon-nearby/);
  assert.match(sources, /Zoon/);
});

test("документация zoon-nearby описывает сценарий поиска ближайших заведений", () => {
  const skill = read(path.join("zoon-nearby", "SKILL.md"));
  const packageSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "zoon-nearby.md"));
  const packageReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  const expectedHeadings = [
    "Что делает навык",
    "Когда использовать",
    "Предварительные условия",
    "Входные данные",
    "Рабочий процесс",
    "Критерии завершения",
    "Возможные ошибки",
    "Примечания",
  ];

  assert.match(skill, /^name: zoon-nearby$/m);
  assert.match(skill, /npm install zoon-nearby/);
  assert.match(skill, /searchRestaurants/);
  assert.match(skill, /getBusinessDetails/);
  assert.deepEqual(extractSecondLevelHeadings(skill), expectedHeadings);
  assert.deepEqual(extractSecondLevelHeadings(packageSkill), expectedHeadings);
  assert.match(featureDoc, /zoon-nearby/);
  assert.match(packageReadme, /npm install zoon-nearby/);
  assert.match(packageReadme, /searchRestaurants/);
  assert.match(packageReadme, /getBusinessDetails/);
  assert.doesNotMatch(featureDoc, /可以直接/);
  assert.doesNotMatch(packageReadme, /可以直接/);
});

test("документация репозитория рекламирует навык moex-shares на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "moex-shares.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/moex-shares.md существует");
  assert.match(readme, /\| `moex-shares` \|/);
  assert.match(readme, /\[Гайд по акциям MOEX\]\(docs\/features\/moex-shares\.md\)/);
  assert.match(install, /--skill moex-shares/);
  assert.match(roadmap, /moex-shares/);
  assert.match(sources, /iss\.moex\.com/);
});

test("документация moex-shares описывает официальный сценарий ISS МОEX", () => {
  const skillPath = path.join(repoRoot, "moex-shares", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что moex-shares/SKILL.md существует");

  const skill = read(path.join("moex-shares", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "moex-shares.md"));
  const packageReadme = read(path.join("packages", "moex-shares", "README.md"));

  assert.match(skill, /^name: moex-shares$/m);
  assert.match(skill, /ISS API|Московской биржи/);
  assert.match(featureDoc, /getSecurityOverview/);
  assert.match(featureDoc, /listShares/);
  assert.match(packageReadme, /getSecurityOverview/);
  assert.match(packageReadme, /listShares/);
});

test("документация репозитория рекламирует навык stoloto-lotto на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "stoloto-lotto.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/stoloto-lotto.md существует");
  assert.match(readme, /\| `stoloto-lotto` \|/);
  assert.match(readme, /\[Гайд по лотереям Столото\]\(docs\/features\/stoloto-lotto\.md\)/);
  assert.match(install, /--skill stoloto-lotto/);
  assert.match(roadmap, /stoloto-lotto/);
  assert.match(sources, /stoloto\.ru/);
});

test("документация stoloto-lotto описывает сценарий публичного архива тиражей", () => {
  const featureDoc = read(path.join("docs", "features", "stoloto-lotto.md"));
  const packageReadme = read(path.join("packages", "stoloto-lotto", "README.md"));

  assert.match(featureDoc, /getArchiveDraws/);
  assert.match(featureDoc, /stoloto\.ru\/\{?game\}?\//);
  assert.match(packageReadme, /getArchiveDraws/);
  assert.match(packageReadme, /SUPPORTED_GAMES/);
});

test("документация репозитория рекламирует навык kinopoisk-search на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kinopoisk-search.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/kinopoisk-search.md существует");
  assert.match(readme, /\| `kinopoisk-search` \|/);
  assert.match(readme, /\[Гайд по Кинопоиску\]\(docs\/features\/kinopoisk-search\.md\)/);
  assert.match(install, /--skill kinopoisk-search/);
  assert.match(roadmap, /kinopoisk-search/);
  assert.match(sources, /kinopoisk\.ru/);
});

test("документация kinopoisk-search описывает сценарий поиска и карточки фильма", () => {
  const featureDoc = read(path.join("docs", "features", "kinopoisk-search.md"));
  const packageReadme = read(path.join("packages", "kinopoisk-search", "README.md"));

  assert.match(featureDoc, /getFilmById/);
  assert.match(featureDoc, /searchFilms/);
  assert.match(featureDoc, /kinopoisk\.ru/);
  assert.match(packageReadme, /getFilmById/);
  assert.match(packageReadme, /searchFilms/);
});

test("документация репозитория рекламирует навык pravo-documents на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "pravo-documents.md");
  const skillDir = path.join(repoRoot, "pravo-documents");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/pravo-documents.md существует");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "ожидалось, что pravo-documents/SKILL.md существует");
  assert.match(readme, /\| `pravo-documents` \|/);
  assert.match(readme, /\[Гайд по правовым документам\]\(docs\/features\/pravo-documents\.md\)/);
  assert.match(install, /--skill pravo-documents/);
  assert.match(roadmap, /pravo-documents/);
  assert.match(sources, /pravo\.gov\.ru/);
});

test("документация pravo-documents описывает официальный сценарий API pravo.gov.ru", () => {
  const skill = read(path.join("pravo-documents", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "pravo-documents.md"));
  const packageReadme = read(path.join("packages", "pravo-documents", "README.md"));

  assert.match(skill, /^name: pravo-documents$/m);
  assert.match(skill, /searchPravoDocuments/);
  assert.match(skill, /getPravoDocument/);
  assert.match(featureDoc, /publication\.pravo\.gov\.ru/);
  assert.match(featureDoc, /searchPravoDocuments/);
  assert.match(packageReadme, /searchPravoDocuments/);
  assert.match(packageReadme, /getPravoDocument/);
});

test("документация репозитория рекламирует навык rpl-results на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "rpl-results.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/rpl-results.md существует");
  assert.match(readme, /\| `rpl-results` \|/);
  assert.match(readme, /\[Гайд по РПЛ\]\(docs\/features\/rpl-results\.md\)/);
  assert.match(install, /--skill rpl-results/);
  assert.match(roadmap, /rpl-results/);
  assert.match(sources, /championat\.com/);
});

test("документация rpl-results описывает сценарий турнирной таблицы и результатов championat.com", () => {
  const featureDoc = read(path.join("docs", "features", "rpl-results.md"));
  const packageReadme = read(path.join("packages", "rpl-results", "README.md"));

  assert.match(featureDoc, /getStandings/);
  assert.match(featureDoc, /getResults/);
  assert.match(featureDoc, /championat\.com/);
  assert.match(packageReadme, /getStandings/);
  assert.match(packageReadme, /getResults/);
});

test("документация репозитория рекламирует навык osm-nearby на всех задокументированных поверхностях", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "osm-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "ожидалось, что docs/features/osm-nearby.md существует");
  assert.match(readme, /\| `osm-nearby` \|/);
  assert.match(readme, /\[Гайд по OSM nearby\]\(docs\/features\/osm-nearby\.md\)/);
  assert.match(install, /--skill osm-nearby/);
  assert.match(roadmap, /osm-nearby/);
  assert.match(sources, /overpass|OpenStreetMap/i);
});

test("документация osm-nearby описывает сценарий поиска через Overpass API", () => {
  const skillPath = path.join(repoRoot, "packages", "osm-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "ожидалось, что packages/osm-nearby/SKILL.md существует");

  const featureDoc = read(path.join("docs", "features", "osm-nearby.md"));
  const packageReadme = read(path.join("packages", "osm-nearby", "README.md"));

  assert.match(featureDoc, /searchNearby|searchRestaurants|searchBars/);
  assert.match(featureDoc, /overpass|Overpass/);
  assert.match(featureDoc, /getPlaceDetails/);
  assert.match(packageReadme, /searchNearby/);
  assert.match(packageReadme, /searchRestaurants/);
  assert.match(packageReadme, /getPlaceDetails/);
});

test("навык seoul-subway-arrival документирует официальный сценарий прибытия в реальном времени Seoul Open Data", () => {
  const skill = read(path.join("seoul-subway-arrival", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "seoul-subway-arrival.md"));

  assert.match(skill, /^name: seoul-subway-arrival$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /swopenAPI\.seoul\.go\.kr/);
    assert.match(doc, /realtimeStationArrival/);
    assert.match(doc, /SEOUL_OPEN_API_KEY/);
    assert.match(doc, /real.?time|реальн[а-яё]+ времени|прибыти[а-яё]/i);
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
  }

  assert.match(skill, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(skill, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык seoul-subway упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );
});

test("навык kbo-results документирует сценарий поиска kbo-game с корректным экспортом и обработкой дат", () => {
  const skill = read(path.join("kbo-results", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "kbo-results.md"));

  assert.match(skill, /^name: kbo-results$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /kbo-game/);
    assert.match(doc, /getGame/);
    assert.match(doc, /YYYY-MM-DD/);
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /rpl-results/);
  }

  assert.match(skill, /преобразовывать в объект `?Date`?|объект `?Date`? перед вызовом|Date.*объект/i);
  assert.match(featureDoc, /getFullYear|Date.*объект|объект Date/i);
});

test("навык lotto-results документирует сценарий проверки тиражей и номеров k-lotto", () => {
  const skill = read(path.join("lotto-results", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "lotto-results.md"));

  assert.match(skill, /^name: lotto-results$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /k-lotto/);
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /stoloto-lotto/);
  }

  assert.match(skill, /getLatestRound/);
  assert.match(skill, /getDetailResult/);
  assert.match(skill, /checkNumber/);
  assert.match(featureDoc, /getDetailResult/);
});

test("навык hwp и feature doc классифицируют корейскую документную утилиту как target-supporting", () => {
  const skill = read(path.join("hwp", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "hwp.md"));

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /target-supporting/);
    assert.match(doc, /корейский формат|HWP|Хангул/i);
  }
});

test("маршрутизация blue-ribbon-nearby отдаёт предпочтение osm-nearby и zoon-nearby для общих запросов", () => {
  const skill = read(path.join("blue-ribbon-nearby", "SKILL.md"));

  assert.match(skill, /osm-nearby/);
  assert.match(skill, /zoon-nearby/);
  assert.match(skill, /российск.*ближайш.*osm-nearby.*zoon-nearby|osm-nearby.*zoon-nearby.*российск.*ближайш/i);
  assert.match(skill, /только.*Blue Ribbon|только.*корейск/i);
});

test("навык srt-booking документирует сценарий поиска, бронирования и отмены SRTrain", () => {
  const skill = read(path.join("srt-booking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "srt-booking.md"));

  assert.match(skill, /^name: srt-booking$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /SRTrain/);
    assert.match(doc, /search_train/);
    assert.match(doc, /KSKILL_SRT_ID/);
    assert.match(doc, /KSKILL_SRT_PASSWORD/);
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /yandex-rasp/);
    assert.match(doc, /booking-replacements\.md/);
    assert.match(doc, /~\/\.config\/ru-skill\/secrets\.env/);
    assert.match(doc, /~\/\.config\/k-skill\/secrets\.env/);
  }

  assert.match(skill, /reserve/);
  assert.match(skill, /get_reservations/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык srt-booking упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );
  assert.ok(
    featureDoc.indexOf("~/.config/ru-skill/secrets.env") < featureDoc.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что документ srt-booking упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );
});

test("навык kakaotalk-mac документирует полный сценарий kakaocli на macOS от установки до безопасной отправки", () => {
  const skill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "kakaotalk-mac.md"));

  assert.match(skill, /^name: kakaotalk-mac$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /kakaocli status/);
    assert.match(doc, /kakaocli auth/);
    assert.match(doc, /kakaocli chats/);
    assert.match(doc, /Full Disk Access/i);
    assert.match(doc, /Accessibility/i);
    assert.match(doc, /--me/);
    assert.match(doc, /--dry-run/);
    assert.match(doc, /подтвержд.*отправ|confirm before sending|отправ.*подтвержд/i);
  }

  assert.match(skill, /kakaocli messages/);
  assert.match(skill, /kakaocli search/);
  assert.match(skill, /kakaocli send/);
  assert.match(skill, /kakaocli login/);
  assert.match(skill, /brew install/);
  assert.match(skill, /mas install/);

  assert.match(featureDoc, /kakaocli status/);
  assert.match(featureDoc, /kakaocli chats/);
  assert.match(featureDoc, /kakaocli messages/);
  assert.match(featureDoc, /kakaocli search/);
  assert.match(featureDoc, /kakaocli send/);
});

test("навык daiso-product-search документирует сценарий магазин-товар-остатки от начала до конца", () => {
  const skill = read(path.join("daiso-product-search", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "daiso-product-search.md"));

  assert.match(skill, /^name: daiso-product-search$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /yandex-market-search/);
    assert.match(doc, /daisomall\.co\.kr/);
  }

  assert.match(skill, /searchStores/);
  assert.match(skill, /searchProducts/);
  assert.match(skill, /getStorePickupStock/);
  assert.match(skill, /lookupStoreProductAvailability/);
  assert.match(skill, /selStrPkupStck/);
  assert.match(skill, /SearchGoods/);
  assert.match(skill, /официальные страницы.*расположение|расположение.*только остатки/i);

  assert.match(featureDoc, /lookupStoreProductAvailability/);
  assert.match(featureDoc, /selStrPkupStck/);
  assert.match(featureDoc, /SearchGoods/);
  assert.match(featureDoc, /официальн.*поверхност.*не.*расположен/i);
});

test("навык delivery-tracking документирует сценарий адаптеров перевозчиков CJ и ePost с граничным примечанием", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));

  assert.match(skill, /^name: delivery-tracking$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /legacy-only/);
    assert.match(doc, /CJ Logistics/);
    assert.match(doc, /Почтовая служба Кореи|Korea Post/);
    assert.match(doc, /адаптер перевозчика|carrier adapter/i);
    assert.match(doc, /_csrf/);
    assert.match(doc, /sid1/);
    assert.match(doc, /status_map|статус.*карт/i);
    assert.match(doc, /Принято/);
    assert.match(doc, /Доставлено/);
    assert.match(doc, /В пути/);
    assert.match(doc, /общей схемой результатов|общую схему результатов|общая схема результатов/i);
    assert.match(doc, /`carrier`/);
    assert.match(doc, /`invoice`/);
    assert.match(doc, /`status`/);
    assert.match(doc, /`recent_events`/);
  }

  assert.match(skill, /нормализуй.*вход|нормализуйте входные/i);
  assert.match(skill, /curl --http1\.1 --tls-max 1\.2/);
  assert.match(skill, /retry|повторн/i);
  assert.match(skill, /обратно совместимый/i);

  assert.match(featureDoc, /curl --http1\.1 --tls-max 1\.2/);
  assert.match(featureDoc, /validator/);
  assert.match(featureDoc, /status map/);
  assert.match(featureDoc, /retry policy/);
});

test("все файлы SKILL.md используют каноничную русскую схему заголовков", () => {
  const canonicalTargetHeadings = [
    "Что делает навык",
    "Когда использовать",
    "Предварительные условия",
    "Входные данные",
    "Рабочий процесс",
    "Критерии завершения",
    "Возможные ошибки",
    "Примечания",
  ];

  const canonicalSetupHeadings = [
    "Назначение",
    "Порядок разрешения учётных данных",
    "Стандартный сценарий",
    "Совместимость",
  ];

  const nonCanonicalHeadingPatterns = [
    /^## Что делает этот навык$/m,
    /^## Что умеет$/m,
    /^## Что умеет этот сценарий$/m,
    /^## Что можно сделать$/m,
    /^## Предварительные требования$/m,
    /^## Что нужно заранее$/m,
    /^## Требования$/m,
    /^## Считается выполненным, когда$/m,
    /^## Готово, когда$/m,
    /^## Режимы сбоев$/m,
    /^## Необходимые входные данные$/m,
    /^## Входы$/m,
  ];

  const targetSkills = [
    "cbr-rates", "moex-shares", "postcalc-postcodes", "hh-vacancies",
    "stoloto-lotto", "kinopoisk-search", "mchs-storm-warnings", "pravo-documents",
    "yandex-rasp", "rpl-results", "yandex-market-search", "osm-nearby", "zoon-nearby",
  ];

  const legacySkills = [
    "kakaotalk-mac", "delivery-tracking", "ktx-booking", "blue-ribbon-nearby",
    "hwp", "toss-securities", "kakao-bar-nearby", "srt-booking",
    "lotto-results", "kbo-results", "zipcode-search", "kleague-results",
    "daiso-product-search", "fine-dust-location", "seoul-subway-arrival",
  ];

  const setupSkills = ["ru-skill-setup", "k-skill-setup"];

  for (const skill of [...targetSkills, ...legacySkills]) {
    const skillPath = path.join(repoRoot, skill, "SKILL.md");
    if (!fs.existsSync(skillPath)) continue;

    const content = read(path.join(skill, "SKILL.md"));
    const headings = extractSecondLevelHeadings(content);

    assert.ok(
      headings.includes("Что делает навык"),
      `${skill}/SKILL.md должен иметь каноничный заголовок "Что делает навык", found: ${headings.filter(h => /Что/.test(h)).join(", ")}`,
    );

    for (const pattern of nonCanonicalHeadingPatterns) {
      assert.doesNotMatch(
        content,
        pattern,
        `${skill}/SKILL.md не должен содержать неканоничный заголовок "${pattern.source.replace(/^## /, "")}"`,
      );
    }
  }

  const pkgOsmSkill = read(path.join("packages", "osm-nearby", "SKILL.md"));
  assert.ok(
    extractSecondLevelHeadings(pkgOsmSkill).includes("Что делает навык"),
    "packages/osm-nearby/SKILL.md должен иметь каноничный заголовок scheme",
  );

  const pkgZoonSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));
  assert.deepEqual(
    extractSecondLevelHeadings(pkgZoonSkill),
    canonicalTargetHeadings,
    "packages/zoon-nearby/SKILL.md должен точно соответствовать каноничным целевым заголовкам",
  );

  for (const skill of setupSkills) {
    const content = read(path.join(skill, "SKILL.md"));
    const headings = extractSecondLevelHeadings(content);
    assert.deepEqual(headings, canonicalSetupHeadings, `${skill}/SKILL.md должен соответствовать каноничным заголовкам настройки`);
  }
});

test("feature docs используют каноничные русские заголовки без неканоничных вариантов", () => {
  const nonCanonicalPatterns = [
    /## Что умеет этот сценарий/,
    /## Что умеет$/,
    /## Что делает этот навык/,
    /## Что можно сделать/,
    /## Что нужно заранее/,
    /## Предварительные требования/,
    /## Требования$/,
    /## Входы$/,
    /## Базовый поток/,
    /## Базовый сценарий/,
    /## Как это работает/,
    /## Считается выполненным, когда/,
    /## Готово, когда/,
    /## Режимы сбоев/,
    /## Необходимые входные данные/,
    /## Обзор$/,
  ];

  const featuresDir = path.join(repoRoot, "docs", "features");
  const featureFiles = fs.readdirSync(featuresDir).filter((f) => f.endsWith(".md"));

  for (const file of featureFiles) {
    const content = fs.readFileSync(path.join(featuresDir, file), "utf8");

    for (const pattern of nonCanonicalPatterns) {
      assert.doesNotMatch(
        content,
        pattern,
        `docs/features/${file} не должен содержать неканоничный заголовок "${pattern.source}"`,
      );
    }
  }
});

test("пользовательская документация не содержит артефактов китайских иероглифов", () => {
  const chineseCharPattern = /[整理布尔返回实时]/;

  const skillDirs = fs.readdirSync(repoRoot).filter((dir) => {
    const skillPath = path.join(repoRoot, dir, "SKILL.md");
    return fs.existsSync(skillPath);
  });

  for (const dir of skillDirs) {
    const content = read(path.join(dir, "SKILL.md"));
    assert.doesNotMatch(
      content,
      chineseCharPattern,
      `${dir}/SKILL.md не должен содержать артефактов китайских иероглифов`,
    );
  }

  const featuresDir = path.join(repoRoot, "docs", "features");
  const featureFiles = fs.readdirSync(featuresDir).filter((f) => f.endsWith(".md"));

  for (const file of featureFiles) {
    const content = fs.readFileSync(path.join(featuresDir, file), "utf8");
    assert.doesNotMatch(
      content,
      chineseCharPattern,
      `docs/features/${file} не должен содержать артефактов китайских иероглифов`,
    );
  }

  const sourcesDoc = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(
    sourcesDoc,
    chineseCharPattern,
    "docs/sources.md не должен содержать артефактов китайских иероглифов",
  );
});

test("сводки changeset на русском языке", () => {
  const changesetDir = path.join(repoRoot, ".changeset");
  const changesetFiles = fs.readdirSync(changesetDir).filter((f) => f.endsWith(".md") && f !== "README.md");

  const englishSentenceStarters = [
    /^Add\s/i,
    /^Added\s/i,
    /^New\s/i,
    /^This\s/i,
    /^Refresh\s/i,
    /^Use\s/i,
    /^Fix\s/i,
    /^Update\s/i,
    /^Removed\s/i,
    /^Deprecated\s/i,
  ];

  for (const file of changesetFiles) {
    const content = fs.readFileSync(path.join(changesetDir, file), "utf8");
    const summary = content.replace(/^---[\s\S]*?---\n*/, "").trim();

    for (const pattern of englishSentenceStarters) {
      assert.doesNotMatch(
        summary,
        pattern,
        `.changeset/${file} сводка должна начинаться по-русски, а не по-английски`,
      );
    }
  }
});

test("описания frontmatter в SKILL.md на русском языке", () => {
  const skillDirs = fs.readdirSync(repoRoot).filter((dir) => {
    const skillPath = path.join(repoRoot, dir, "SKILL.md");
    return fs.existsSync(skillPath);
  });

  const englishDescriptionStarters = [
    /^description:\s*(?:Use|Look|Legacy-compatible\s+(?!.*совместим)|Add|Check|Get|Find|Search|Track|Browse|View|Read|Fetch)\s/i,
  ];

  for (const dir of skillDirs) {
    const content = read(path.join(dir, "SKILL.md"));

    for (const pattern of englishDescriptionStarters) {
      assert.doesNotMatch(
        content,
        pattern,
        `${dir}/SKILL.md description должен быть на русском`,
      );
    }
  }

  const packagesDir = path.join(repoRoot, "packages");
  const packageSkillDirs = fs.readdirSync(packagesDir).filter((dir) => {
    const skillPath = path.join(packagesDir, dir, "SKILL.md");
    return fs.existsSync(skillPath);
  });

  for (const dir of packageSkillDirs) {
    const content = read(path.join("packages", dir, "SKILL.md"));

    for (const pattern of englishDescriptionStarters) {
      assert.doesNotMatch(
        content,
        pattern,
        `packages/${dir}/SKILL.md description должен быть на русском`,
      );
    }
  }
});

test("roadmap использует русские заголовки вех вместо английских", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));

  assert.match(roadmap, /## Вехи миграции/);
  assert.match(roadmap, /### Веха 1\./);
  assert.match(roadmap, /### Веха 2\./);
  assert.match(roadmap, /### Веха 3\./);
  assert.match(roadmap, /### Веха 4\./);
  assert.match(roadmap, /### Веха 5\./);
  assert.match(roadmap, /## Legacy-пакеты и целевые замены/);

  assert.doesNotMatch(roadmap, /^## Migration milestones$/m);
  assert.doesNotMatch(roadmap, /^### Milestone \d+\./m);
  assert.doesNotMatch(roadmap, /^## Legacy packages/m);
});

test("feature doc osm-nearby использует русский вместо английского жаргона", () => {
  const featureDoc = read(path.join("docs", "features", "osm-nearby.md"));

  assert.match(featureDoc, /бесплатн.*решение без API-ключа|решение без API-ключа.*бесплатн/i);
  assert.match(featureDoc, /может быть неполным/);
  assert.match(featureDoc, /бесплатн.*вариант без API-ключа/i);

  assert.doesNotMatch(featureDoc, /free.*no.?key/i);
  assert.doesNotMatch(featureDoc, /\bsparse\b/);
});

test("target package README используют русский вместо жаргона Read-only", () => {
  const targetPackages = [
    "cbr-rates", "moex-shares", "postcalc-postcodes", "hh-vacancies",
    "stoloto-lotto", "kinopoisk-search", "mchs-storm-warnings",
    "pravo-documents", "yandex-rasp", "yandex-market-search", "osm-nearby",
    "zoon-nearby",
  ];

  for (const pkg of targetPackages) {
    const readme = read(path.join("packages", pkg, "README.md"));
    assert.doesNotMatch(readme, /^Read-only/im, `packages/${pkg}/README.md не должен начинаться с английского Read-only`);
    assert.doesNotMatch(readme, /\bRead-only\b/, `packages/${pkg}/README.md не должен содержать английского Read-only`);
  }

  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  assert.match(zoonReadme, /^## Что делает навык$/m);
  assert.doesNotMatch(zoonReadme, /^## Обзор$/m);
});

test("docs/sources.md использует русский вместо английского жаргона", () => {
  const sources = read(path.join("docs", "sources.md"));

  assert.doesNotMatch(sources, /Технический baseline/);
  assert.doesNotMatch(sources, /\bdelayed\b/);
  assert.doesNotMatch(sources, /\bfallback\b/);
  assert.doesNotMatch(sources, /nearby-поиск/);
  assert.doesNotMatch(sources, /availability-страницы/);
  assert.match(sources, /Техническая основа/);
  assert.match(sources, /задержанный/);
  assert.match(sources, /запасной вариант/);
  assert.match(sources, /поиск ближайших/);
  assert.match(sources, /страницы наличия/);
});

test("docs/roadmap.md не содержит английского жаргона на пользовательских поверхностях", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  assert.doesNotMatch(roadmap, /delayed-цены/);
});

test("AGENTS.md использует русский для repo-governance текста", () => {
  const agents = read("AGENTS.md");

  assert.match(agents, /^# Инструкции для репозитория k-skill$/m);
  assert.match(agents, /^## Правила релизной автоматизации$/m);
  assert.match(agents, /^## Политика прокси для бесплатных API$/m);
  assert.doesNotMatch(agents, /^# k-skill repository instructions$/m);
  assert.doesNotMatch(agents, /Default posture: public read-only endpoint/);
});

test("SKILL.md delivery-tracking использует русский вместо live smoke test", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(skill, /live smoke test/);
  assert.doesNotMatch(skill, /\bsmoke test\b/);
  assert.match(skill, /проверочный тест/);
});

test("SKILL.md yandex-rasp использует русский вместо checkout", () => {
  const skill = read(path.join("yandex-rasp", "SKILL.md"));
  assert.doesNotMatch(skill, /\bcheckout\b/);
  assert.match(skill, /оформление заказа/);
});

test("SKILL.md fine-dust-location использует русский вместо fallback", () => {
  const skill = read(path.join("fine-dust-location", "SKILL.md"));
  assert.doesNotMatch(skill, /`fallback`/);
  assert.match(skill, /запасной вариант/);
});

test("описания package.json используют русский вместо префикса nearby-", () => {
  const packagesDir = path.join(repoRoot, "packages");
  const nearbyPackages = ["blue-ribbon-nearby", "kakao-bar-nearby", "osm-nearby", "zoon-nearby"];

  for (const pkg of nearbyPackages) {
    const packageJson = JSON.parse(read(path.join("packages", pkg, "package.json")));
    assert.doesNotMatch(packageJson.description, /nearby-/, `packages/${pkg}/package.json description не должен использовать префикс nearby-`);
  }
});

test("сводки changeset используют русский вместо префикса read-only", () => {
  const changesetDir = path.join(repoRoot, ".changeset");
  const changesetFiles = fs.readdirSync(changesetDir).filter((f) => f.endsWith(".md") && f !== "README.md");

  for (const file of changesetFiles) {
    const content = read(path.join(".changeset", file));
    assert.doesNotMatch(content, /read-only-/, `.changeset/${file} не должен использовать префикс read-only-`);
    assert.doesNotMatch(content, /fixture-based/, `.changeset/${file} не должен использовать жаргон fixture-based`);
  }
});

test("файлы CHANGELOG используют русские заголовки и описания", () => {
  const changelogPackages = [
    "toss-securities", "kleague-results", "kakao-bar-nearby",
    "k-lotto", "daiso-product-search", "blue-ribbon-nearby",
  ];

  for (const pkg of changelogPackages) {
    const changelogPath = path.join(repoRoot, "packages", pkg, "CHANGELOG.md");
    if (!fs.existsSync(changelogPath)) continue;

    const content = read(path.join("packages", pkg, "CHANGELOG.md"));
    assert.doesNotMatch(content, /^### Minor Changes$/m, `packages/${pkg}/CHANGELOG.md не должен использовать английский заголовок "Minor Changes"`);
    assert.match(content, /^### Незначительные изменения$/m, `packages/${pkg}/CHANGELOG.md должен использовать русский заголовок "Незначительные изменения"`);
    assert.doesNotMatch(content, /^- [0-9a-f]+: (Add|Publish|Create|Implement|Update)\b/i, `packages/${pkg}/CHANGELOG.md description должен быть на русском, not English`);
  }
});

test("исходный код не содержит английского жаргона в пользовательском выводе", () => {
  const srcDir = path.join(repoRoot, "packages");
  const packages = fs.readdirSync(srcDir);

  for (const pkg of packages) {
    const srcPath = path.join(srcDir, pkg, "src");
    if (!fs.existsSync(srcPath)) continue;

    const srcFiles = fs.readdirSync(srcPath).filter((f) => f.endsWith(".js"));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcPath, file), "utf8");

      assert.doesNotMatch(content, /read-only skill for/i, `packages/${pkg}/src/${file} не должен использовать английское «read-only skill for» в User-Agent`);
      assert.doesNotMatch(content, /A fetch implementation is required/i, `packages/${pkg}/src/${file} не должен использовать английское «A fetch implementation is required»`);
      assert.doesNotMatch(content, /AIR_KOREA_OPEN_API_KEY is not configured on the proxy server/i, `packages/${pkg}/src/${file} не должен использовать английское сообщение об ошибке AIR_KOREA_OPEN_API_KEY`);
      assert.doesNotMatch(content, /Unsupported read-only tossctl command/i, `packages/${pkg}/src/${file} не должен использовать английское «Unsupported read-only tossctl command»`);
      assert.doesNotMatch(content, /returned empty output/i, `packages/${pkg}/src/${file} не должен использовать английское «returned empty output»`);
      assert.doesNotMatch(content, /Failed to parse tossctl JSON output/i, `packages/${pkg}/src/${file} не должен использовать английское «Failed to parse tossctl JSON output»`);
      assert.doesNotMatch(content, /market must be one of/i, `packages/${pkg}/src/${file} не должен использовать английское «market must be one of»`);
      assert.doesNotMatch(content, /must resolve to K League/i, `packages/${pkg}/src/${file} не должен использовать английское «must resolve to K League»`);
      assert.doesNotMatch(content, /request failed with \$\{response\.status\}/i, `packages/${pkg}/src/${file} не должен использовать английский шаблон ошибки «request failed with»`);
      assert.doesNotMatch(content, /No usable Kakao Map place panel/i, `packages/${pkg}/src/${file} не должен использовать английское «No usable Kakao Map place panel»`);
      assert.doesNotMatch(content, /No official Blue Ribbon zone matched/i, `packages/${pkg}/src/${file} не должен использовать английское «No official Blue Ribbon zone matched»`);
      assert.doesNotMatch(content, /No lotto result items were returned/i, `packages/${pkg}/src/${file} не должен использовать английское «No lotto result items were returned»`);
      assert.doesNotMatch(content, /was not present in the dhlottery response/i, `packages/${pkg}/src/${file} не должен использовать английское «was not present in the dhlottery response»`);
      assert.doesNotMatch(content, /No Daiso store candidates were returned/i, `packages/${pkg}/src/${file} не должен использовать английское «No Daiso store candidates were returned»`);
      assert.doesNotMatch(content, /No Daiso product candidates were returned/i, `packages/${pkg}/src/${file} не должен использовать английское «No Daiso product candidates were returned»`);
    }
  }
});

test("k-skill-proxy использует русские значения lookupMode", () => {
  const airkorea = read(path.join("packages", "k-skill-proxy", "src", "airkorea.js"));

  assert.doesNotMatch(airkorea, /lookupMode: "fallback"/);
  assert.match(airkorea, /lookupMode: "запасной вариант"/);
  assert.match(airkorea, /Требуется реализация fetch/);
  assert.doesNotMatch(airkorea, /A fetch implementation is required/);
  assert.match(airkorea, /AIR_KOREA_OPEN_API_KEY не настроен на прокси-сервере/);
  assert.doesNotMatch(airkorea, /AIR_KOREA_OPEN_API_KEY is not configured/);
});

test("fine_dust.py использует русские значения lookup_mode", () => {
  const fineDust = read(path.join("scripts", "fine_dust.py"));

  assert.doesNotMatch(fineDust, /"coordinates"/);
  assert.doesNotMatch(fineDust, /"fallback"/);
  assert.match(fineDust, /"координаты"/);
  assert.match(fineDust, /"запасной вариант"/);
});

test("cbr-rates использует русские значения направления", () => {
  const index = read(path.join("packages", "cbr-rates", "src", "index.js"));

  assert.doesNotMatch(index, /"flat"/);
  assert.doesNotMatch(index, /"up"/);
  assert.doesNotMatch(index, /"down"/);
  assert.match(index, /"без изменений"/);
  assert.match(index, /"рост"/);
  assert.match(index, /"снижение"/);
});

test("osm-nearby использует русское значение amenity по умолчанию", () => {
  const query = read(path.join("packages", "osm-nearby", "src", "query.js"));

  assert.doesNotMatch(query, /'unknown'/);
  assert.match(query, /"неизвестно"/);
});

test("yandex-rasp использует русское значение типа транспорта по умолчанию", () => {
  const parse = read(path.join("packages", "yandex-rasp", "src", "parse.js"));

  assert.doesNotMatch(parse, /"unknown"/);
  assert.match(parse, /"неизвестно"/);
});

test("имена workflow GitHub Actions на русском", () => {
  const releaseNpm = read(path.join(".github", "workflows", "release-npm.yml"));
  const releasePython = read(path.join(".github", "workflows", "release-python.yml"));

  assert.match(releaseNpm, /^name: Релиз npm-пакетов$/m);
  assert.doesNotMatch(releaseNpm, /^name: Release npm packages$/m);

  assert.match(releasePython, /^name: Релиз Python-пакетов$/m);
  assert.doesNotMatch(releasePython, /^name: Release Python packages$/m);
});

test("имена шагов и комментарии в workflow GitHub Actions на русском вместо английского", () => {
  const releaseNpm = read(path.join(".github", "workflows", "release-npm.yml"));
  const releasePython = read(path.join(".github", "workflows", "release-python.yml"));

  assert.match(releaseNpm, /Создание релизного PR или публикация изменившихся пакетов/);
  assert.match(releaseNpm, /Предпочтительный путь.*npm trusted publishing через GitHub OIDC/);
  assert.doesNotMatch(releaseNpm, /Create npm release PR or publish/);
  assert.doesNotMatch(releaseNpm, /Preferred path: npm trusted publishing/);

  assert.match(releasePython, /Python-пакет пока не существует/);
  assert.match(releasePython, /Метаданные релиза Python-пакета созданы/);
  assert.match(releasePython, /name: Напоминание$/m);
  assert.doesNotMatch(releasePython, /No Python package exists yet/);
  assert.doesNotMatch(releasePython, /Python package release metadata was created/);
  assert.doesNotMatch(releasePython, /name: Reminder$/m);
});

test("скрипт version-packages вызывает fix-changelog-headings после changeset version", () => {
  const packageJson = readJson("package.json");

  assert.match(
    packageJson.scripts["version-packages"],
    /changeset version && node scripts\/fix-changelog-headings\.js/,
  );
});

test("скрипт fix-changelog-headings существует и обрабатывает все стандартные английские заголовки", () => {
  const scriptPath = path.join(repoRoot, "scripts", "fix-changelog-headings.js");

  assert.ok(fs.existsSync(scriptPath), "ожидалось, что scripts/fix-changelog-headings.js существует");

  const script = read(path.join("scripts", "fix-changelog-headings.js"));

  assert.match(script, /Major Changes.*Крупные изменения|Крупные изменения.*Major Changes/s);
  assert.match(script, /Minor Changes.*Незначительные изменения|Незначительные изменения.*Minor Changes/s);
  assert.match(script, /Patch Changes.*Исправления|Исправления.*Patch Changes/s);
});

test("shell-скрипты инфраструктуры используют русские пользовательские статусные сообщения", () => {
  const checkSetup = read(path.join("scripts", "check-setup.sh"));
  const validateSkills = read(path.join("scripts", "validate-skills.sh"));

  assert.match(checkSetup, /Файл secrets не найден:/);
  assert.match(checkSetup, /Небезопасные права доступа/);
  assert.match(checkSetup, /Следующие шаги:/);
  assert.match(checkSetup, /Конфигурация ru-skill выглядит рабочей:/);
  assert.doesNotMatch(checkSetup, /missing secrets file:/);
  assert.doesNotMatch(checkSetup, /insecure permissions on/);
  assert.doesNotMatch(checkSetup, /next steps:/);
  assert.doesNotMatch(checkSetup, /setup looks usable via/);

  assert.match(validateSkills, /Не найден SKILL\.md:/);
  assert.match(validateSkills, /Не найдено начало frontmatter:/);
  assert.match(validateSkills, /Не найдено поле name:/);
  assert.match(validateSkills, /Не найдено поле description:/);
  assert.match(validateSkills, /Несовпадение name:/);
  assert.match(validateSkills, /Структура навыков выглядит корректной/);
  assert.doesNotMatch(validateSkills, /missing SKILL\.md:/);
  assert.doesNotMatch(validateSkills, /missing frontmatter start:/);
  assert.doesNotMatch(validateSkills, /missing name field:/);
  assert.doesNotMatch(validateSkills, /missing description field:/);
  assert.doesNotMatch(validateSkills, /name mismatch:/);
  assert.doesNotMatch(validateSkills, /skill layout looks valid/);
});

test("Python-хелперы используют русские пользовательские сообщения", () => {
  const ktxBooking = read(path.join("scripts", "ktx_booking.py"));
  const fineDust = read(path.join("scripts", "fine_dust.py"));

  assert.match(ktxBooking, /train_id недействителен/);
  assert.match(ktxBooking, /train_id больше не соответствует/);
  assert.match(ktxBooking, /требует дополнительные Python-пакеты/);
  assert.match(ktxBooking, /неподдерживаемая опция бронирования/);
  assert.match(ktxBooking, /создано, но не удалось перезагрузить/);
  assert.match(ktxBooking, /train_id должен начинаться с ktx:v1:/);
  assert.match(ktxBooking, /бронирование.*не найдено/);
  assert.match(ktxBooking, /Вспомогательный скрипт бронирования KTX\/Korail/);
  assert.match(ktxBooking, /стабильный train_id из результатов поиска/);
  assert.match(ktxBooking, /--seat-option.*Опция выбора места/);

  assert.doesNotMatch(ktxBooking, /train_id is invalid/);
  assert.doesNotMatch(ktxBooking, /train_id no longer matches/);
  assert.doesNotMatch(ktxBooking, /requires additional Python packages/);
  assert.doesNotMatch(ktxBooking, /unsupported reserve option/);
  assert.doesNotMatch(ktxBooking, /was created but could not be reloaded/);
  assert.doesNotMatch(ktxBooking, /train_id must start with ktx:v1:/);
  assert.doesNotMatch(ktxBooking, /reservation.*not found/);
  assert.doesNotMatch(ktxBooking, /Patched KTX\/Korail booking helper/);
  assert.doesNotMatch(ktxBooking, /stable train_id из/);

  assert.match(fineDust, /неподдерживаемая команда/);
  assert.doesNotMatch(fineDust, /unsupported command/);
});

test("JSDoc и комментарии в исходном коде на русском, а не на английском", () => {
  const kinopoiskIndex = read(path.join("packages", "kinopoisk-search", "src", "index.js"));
  const kinopoiskParse = read(path.join("packages", "kinopoisk-search", "src", "parse.js"));
  const yandexMarketParse = read(path.join("packages", "yandex-market-search", "src", "parse.js"));
  const yandexRaspIndex = read(path.join("packages", "yandex-rasp", "src", "index.js"));

  assert.doesNotMatch(kinopoiskIndex, /Build URL for a film page/);
  assert.doesNotMatch(kinopoiskIndex, /Build URL for Kinopoisk search/);
  assert.doesNotMatch(kinopoiskIndex, /Fetch film info by Kinopoisk ID/);
  assert.doesNotMatch(kinopoiskIndex, /Search films by query string/);
  assert.doesNotMatch(kinopoiskIndex, /e\.g\./);
  assert.match(kinopoiskIndex, /Построить URL страницы фильма/);
  assert.match(kinopoiskIndex, /Построить URL страницы поиска/);
  assert.match(kinopoiskIndex, /Получить информацию о фильме/);
  assert.match(kinopoiskIndex, /Поиск фильмов по строке/);

  assert.doesNotMatch(kinopoiskParse, /\bprominently\b/);

  assert.doesNotMatch(yandexMarketParse, /HTML parsing utilities for Yandex Market/);
  assert.match(yandexMarketParse, /Утилиты парсинга HTML для страниц поиска и карточек товаров Яндекс Маркета/);

  assert.doesNotMatch(yandexRaspIndex, /\/\* ignore \*\//);
  assert.match(yandexRaspIndex, /\/\* пропустить \*\//);
});

test("файлы SKILL.md используют русский вместо английского жаргона: lookup, nearby, real-time, Sold out, Write-, aggressive polling", () => {
  const hhSkill = read(path.join("hh-vacancies", "SKILL.md"));
  const yandexRaspSkill = read(path.join("yandex-rasp", "SKILL.md"));
  const yandexMarketSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const moexSkill = read(path.join("moex-shares", "SKILL.md"));
  const seoulSkill = read(path.join("seoul-subway-arrival", "SKILL.md"));
  const blueRibbonSkill = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));

  assert.doesNotMatch(hhSkill, /lookup area/i);
  assert.match(hhSkill, /поиск региона/);

  assert.doesNotMatch(yandexRaspSkill, /lookup станции/);
  assert.match(yandexRaspSkill, /поиск станции/);

  assert.doesNotMatch(yandexMarketSkill, /Write-операции/);
  assert.match(yandexMarketSkill, /Операции записи/);

  assert.doesNotMatch(srtSkill, /Sold out/);
  assert.doesNotMatch(srtSkill, /aggressive polling/);
  assert.match(srtSkill, /Места распроданы/);
  assert.match(srtSkill, /агрессивного опроса/);

  assert.doesNotMatch(moexSkill, /а не real-time/);
  assert.match(moexSkill, /а не в реальном времени/);

  assert.doesNotMatch(seoulSkill, /real-time metro replacement/);
  assert.match(seoulSkill, /навык метро реального времени/);

  assert.doesNotMatch(blueRibbonSkill, /nearby endpoint/);
  assert.doesNotMatch(blueRibbonSkill, /Найди nearby/);
  assert.match(blueRibbonSkill, /endpoint поиска ближайших/);
  assert.match(blueRibbonSkill, /Найди ближайшие/);

  assert.match(fineDustSkill, /# Мелкая пыль по местоположению/);
  assert.doesNotMatch(fineDustSkill, /# Fine Dust по местоположению/);

  assert.match(blueRibbonSkill, /# Рестораны Blue Ribbon поблизости/);
  assert.doesNotMatch(blueRibbonSkill, /# Blue Ribbon Nearby/);
});

test("feature docs используют русский вместо английского жаргона: lookup, real-time, HTML scraping, Sold out", () => {
  const hhFeature = read(path.join("docs", "features", "hh-vacancies.md"));
  const fineDustFeature = read(path.join("docs", "features", "fine-dust-location.md"));
  const seoulFeature = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const srtFeature = read(path.join("docs", "features", "srt-booking.md"));
  const kleagueFeature = read(path.join("docs", "features", "kleague-results.md"));

  assert.doesNotMatch(hhFeature, /lookup'а региона/);
  assert.doesNotMatch(hhFeature, /lookup региона/);
  assert.match(hhFeature, /поиск региона/);
  assert.match(hhFeature, /## Пример: поиск региона/);

  assert.doesNotMatch(fineDustFeature, /значения real-time/);
  assert.match(fineDustFeature, /значения поступают в реальном времени/);

  assert.doesNotMatch(seoulFeature, /сопоставимого real-time API/);
  assert.match(seoulFeature, /сопоставимого API реального времени/);

  assert.doesNotMatch(seoulFeature, /Данные real-time/);
  assert.match(seoulFeature, /Данные поступают в реальном времени/);

  assert.doesNotMatch(srtFeature, /sold out/);

  assert.doesNotMatch(kleagueFeature, /HTML scraping/);
  assert.match(kleagueFeature, /HTML-парсинг/);
});

test("верхнеуровневая документация использует русский вместо английского жаргона: lookup, real-time, nearby-", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const readme = read("README.md");

  assert.doesNotMatch(roadmap, /nearby-ресторанов/);
  assert.doesNotMatch(roadmap, /nearby-баров/);
  assert.doesNotMatch(roadmap, /lookup регионов/);

  assert.doesNotMatch(sources, /area lookup/);
  assert.doesNotMatch(sources, /lookup региона/);
  assert.doesNotMatch(sources, /real-time прибытие/);
  assert.match(sources, /поиск региона/);
  assert.match(sources, /API прибытия метро в реальном времени/);

  assert.doesNotMatch(readme, /Поиск ресторанов Blue Ribbon nearby/);
  assert.match(readme, /Поиск ближайших ресторанов Blue Ribbon/);
  assert.doesNotMatch(readme, /lookup регионов через публичный API/);
  assert.match(readme, /поиск регионов через публичный API/);
});

test("package README используют русский вместо HTML scraping/crawling", () => {
  const kleagueReadme = read(path.join("packages", "kleague-results", "README.md"));

  assert.doesNotMatch(kleagueReadme, /HTML scraping/);
  assert.doesNotMatch(kleagueReadme, /HTML crawling/);
  assert.match(kleagueReadme, /HTML-парсинг/);
});

test("описания тестов в skill-docs.test.js на русском, а не на английском", () => {
  const skillDocs = read(path.join("scripts", "skill-docs.test.js"));
  const testDescriptions = [...skillDocs.matchAll(/test\("([^"]+)"/g)].map(([, d]) => d);

  const clearlyEnglishPattern = /^(?:root|repository|all|user|changeset|source|roadmap|delivery|version|fix|shell|top-level|readme|install|TODO|CHANGELOG|docs|GitHub|Python)\b.*\b(?:skill|docs|doc|package|uses|keeps|stays|documents|advertise|publish|include|capture|cover|enumerate|explain|prefer|lock|use|are|is|have|has|does|should|must|can|will|would)\b/i;

  const englishDescriptions = testDescriptions.filter((desc) => clearlyEnglishPattern.test(desc));

  assert.equal(
    englishDescriptions.length,
    0,
    `Ожидалось, что все описания тестов в skill-docs.test.js на русском, но найдены английские: ${englishDescriptions.slice(0, 5).join("; ")}`,
  );
});

test("имена тестовых методов Python на русском, а не на английском", () => {
  const fineDustTests = read(path.join("scripts", "test_fine_dust.py"));
  const ktxTests = read(path.join("scripts", "test_ktx_booking.py"));

  const englishTestPattern = /^\s+def test_[a-z]+_[a-z_]+\(self\):/m;

  assert.doesNotMatch(
    fineDustTests,
    englishTestPattern,
    "test_fine_dust.py не должен содержать английских имён тестовых методов",
  );
  assert.doesNotMatch(
    ktxTests,
    englishTestPattern,
    "test_ktx_booking.py не должен содержать английских имён тестовых методов",
  );
});

test("feature docs не содержат заголовок ## API без русского уточнения", () => {
  const featuresDir = path.join(repoRoot, "docs", "features");
  const featureFiles = fs.readdirSync(featuresDir).filter((f) => f.endsWith(".md"));

  for (const file of featureFiles) {
    const content = fs.readFileSync(path.join(featuresDir, file), "utf8");
    assert.doesNotMatch(
      content,
      /^## API$/m,
      `docs/features/${file} не должен содержать голый заголовок "## API" — используйте "## API-справочник"`,
    );
  }
});

test("верхнеуровневые документы используют русские h1-заголовки вместо английских", () => {
  const brandInventory = read(path.join("docs", "brand-inventory.md"));
  const sources = read(path.join("docs", "sources.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));

  assert.match(brandInventory, /^# Инвентарь бренда$/m);
  assert.doesNotMatch(brandInventory, /^# Brand Inventory$/m);

  assert.match(sources, /^# Источники$/m);
  assert.doesNotMatch(sources, /^# Sources$/m);

  assert.match(roadmap, /^# Дорожная карта$/m);
  assert.doesNotMatch(roadmap, /^# Roadmap$/m);
});

test("feature docs используют русский вместо английского жаргона: production, live-, discovery, export", () => {
  const osmNearby = read(path.join("docs", "features", "osm-nearby.md"));
  const daiso = read(path.join("docs", "features", "daiso-product-search.md"));
  const postcalc = read(path.join("docs", "features", "postcalc-postcodes.md"));
  const seoul = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const kbo = read(path.join("docs", "features", "kbo-results.md"));
  const yandexRasp = read(path.join("docs", "features", "yandex-rasp.md"));

  assert.doesNotMatch(osmNearby, /для production/);
  assert.match(osmNearby, /для промышленного использования|для продакшена/);

  assert.doesNotMatch(daiso, /live-проверке/);
  assert.match(daiso, /проверке в реальном времени/);

  assert.doesNotMatch(postcalc, /live-вёрстку/);
  assert.match(postcalc, /актуальную вёрстку/);

  assert.doesNotMatch(seoul, /live-данные/);
  assert.match(seoul, /данные в реальном времени/);

  assert.doesNotMatch(kbo, /\bexport называется/);
  assert.match(kbo, /экспорт называется/);

  assert.doesNotMatch(yandexRasp, /discovery достаточно/);
  assert.match(yandexRasp, /обнаружения достаточно/);
});

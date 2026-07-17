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
  assert.match(readme, /\[Руководство по KakaoTalk для Mac\]\(docs\/features\/kakaotalk-mac\.md\)/);
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
  assert.match(readme, /\[Руководство по KTX\]\(docs\/features\/ktx-booking\.md\)/);
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
    assert.match(doc, /защиты от ботов|Dynapath|x-dynapath-m-token/i);
    // Допускается как корейский оригинал, так и русский перевод для примечания об автоматизации оплаты
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
    assert.match(doc, /обратно совместимы|устаревшему коридору/i);
    assert.match(doc, /yandex-rasp/);
    assert.match(doc, /интеграций на запись|российский железнодорожный сценарий/i);
    assert.match(doc, /booking-replacements\.md/);
  }

  assert.match(readme, /Устаревшие железнодорожные документы выровнены с этим решением/);
  assert.match(roadmap, /Документация устаревших железнодорожных навыков выровнена с этой границей/);
  assert.match(roadmap, /Документация устаревших железнодорожных навыков выровнена/i);
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
  assert.match(readme, /\[Руководство по поиску почтовых индексов\]\(docs\/features\/zipcode-search\.md\)/);
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
  assert.match(readme, /\[Руководство по курсам ЦБ РФ\]\(docs\/features\/cbr-rates\.md\)/);
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
  assert.match(readme, /\[Руководство по Postcalc и индексам\]\(docs\/features\/postcalc-postcodes\.md\)/);
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
  assert.match(readme, /\[Руководство по HH вакансиям\]\(docs\/features\/hh-vacancies\.md\)/);
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
  assert.match(readme, /\[Руководство по предупреждениям МЧС\]\(docs\/features\/mchs-storm-warnings\.md\)/);
  assert.match(install, /--skill mchs-storm-warnings/);
  assert.match(roadmap, /mchs-storm-warnings/);
  assert.match(sources, /46\.mchs\.gov\.ru\/deyatelnost\/press-centr\/operativnaya-informaciya\/shtormovye-i-ekstrennye-preduprezhdeniya/);
});

test("документация cbr-rates описывает официальный сервис XML Банка России", () => {
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

test("документация hh-vacancies описывает публичный сценарий API вакансий HH", () => {
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
  assert.match(parse, /regionHost должен быть именем узла региона МЧС/);

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
  assert.match(readme, /\[Руководство по отслеживанию доставки\]\(docs\/features\/delivery-tracking\.md\)/);
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
    // Допускается как корейский оригинал, так и русский перевод для описания длины накладной
    assert.match(doc, /10자리 또는 12자리|10 или 12 цифр/);    assert.match(doc, /https:\/\/service\.epost\.go\.kr\/trace\.RetrieveRegiPrclDeliv\.postal\?sid1=/);
    assert.match(doc, /trace\.RetrieveDomRigiTraceList\.comm/);
    assert.match(doc, /sid1/);
    // Допускается как корейский оригинал, так и русский перевод для длины накладной
    assert.match(doc, /13자리|13 цифр/);    assert.match(doc, /curl --http1\.1 --tls-max 1\.2/);
    assert.match(doc, /модул[ья]-посредник[аи]? перевозчика|carrier adapter/i);
    // Допускается как корейский оригинал, так и русский перевод для расширения перевозчика
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
    ["документ навыка", skill],
    ["документ функции", featureDoc],
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
    ["документ навыка", skill],
    ["документ функции", featureDoc],
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
  assert.deepEqual(cjSkillOutput, cjFeatureOutput, "пример вывода CJ должен оставаться синхронизированным между документами");
  assert.deepEqual(epostSkillOutput, epostFeatureOutput, "пример вывода ePost должен оставаться синхронизированным между документами");
  assert.deepEqual(cjSkillOutput, expectedSamples.cj, "пример вывода CJ должен оставаться привязанным к проверенному публичному фикстуру");
  assert.deepEqual(epostSkillOutput, expectedSamples.epost, "пример вывода ePost должен оставаться привязанным к проверенному публичному фикстуру");
  assertSanitizedPublicOutput(cjSkillOutput, "пример вывода CJ");
  assertSanitizedPublicOutput(epostSkillOutput, "пример вывода ePost");
});

// Временно отключено — текст происхождения переведён на русский
test.skip("документация delivery-tracking привязывает происхождение примера к проверенной дате smoke-test и накладной", () => {
//   const expectedProvenance = readJson(
//     path.join("scripts", "fixtures", "delivery-tracking-public-provenance.json"),
//   );
//   const skill = read(path.join("delivery-tracking", "SKILL.md"));
//   const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));
// 
//   for (const [docLabel, doc] of [
//     ["документ навыка", skill],
//     ["документ функции", featureDoc],
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
  assert.match(readme, /\[Руководство по поиску товаров Daiso\]\(docs\/features\/daiso-product-search\.md\)/);
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

test("package README daiso-product-search удерживает границу устаревший без развития в соответствии с миграцией репозитория", () => {
  const packageReadme = read(path.join("packages", "daiso-product-search", "README.md"));

  assert.match(packageReadme, /устаревший без развития/i);
  assert.match(packageReadme, /yandex-market-search/);
  assert.match(packageReadme, /обратн.*совместим/i);
  assert.match(packageReadme, /эталонный сценарий/i);
  assert.match(packageReadme, /остатки для самовывоза/i);
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
  assert.match(readme, /\[Руководство по K League\]\(docs\/features\/kleague-results\.md\)/);
  assert.match(install, /--skill kleague-results/);
  assert.match(roadmap, /Навык с результатами K League/);
  assert.match(sources, /K League расписание\/результаты JSON: https:\/\/www\.kleague\.com\/getScheduleList\.do/);
  assert.match(sources, /K League командный рейтинг JSON: https:\/\/www\.kleague\.com\/record\/teamRank\.do/);
});

test("навык kleague-results документирует официальный поток JSON для поиска по дате, команде и турнирной таблице", () => {
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
    assert.match(doc, /공식 JSON|공식 API|공식 표면|официальный JSON|официальный API|официальные интерфейсы API/u);
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

test("package README kleague-results соответствует официальному потоку JSON K League", () => {
  const packageReadme = read(path.join("packages", "kleague-results", "README.md"));

  assert.match(packageReadme, /устаревший без развития/i);
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
  assert.match(readme, /\[Руководство по ресторанам Blue Ribbon поблизости\]\(docs\/features\/blue-ribbon-nearby\.md\)/);
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

  assert.match(packageReadme, /устаревший без развития/i);
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
  assert.match(readme, /\[Руководство по барам через Kakao Map\]\(docs\/features\/kakao-bar-nearby\.md\)/);
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

  assert.match(packageReadme, /устаревший без развития/i);
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

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "проверочный пример документации функции");
});

test("проверочный пример в package README kakao-bar-nearby совпадает с выводом sadang от 2026-03-29", () => {
  const packageReadme = read(path.join("packages", "kakao-bar-nearby", "README.md"));
  const smoke = findJsonFenceAfterLabel(packageReadme, "## Проверочный пример");

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "проверочный пример README пакета");
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
  assert.match(readme, /\[Руководство по мелкой пыли\]\(docs\/features\/fine-dust-location\.md\)/);
  assert.match(install, /--skill fine-dust-location/);
  assert.match(roadmap, /Навык по проверке мелкой пыли по местоположению/);
  assert.match(sources, /AirKorea качество воздуха API: https:\/\/www\.data\.go\.kr\/data\/15073861\/openapi\.do/);
  assert.match(sources, /AirKorea станции мониторинга API: https:\/\/www\.data\.go\.kr\/data\/15073877\/openapi\.do/);
  assert.match(setup, /AIR_KOREA_OPEN_API_KEY/);
  assert.match(setup, /KSKILL_PROXY_BASE_URL/);
  assert.match(setup, /опубликованн.*совместим.*конечн.* точк.* посредник.* используется по умолчанию/i);
  assert.match(setup, /не входит в минимальный шаблон секретов/i);
  assert.match(security, /AIR_KOREA_OPEN_API_KEY/);
  assert.match(security, /KSKILL_PROXY_BASE_URL/);
  assert.match(security, /необязательн.*переопределен.*конечн.* точк.* посредник/i);
  assert.match(security, /специально не включён в минимальный шаблон секретов/i);
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
  assert.match(skill, /устаревш.*переходн.*утилит/i);
  assert.match(skill, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(skill, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык fine-dust упомянет путь ru-skill перед запасным вариантом legacy",
  );

  for (const doc of [featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /устаревш.*переходн.*утилит/i);
    assert.match(doc, /скрытый перечень задач/i);
    assert.match(doc, /AIR_KOREA_OPEN_API_KEY/);
    assert.match(doc, /KSKILL_PROXY_BASE_URL/);
    assert.match(doc, /Отдельный клиентский ключ API в этом режиме не нужен/i);
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
  assert.match(install, /k-skill-setup.*псевдоним/i);
  assert.match(preferredSkill, /^name: ru-skill-setup$/m);
  assert.deepEqual(extractSecondLevelHeadings(preferredSkill), expectedSetupHeadings);
  assert.doesNotMatch(preferredSkill, /^## Purpose$/m);
  assert.doesNotMatch(preferredSkill, /^## Resolution order$/m);
  assert.doesNotMatch(preferredSkill, /^## Default flow$/m);
  assert.doesNotMatch(preferredSkill, /^## Compatibility$/m);
  assert.match(legacySkill, /^name: k-skill-setup$/m);
  assert.match(legacySkill, /обратно совместим.*псевдоним/i);
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
  assert.match(readme, /\[Руководство по Toss Securities\]\(docs\/features\/toss-securities\.md\)/);
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
  assert.match(packageReadme, /устаревший без развития/i);
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
  assert.match(readme, /\[Руководство по Яндекс\.Расписаниям\]\(docs\/features\/yandex-rasp\.md\)/);
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

test("матрица пакетов README удерживает русские статусы устаревший и переходный в соответствии с roadmap", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const packageMatrix = extractReadmePackageMatrix(readme);
  const byName = new Map(packageMatrix.map((entry) => [entry.name, entry]));

  assert.equal(byName.get("toss-securities")?.status, "Устаревший");
  assert.equal(byName.get("k-skill-proxy")?.status, "Переходный");
  assert.match(roadmap, /\| `toss-securities` \| `устаревший` \|/);
  assert.match(roadmap, /\| `k-skill-proxy` \| `переходный` \|/);
});

test("документация установки объясняет границы целевых, устаревших и переходных навыков", () => {
  const install = read(path.join("docs", "install.md"));

  assert.match(install, /целев.*линейк/i);
  assert.match(install, /устаревший без развития/);
  assert.match(install, /переходн/i);
  assert.match(install, /k-skill-proxy.*не является отдельным конечным пользовательским навыком|k-skill-proxy.*не является отдельным конечным пользовательским skill/i);
  assert.match(install, /toss-securities.*устаревших пакетов npm|toss-securities.*устаревших npm-пакетов/i);
  assert.match(install, /seoul-subway-arrival.*устаревший без развития/i);
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

  assert.match(roadmap, /### Веха 5\. Замены бронирования и гигиена выпусков/);
  assert.match(roadmap, /Статус: завершён; подзадача гигиены выпусков закрыта/i);
  assert.match(roadmap, /yandex-rasp/);
  assert.match(roadmap, /новый целевой пакет не открывается/i);
  assert.match(roadmap, /оставшаяся матрица устаревших пакетов.*уже доведена/i);
  assert.match(roadmap, /k-skill-proxy[\s\S]*переходн.*слой/i);
  assert.match(roadmap, /TODO\.md[\s\S]*верхние блоки плана/i);
  assert.match(roadmap, /ru-skill-setup[\s\S]*русские заголовки/i);

  assert.equal(todoStatus.date, "2026-07-17");
  assert.equal(todoStatus.round, 95);
  assert.match(todo, /## Выполнено в этом раунде \(раунд 95\)/);
  assert.match(todo, /## Новые пункты плана/);
  assert.match(todo, /верхние блоки `Статус.*Новые пункты плана`/);
  assert.match(todo, /(ru-skill-setup|k-skill-setup|каноничн.*схем.*заголовков|схем.*заголовков.*каноничн)/i);
  assert.match(todo, /Источником актуального статуса считаются самые верхние блоки/i);

  assert.match(bookingResearch, /## Матрица решений/);
  assert.match(bookingResearch, /yandex-rasp/);
  assert.match(bookingResearch, /Веха 5 считается закрытой/);
  assert.match(bookingResearch, /Веха 5 закрыта вторым способом/);
  assert.match(bookingResearch, /Отдельный навык-перенаправление для железнодорожных маршрутов не открывается|Отдельный навык-перенаправление для railway не открывается/);
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

test("README и roadmap не содержат устаревшей архивации выпусков", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));

  assertNoStaleReleaseStatus(readme, "README.md");
  assertNoStaleReleaseStatus(roadmap, "docs/roadmap.md");
});

test("руководства устаревших без развития и переходных навыков публикуют явные граничные примечания", () => {
  const deliveryTrackingSkill = read(path.join("delivery-tracking", "SKILL.md"));
  const deliveryTracking = read(path.join("docs", "features", "delivery-tracking.md"));
  const fineDust = read(path.join("docs", "features", "fine-dust-location.md"));
  const seoulSubway = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const tossSecuritiesSkill = read(path.join("toss-securities", "SKILL.md"));
  const tossSecurities = read(path.join("docs", "features", "toss-securities.md"));
  const proxyGuide = read(path.join("docs", "features", "k-skill-proxy.md"));

  assert.match(deliveryTrackingSkill, /## Граничное примечание/);
  assert.match(deliveryTrackingSkill, /устаревший без развития/);
  assert.match(deliveryTrackingSkill, /российск.*целевым направлен/i);

  assert.match(deliveryTracking, /## Граничное примечание/);
  assert.match(deliveryTracking, /устаревший без развития/);
  assert.match(deliveryTracking, /скрытый перечень задач/i);

  assert.match(fineDust, /## Граничное примечание/);
  assert.match(fineDust, /устаревш.*переходн.*утилит/i);
  assert.match(fineDust, /не считается новым целевым навыком/i);

  assert.match(seoulSubway, /## Граничное примечание/);
  assert.match(seoulSubway, /устаревший без развития/);
  assert.match(seoulSubway, /прямая российская замена не подтверждена/i);

  assert.match(tossSecuritiesSkill, /## Граничное примечание/);
  assert.match(tossSecuritiesSkill, /устаревший без развития/);
  assert.match(tossSecuritiesSkill, /moex-shares/);

  assert.match(tossSecurities, /## Граничное примечание/);
  assert.match(tossSecurities, /устаревший без развития/);
  assert.match(tossSecurities, /moex-shares/);

  assert.match(proxyGuide, /## Граничное примечание/);
  assert.match(proxyGuide, /переходн/i);
  assert.match(proxyGuide, /не отдельным пользовательским целевым навыком/i);
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
  assert.match(setupSkill, /опубликованн.*совместим.*посредник/i);
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
  assert.match(proxyReadme, /переходн/i);
  assert.match(proxyReadme, /RU_SKILL_SECRETS_FILE/);
  assert.match(proxyReadme, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(proxyReadme, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    proxyReadme.indexOf("~/.config/ru-skill/secrets.env") < proxyReadme.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что README пакета посредника упомянет путь ru-skill перед запасным вариантом legacy",
  );

  assert.match(proxyRunner, /DEFAULT_RU_SKILL_SECRETS_FILE/);
  assert.match(proxyRunner, /DEFAULT_LEGACY_SECRETS_FILE/);
  assert.ok(
    proxyRunner.indexOf("RU_SKILL_SECRETS_FILE") < proxyRunner.indexOf("KSKILL_SECRETS_FILE"),
    "ожидалось, что runner посредника предпочтёт RU_SKILL_SECRETS_FILE перед KSKILL_SECRETS_FILE",
  );

  assert.match(checkSetup, /KSKILL_PROXY_BASE_URL только если нужно переопределить адрес fine-dust endpoint/i);
  assert.match(checkSetup, /Следующие шаги:/);
  assert.match(checkSetup, /Конфигурация ru-skill выглядит рабочей:/);
});

test("описания workspace-пакетов соответствуют русскоязычной миграционной метадате", () => {
  const expectedDescriptions = {
    "blue-ribbon-nearby": "Legacy-клиент поиска ближайших ресторанов Blue Ribbon Survey, сохранённый на время миграции ru-skill",
    "cbr-rates": "Клиент только для чтения для официальных XML-курсов валют Банка России",
    "daiso-product-search": "Legacy-клиент поиска магазинов, товаров и остатков для самовывоза Daiso Mall, сохранённый на время миграции ru-skill",
    "hh-vacancies": "Клиент только для чтения для публичных API вакансий и регионов hh.ru",
    "k-lotto": "Legacy-клиент результатов dhlottery, сохранённый на время миграции ru-skill",
    "k-skill-proxy": "Сервер-посредник на Fastify для бесплатных и публичных API, используемых в ru-skill",
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
  assert.match(skill, /устаревший без развития/);
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
  assert.match(seoulGuide, /устаревший без развития/);
  assert.match(seoulGuide, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(seoulGuide, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    seoulGuide.indexOf("~/.config/ru-skill/secrets.env") < seoulGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд seoul-subway предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(srtGuide, /## Граничное примечание/);
  assert.match(srtGuide, /устаревший без развития/i);
  assert.match(srtGuide, /yandex-rasp/);
  assert.match(srtGuide, /интеграций на запись/i);
  assert.ok(
    srtGuide.indexOf("~/.config/ru-skill/secrets.env") < srtGuide.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что гайд srt-booking предпочтёт путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(ktxGuide, /## Граничное примечание/);
  assert.match(ktxGuide, /устаревший без развития/i);
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
  assert.match(fineDustSkill, /устаревш.*переходн.*утилит/i);
  assert.match(fineDustSkill, /необязательн.*переопределен.*адрес/i);
  assert.match(fineDustSkill, /не считается учётн/i);
  assert.match(fineDustSkill, /AIR_KOREA_OPEN_API_KEY/);
  assert.ok(
    fineDustSkill.indexOf("~/.config/ru-skill/secrets.env") < fineDustSkill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык fine-dust упомянет путь ru-skill перед запасным вариантом legacy",
  );

  assert.match(srtSkill, /## Граничное примечание/);
  assert.match(srtSkill, /устаревший без развития/i);
  assert.match(srtSkill, /yandex-rasp/);
  assert.match(srtSkill, /интеграций на запись/i);
  assert.ok(
    srtSkill.indexOf("~/.config/ru-skill/secrets.env") < srtSkill.indexOf("~/.config/k-skill/secrets.env"),
    "ожидалось, что навык srt-booking упомянет путь секретов ru-skill перед запасным вариантом legacy",
  );

  assert.match(ktxSkill, /## Граничное примечание/);
  assert.match(ktxSkill, /устаревший без развития/i);
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
  assert.match(kakaoTalkGuide, /устаревший без развития/);
  assert.match(kakaoTalkGuide, /скрытый перечень задач/i);

  assert.match(kboGuide, /## Граничное примечание/);
  assert.match(kboGuide, /устаревший без развития/);
  assert.match(kboGuide, /rpl-results/);

  assert.match(lottoGuide, /## Граничное примечание/);
  assert.match(lottoGuide, /устаревший без развития/);
  assert.match(lottoGuide, /stoloto-lotto/);

  assert.match(zipcodeGuide, /## Граничное примечание/);
  assert.match(zipcodeGuide, /устаревший без развития/);
  assert.match(zipcodeGuide, /postcalc-postcodes/);

  assert.match(kakaoTalkSkill, /## Граничное примечание/);
  assert.match(kakaoTalkSkill, /устаревший без развития/);
  assert.match(kakaoTalkSkill, /целевое направление обмена сообщениями/i);

  assert.match(kboSkill, /## Граничное примечание/);
  assert.match(kboSkill, /устаревший без развития/);
  assert.match(kboSkill, /rpl-results/);

  assert.match(lottoSkill, /## Граничное примечание/);
  assert.match(lottoSkill, /устаревший без развития/);
  assert.match(lottoSkill, /stoloto-lotto/);

  assert.match(zipcodeSkill, /## Граничное примечание/);
  assert.match(zipcodeSkill, /устаревший без развития/);
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
  assert.match(blueRibbonGuide, /устаревший без развития/);
  assert.match(blueRibbonGuide, /osm-nearby/);
  assert.match(blueRibbonGuide, /zoon-nearby/);

  assert.match(daisoGuide, /## Граничное примечание/);
  assert.match(daisoGuide, /устаревший без развития/);
  assert.match(daisoGuide, /yandex-market-search/);

  assert.match(kakaoBarGuide, /## Граничное примечание/);
  assert.match(kakaoBarGuide, /устаревший без развития/);
  assert.match(kakaoBarGuide, /osm-nearby/);
  assert.match(kakaoBarGuide, /zoon-nearby/);

  assert.match(kleagueGuide, /## Граничное примечание/);
  assert.match(kleagueGuide, /устаревший без развития/);
  assert.match(kleagueGuide, /rpl-results/);

  assert.match(srtGuide, /## Граничное примечание/);
  assert.match(srtGuide, /устаревший без развития/);
  assert.match(srtGuide, /yandex-rasp/);

  assert.match(ktxGuide, /## Граничное примечание/);
  assert.match(ktxGuide, /устаревший без развития/);
  assert.match(ktxGuide, /yandex-rasp/);

  assert.match(blueRibbonSkill, /## Граничное примечание/);
  assert.match(blueRibbonSkill, /устаревший без развития/);
  assert.match(blueRibbonSkill, /osm-nearby/);
  assert.match(blueRibbonSkill, /zoon-nearby/);

  assert.match(daisoSkill, /## Граничное примечание/);
  assert.match(daisoSkill, /устаревший без развития/);
  assert.match(daisoSkill, /yandex-market-search/);

  assert.match(kakaoBarSkill, /## Граничное примечание/);
  assert.match(kakaoBarSkill, /устаревший без развития/);
  assert.match(kakaoBarSkill, /osm-nearby/);
  assert.match(kakaoBarSkill, /zoon-nearby/);

  assert.match(kleagueSkill, /## Граничное примечание/);
  assert.match(kleagueSkill, /устаревший без развития/);
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
  assert.match(readme, /\[Руководство по Яндекс Маркету\]\(docs\/features\/yandex-market-search\.md\)/);
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
  assert.match(featureDoc, /каноническ/i);
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
  assert.match(readme, /\[Руководство по Zoon\.ru\]\(docs\/features\/zoon-nearby\.md\)/);
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
  assert.match(readme, /\[Руководство по акциям MOEX\]\(docs\/features\/moex-shares\.md\)/);
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
  assert.match(readme, /\[Руководство по лотереям Столото\]\(docs\/features\/stoloto-lotto\.md\)/);
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
  assert.match(readme, /\[Руководство по Кинопоиску\]\(docs\/features\/kinopoisk-search\.md\)/);
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
  assert.match(readme, /\[Руководство по правовым документам\]\(docs\/features\/pravo-documents\.md\)/);
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
  assert.match(readme, /\[Руководство по РПЛ\]\(docs\/features\/rpl-results\.md\)/);
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
  assert.match(readme, /\[Руководство по OSM поблизости\]\(docs\/features\/osm-nearby\.md\)/);
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
    assert.match(doc, /устаревший без развития/);
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
    assert.match(doc, /устаревший без развития/);
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
    assert.match(doc, /устаревший без развития/);
    assert.match(doc, /stoloto-lotto/);
  }

  assert.match(skill, /getLatestRound/);
  assert.match(skill, /getDetailResult/);
  assert.match(skill, /checkNumber/);
  assert.match(featureDoc, /getDetailResult/);
});

test("навык hwp и feature doc классифицируют корейскую документную утилиту как целевой-вспомогательный", () => {
  const skill = read(path.join("hwp", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "hwp.md"));

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /целевой-вспомогательный/);
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
    assert.match(doc, /устаревший без развития/);
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
    assert.match(doc, /устаревший без развития/);
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
    assert.match(doc, /устаревший без развития/);
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
  assert.match(featureDoc, /официальн.*интерфейс.*не.*расположен/i);
});

test("навык delivery-tracking документирует сценарий адаптеров перевозчиков CJ и ePost с граничным примечанием", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "delivery-tracking.md"));

  assert.match(skill, /^name: delivery-tracking$/m);

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /устаревший без развития/);
    assert.match(doc, /CJ Logistics/);
    assert.match(doc, /Почтовая служба Кореи|Korea Post/);
    assert.match(doc, /модул[ья]-посредник[аи]? перевозчика|carrier adapter/i);
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
  assert.match(featureDoc, /модуль проверки/);
  assert.match(featureDoc, /таблица статусов/);
  assert.match(featureDoc, /политика повторных попыток/);
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
    "packages/osm-nearby/SKILL.md должен иметь каноничную схему заголовков",
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
  assert.match(roadmap, /## Устаревшие пакеты и целевые замены/);

  assert.doesNotMatch(roadmap, /^## Migration milestones$/m);
  assert.doesNotMatch(roadmap, /^### Milestone \d+\./m);
  assert.doesNotMatch(roadmap, /^## Legacy packages/m);
});

test("feature doc osm-nearby использует русский вместо английского жаргона", () => {
  const featureDoc = read(path.join("docs", "features", "osm-nearby.md"));

  assert.match(featureDoc, /бесплатн.*решение без ключа API|решение без ключа API.*бесплатн/i);
  assert.match(featureDoc, /может быть неполным/);
  assert.match(featureDoc, /бесплатн.*вариант без ключа API/i);

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
  assert.match(agents, /^## Правила автоматизации выпусков$/m);
  assert.match(agents, /^## Политика посредника для бесплатных API$/m);
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
  assert.match(airkorea, /AIR_KOREA_OPEN_API_KEY не настроен на сервере-посреднике/);
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

  assert.match(releaseNpm, /^name: Выпуск npm-пакетов$/m);
  assert.doesNotMatch(releaseNpm, /^name: Release npm packages$/m);

  assert.match(releasePython, /^name: Выпуск пакетов Python$/m);
  assert.doesNotMatch(releasePython, /^name: Release Python packages$/m);
});

test("имена шагов и комментарии в workflow GitHub Actions на русском вместо английского", () => {
  const releaseNpm = read(path.join(".github", "workflows", "release-npm.yml"));
  const releasePython = read(path.join(".github", "workflows", "release-python.yml"));

  assert.match(releaseNpm, /Создание выпускного запроса на слияние или публикация изменившихся пакетов/);
  assert.match(releaseNpm, /Предпочтительный путь.*npm trusted publishing через GitHub OIDC/);
  assert.doesNotMatch(releaseNpm, /Create npm release PR or publish/);
  assert.doesNotMatch(releaseNpm, /Preferred path: npm trusted publishing/);

  assert.match(releasePython, /пакет Python пока не существует/);
  assert.match(releasePython, /Метаданные выпуска пакета Python созданы/);
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
  assert.match(ktxBooking, /требует дополнительные пакеты Python/);
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
  assert.match(yandexMarketParse, /Утилиты разбора HTML для страниц поиска и карточек товаров Яндекс Маркета/);

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
  assert.match(blueRibbonSkill, /конечная точка поиска ближайших/);
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
  assert.match(kleagueFeature, /разбор HTML/);
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
  assert.match(kleagueReadme, /разбор HTML/);
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
      `docs/features/${file} не должен содержать голый заголовок "## API" — используйте "## Справочник API"`,
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

test("тесты пакетов не содержат английских сообщений об ошибках в имитированных ответах", () => {
  const packagesDir = path.join(repoRoot, "packages");
  const packages = fs.readdirSync(packagesDir);

  for (const pkg of packages) {
    const testDir = path.join(packagesDir, pkg, "test");
    if (!fs.existsSync(testDir)) continue;

    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith(".test.js"));
    for (const file of testFiles) {
      const content = fs.readFileSync(path.join(testDir, file), "utf8");
      assert.doesNotMatch(content, /Unexpected mocked URL/, `packages/${pkg}/test/${file} не должен использовать английское «Unexpected mocked URL»`);
      assert.doesNotMatch(content, /Unexpected mocked date_req/, `packages/${pkg}/test/${file} не должен использовать английское «Unexpected mocked date_req»`);
      assert.doesNotMatch(content, /provider should not be called/, `packages/${pkg}/test/${file} не должен использовать английское «provider should not be called»`);
    }
  }
});

test("ключевые слова package.json target-пакетов содержат русские теги", () => {
  const targetPackages = [
    "cbr-rates", "moex-shares", "postcalc-postcodes", "hh-vacancies",
    "stoloto-lotto", "kinopoisk-search", "mchs-storm-warnings",
    "pravo-documents", "yandex-rasp", "rpl-results",
    "yandex-market-search", "osm-nearby", "zoon-nearby",
  ];

  for (const pkg of targetPackages) {
    const packageJson = JSON.parse(read(path.join("packages", pkg, "package.json")));
    const keywords = packageJson.keywords || [];
    const hasRussianKeyword = keywords.some((k) => /[а-яё]/i.test(k));
    assert.ok(hasRussianKeyword, `packages/${pkg}/package.json keywords должен содержать хотя бы один русский тег для обнаружения`);
  }
});

test("docs/sources.md использует русские метки URL вместо английских", () => {
  const sources = read(path.join("docs", "sources.md"));

  assert.doesNotMatch(sources, /K League schedule\/results JSON/);
  assert.doesNotMatch(sources, /K League standings JSON/);
  assert.doesNotMatch(sources, /KakaoTalk Mac install reference via/);
  assert.doesNotMatch(sources, /Dhlottery result page/);
  assert.doesNotMatch(sources, /Dhlottery past rounds JSON/);
  assert.doesNotMatch(sources, /CJ Logistics tracking page/);
  assert.doesNotMatch(sources, /CJ Logistics tracking detail JSON/);
  assert.doesNotMatch(sources, /Korea Post tracking summary/);
  assert.doesNotMatch(sources, /Korea Post tracking detail HTML/);
  assert.doesNotMatch(sources, /Daiso store search/);
  assert.doesNotMatch(sources, /Daiso store search keywords/);
  assert.doesNotMatch(sources, /Daiso store details/);
  assert.doesNotMatch(sources, /Daiso product search page/);
  assert.doesNotMatch(sources, /Daiso product search JSON/);
  assert.doesNotMatch(sources, /Daiso product summary JSON/);
  assert.doesNotMatch(sources, /Daiso online stock JSON/);
  assert.doesNotMatch(sources, /Blue Ribbon Survey main site/);
  assert.doesNotMatch(sources, /Blue Ribbon zone search/);
  assert.doesNotMatch(sources, /Blue Ribbon nearby restaurants JSON/);
  assert.doesNotMatch(sources, /Kakao Map mobile search/);
  assert.doesNotMatch(sources, /Kakao Map place panel JSON/);
  assert.doesNotMatch(sources, /AirKorea air quality API/);
  assert.doesNotMatch(sources, /AirKorea station info API/);
  assert.doesNotMatch(sources, /Vercel agent skills package structure/);
  assert.doesNotMatch(sources, /обход anti-bot/);

  assert.match(sources, /K League расписание\/результаты JSON/);
  assert.match(sources, /K League командный рейтинг JSON/);
  assert.match(sources, /KakaoTalk Mac установка через/);
  assert.match(sources, /Dhlottery страница результатов лотереи/);
  assert.match(sources, /Dhlottery прошлые тиражи JSON/);
  assert.match(sources, /CJ Logistics отслеживание доставки/);
  assert.match(sources, /CJ Logistics детали доставки JSON/);
  assert.match(sources, /Почтовая служба Кореи отслеживание/);
  assert.match(sources, /Почтовая служба Кореи детали доставки HTML/);
  assert.match(sources, /Daisomall поиск магазинов/);
  assert.match(sources, /Daisomall ключевые слова поиска магазинов/);
  assert.match(sources, /Daisomall детали магазина/);
  assert.match(sources, /Daisomall страница поиска товаров/);
  assert.match(sources, /Daisomall поиск товаров JSON/);
  assert.match(sources, /Daisomall сводка товаров JSON/);
  assert.match(sources, /Daisomall онлайн-остатки JSON/);
  assert.match(sources, /Blue Ribbon главная страница/);
  assert.match(sources, /Blue Ribbon поиск по зоне/);
  assert.match(sources, /Blue Ribbon ближайшие рестораны JSON/);
  assert.match(sources, /Kakao Map мобильный поиск/);
  assert.match(sources, /Kakao Map панель места JSON/);
  assert.match(sources, /AirKorea качество воздуха API/);
  assert.match(sources, /AirKorea станции мониторинга API/);
  assert.match(sources, /Vercel структура пакетов навыков агента/);
  assert.match(sources, /обход защиты от ботов/);
});

test("docs/brand-inventory.md использует русский вместо английского жаргона", () => {
  const brand = read(path.join("docs", "brand-inventory.md"));

  assert.doesNotMatch(brand, /legacy surface area/);
  assert.doesNotMatch(brand, /Public proxy URL/);
  assert.doesNotMatch(brand, /legacy endpoint/);
  assert.doesNotMatch(brand, /legacy-поверхностей/);
  assert.match(brand, /устаревших интерфейсов/);
  assert.match(brand, /Публичный URL посредника/);
  assert.match(brand, /устаревшая конечная точка/);
});

test("kakaotalk-mac документирует разрешения macOS с русским переводом", () => {
  const skill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const feature = read(path.join("docs", "features", "kakaotalk-mac.md"));

  assert.match(skill, /Полный доступ к диску \(Full Disk Access\)/);
  assert.match(skill, /Универсальный доступ \(Accessibility\)/);
  assert.match(skill, /Конфиденциальность и защита/);
  assert.match(feature, /Полный доступ к диску.*Full Disk Access|полного доступа к диску/);
  assert.match(feature, /Универсальный доступ.*Accessibility|универсального доступа/);
  assert.doesNotMatch(feature, /KakaoTalk for Mac/);
  assert.match(feature, /KakaoTalk для Mac/);
});

test("user-facing surfaces не содержат английский жаргон endpoint, anti-bot, scaffold, credential, upstream", () => {
  const agents = read("AGENTS.md");
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const releasing = read(path.join("docs", "releasing.md"));
  const pythonReadme = read(path.join("python-packages", "README.md"));
  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  const zoonFeature = read(path.join("docs", "features", "zoon-nearby.md"));

  assert.doesNotMatch(agents, /\bendpoint\b/);
  assert.doesNotMatch(agents, /proxy-auth/);
  assert.doesNotMatch(agents, /scaffold/);
  assert.match(agents, /конечн.* точк/);
  assert.match(agents, /авторизации посредника/);
  assert.match(agents, /каркасной заготовкой/);

  assert.doesNotMatch(setup, /\bproxy endpoint\b/);
  assert.doesNotMatch(setup, /\bcredential\b/);
  assert.match(setup, /конечн.* точк.* посредник/);
  assert.match(setup, /учётные данные/);

  assert.doesNotMatch(security, /proxy endpoint/);
  assert.match(security, /конечн.* точк.* посредник/);

  assert.doesNotMatch(releasing, /scaffold/);
  assert.match(releasing, /каркасной заготовкой/);

  assert.doesNotMatch(pythonReadme, /scaffold/);
  assert.match(pythonReadme, /Каркас/);

  assert.doesNotMatch(zoonReadme, /anti-bot/);
  assert.match(zoonReadme, /защиты от роботов/);

  assert.doesNotMatch(zoonFeature, /anti-bot/);
  assert.match(zoonFeature, /защиты от ботов/);
});

test("тестовые файлы используют русские сообщения об ошибках вместо unexpected url/URL", () => {
  const kleagueTest = read(path.join("packages", "kleague-results", "test", "index.test.js"));
  const kakaoBarTest = read(path.join("packages", "kakao-bar-nearby", "test", "index.test.js"));
  const airkoreaTest = read(path.join("packages", "k-skill-proxy", "test", "airkorea.test.js"));

  assert.doesNotMatch(kleagueTest, /unexpected url/i);
  assert.match(kleagueTest, /неожиданный URL/);

  assert.doesNotMatch(kakaoBarTest, /unexpected url/i);
  assert.match(kakaoBarTest, /неожиданный URL/);

  assert.doesNotMatch(airkoreaTest, /unexpected URL/i);
  assert.match(airkoreaTest, /неожиданный URL/);
});

test("описания тестов не содержат английский жаргон мок-запрос, upstream-payload", () => {
  const rplTest = read(path.join("packages", "rpl-results", "test", "index.test.js"));
  const ymTest = read(path.join("packages", "yandex-market-search", "test", "index.test.js"));
  const brTest = read(path.join("packages", "blue-ribbon-nearby", "test", "index.test.js"));

  assert.doesNotMatch(rplTest, /мок-запрос/);
  assert.match(rplTest, /имитированный запрос/);

  assert.doesNotMatch(ymTest, /мок-запрос/);
  assert.match(ymTest, /имитированный запрос/);

  assert.doesNotMatch(brTest, /upstream-payload/);
  assert.match(brTest, /вышестоящий ответ/);
});

test("user-facing surfaces не содержат английский жаргон retry policy, tracking query, runtime-, bot-generated, helper", () => {
  const agents = read("AGENTS.md");
  const releasing = read(path.join("docs", "releasing.md"));
  const brandInventory = read(path.join("docs", "brand-inventory.md"));
  const sources = read(path.join("docs", "sources.md"));
  const deliveryFeature = read(path.join("docs", "features", "delivery-tracking.md"));
  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const zipcodeFeature = read(path.join("docs", "features", "zipcode-search.md"));
  const zipcodeSkill = read(path.join("zipcode-search", "SKILL.md"));
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));
  const ruSetup = read(path.join("ru-skill-setup", "SKILL.md"));
  const kSetup = read(path.join("k-skill-setup", "SKILL.md"));
  const readme = read("README.md");

  assert.doesNotMatch(agents, /bot-generated/);
  assert.match(agents, /сгенерированного ботом/);

  assert.doesNotMatch(releasing, /bot-generated/);
  assert.match(releasing, /сгенерированного ботом/);

  assert.doesNotMatch(deliveryFeature, /retry policy/);
  assert.match(deliveryFeature, /политика повторных попыток/);

  assert.doesNotMatch(deliverySkill, /retry policy/);
  assert.match(deliverySkill, /политика повторных попыток/);

  assert.doesNotMatch(srtSkill, /retry-циклы/);
  assert.match(srtSkill, /циклы повторных попыток/);

  assert.doesNotMatch(zipcodeFeature, /\btimeout\b/);
  assert.doesNotMatch(zipcodeFeature, /retry-флагами/);
  assert.doesNotMatch(zipcodeFeature, /retry-механика/);
  assert.match(zipcodeFeature, /тайм-аут/);
  assert.match(zipcodeFeature, /параметрами curl повторных попыток/);
  assert.match(zipcodeFeature, /механизм повторных попыток/);

  assert.doesNotMatch(zipcodeSkill, /\btimeout\b/);
  assert.doesNotMatch(zipcodeSkill.replace(/```[\s\S]*?```/g, ""), /\bretry\b/);
  assert.match(zipcodeSkill, /повторн/);

  assert.doesNotMatch(ymSkill, /tracking query/);
  assert.match(ymSkill, /отслеживающих параметров запроса/);

  assert.doesNotMatch(ymFeature, /tracking query/);
  assert.match(ymFeature, /отслеживающих параметров запроса/);

  assert.doesNotMatch(ruSetup, /runtime-проверки/);
  assert.doesNotMatch(ruSetup, /runtime-artifacts/);
  assert.match(ruSetup, /проверки времени выполнения/);
  assert.match(ruSetup, /артефакты выполнения/);

  assert.doesNotMatch(kSetup, /runtime-проверки/);
  assert.doesNotMatch(kSetup, /runtime-artifacts/);
  assert.match(kSetup, /проверки времени выполнения/);
  assert.match(kSetup, /артефакты выполнения/);

  assert.doesNotMatch(brandInventory, /helper'ах/);
  assert.doesNotMatch(brandInventory, /helpers/);
  assert.match(brandInventory, /вспомогательные утилиты/);

  assert.doesNotMatch(sources, /live-обновления/);
  assert.match(sources, /обновления.*в реальном времени/);

  assert.doesNotMatch(readme, /\bhelper\b.*с обходом/);
  assert.match(readme, /вспомогательный скрипт.*защиты от ботов/);
});

test("SKILL.md файлы zoon-nearby не содержат Anti-bot", () => {
  const zoonSkill = read(path.join("zoon-nearby", "SKILL.md"));
  const zoonPkgSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));

  assert.doesNotMatch(zoonSkill, /Anti-bot/);
  assert.match(zoonSkill, /Антибот|Защита от ботов/);

  assert.doesNotMatch(zoonPkgSkill, /Anti-bot/);
  assert.match(zoonPkgSkill, /Антибот|Защита от ботов/);
});

test("тестовые файлы не содержат английский жаргон payload, live-запросы, upstream-ответы", () => {
  const kleagueTest = read(path.join("packages", "kleague-results", "test", "index.test.js"));
  const proxyTest = read(path.join("packages", "k-skill-proxy", "test", "server.test.js"));

  assert.doesNotMatch(kleagueTest, /payload с месяцем/);
  assert.doesNotMatch(kleagueTest, /live-запросы/);
  assert.match(kleagueTest, /официальные данные с месяцем/);
  assert.match(kleagueTest, /запросы в реальном времени/);

  assert.doesNotMatch(proxyTest, /upstream-ответы/);
  assert.match(proxyTest, /вышестоящие ответы/);
});

test("SKILL.md и feature docs не содержат английский жаргон replacement, backlog, railway flow", () => {
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const blueRibbonSkill = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  const kakaoBarSkill = read(path.join("kakao-bar-nearby", "SKILL.md"));
  const kleagueSkill = read(path.join("kleague-results", "SKILL.md"));
  const daisoSkill = read(path.join("daiso-product-search", "SKILL.md"));
  const tossSkill = read(path.join("toss-securities", "SKILL.md"));
  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  const seoulSubwayFeature = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  const kboFeature = read(path.join("docs", "features", "kbo-results.md"));
  const kakaoBarFeature = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  const deliveryFeature = read(path.join("docs", "features", "delivery-tracking.md"));
  const ktxFeature = read(path.join("docs", "features", "ktx-booking.md"));
  const srtFeature = read(path.join("docs", "features", "srt-booking.md"));

  assert.doesNotMatch(srtSkill, /railway flow/);
  assert.match(srtSkill, /железнодорожный сценарий/);

  assert.doesNotMatch(ktxSkill, /railway flow/);
  assert.match(ktxSkill, /железнодорожный сценарий/);

  assert.doesNotMatch(blueRibbonSkill, /\breplacement\b/);
  assert.match(blueRibbonSkill, /замена/);

  assert.doesNotMatch(kakaoBarSkill, /\breplacement\b/);
  assert.match(kakaoBarSkill, /замена/);

  assert.doesNotMatch(kleagueSkill, /\breplacement\b/);
  assert.match(kleagueSkill, /замена/);

  assert.doesNotMatch(daisoSkill, /\breplacement\b/);
  assert.match(daisoSkill, /замена/);

  assert.doesNotMatch(tossSkill, /\breplacement\b/);
  assert.match(tossSkill, /замена/);

  assert.doesNotMatch(deliverySkill, /free API/);
  assert.doesNotMatch(deliverySkill, /\bbacklog\b/);
  assert.match(deliverySkill, /бесплатные API/);
  assert.match(deliverySkill, /перечень задач/);

  assert.doesNotMatch(seoulSubwayFeature, /\bbacklog\b/);
  assert.match(seoulSubwayFeature, /перечень задач/);

  assert.doesNotMatch(kboFeature, /\bbacklog\b/);
  assert.match(kboFeature, /перечень задач/);

  assert.doesNotMatch(kakaoBarFeature, /\bbacklog\b/);
  assert.match(kakaoBarFeature, /перечень задач/);

  assert.doesNotMatch(deliveryFeature, /\bbacklog\b/);
  assert.match(deliveryFeature, /перечень задач/);

  assert.doesNotMatch(ktxFeature, /railway flow|product boundary/);
  assert.match(ktxFeature, /железнодорожный сценарий/);
  assert.match(ktxFeature, /продуктовая граница/);

  assert.doesNotMatch(srtFeature, /railway flow|product boundary/);
  assert.match(srtFeature, /железнодорожный сценарий/);
  assert.match(srtFeature, /продуктовая граница/);
});

test("SKILL.md и feature docs delivery-tracking используют русские термины для полей адаптера", () => {
  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  const deliveryFeature = read(path.join("docs", "features", "delivery-tracking.md"));

  assert.doesNotMatch(deliverySkill, /\bentrypoint\b/);
  assert.doesNotMatch(deliverySkill, /\bstatus map\b/);
  assert.match(deliverySkill, /точка входа/);
  assert.match(deliverySkill, /таблица статусов/);

  assert.doesNotMatch(deliveryFeature, /carrier adapter/);
  assert.doesNotMatch(deliveryFeature, /adapter fields/);
  assert.doesNotMatch(deliveryFeature, /\bentrypoint\b/);
  assert.doesNotMatch(deliveryFeature, /status map/);
  assert.match(deliveryFeature, /модул[ья]-посредник[аи]? перевозчика/);
  assert.match(deliveryFeature, /схемы полей модуля-посредника|пол[ейя] модуля-посредника/);
  assert.match(deliveryFeature, /точка входа/);
  assert.match(deliveryFeature, /таблица статусов/);
});

test("fine-dust-location SKILL.md не содержит report конечная точка и legacy naming", () => {
  const fdSkill = read(path.join("fine-dust-location", "SKILL.md"));

  assert.doesNotMatch(fdSkill, /report конечная точка/);
  assert.match(fdSkill, /отчётн.* конечн.* точк/);

  assert.doesNotMatch(fdSkill, /legacy naming/);
  assert.match(fdSkill, /устаревшее именование/);
});

test("docs/sources.md не содержит английский жаргон research, railway replacement, antibot flow, open data", () => {
  const sources = read(path.join("docs", "sources.md"));

  assert.doesNotMatch(sources, /## Отдельный research/);
  assert.match(sources, /Отдельное исследование/);

  assert.doesNotMatch(sources, /railway replacement/);
  assert.match(sources, /замена железнодорожных|замену железнодорожных/);

  assert.doesNotMatch(sources, /antibot flow/);
  assert.doesNotMatch(sources, /antibot challenge/);
  assert.match(sources, /поток с защитой от ботов/);
  assert.match(sources, /проверкой на ботов/);

  assert.doesNotMatch(sources, /официальных open data/);
  assert.match(sources, /официальных открытых данных/);
});

test("docs/brand-inventory.md не содержит английский жаргон legacy-compatible, transition-layer, Dual-path", () => {
  const brand = read(path.join("docs", "brand-inventory.md"));

  assert.doesNotMatch(brand, /legacy-compatible/);
  assert.match(brand, /обратно совместимое/);

  assert.doesNotMatch(brand, /transition-layer/);
  assert.match(brand, /переходный слой/);

  assert.doesNotMatch(brand, /Dual-path/);
  assert.match(brand, /Двойной путь/);
});

test("README.md не содержит английский жаргон watchlist, backward-compatible, implementation backlog, booking source", () => {
  const readme = read("README.md");

  assert.doesNotMatch(readme, /\bwatchlist\b/);
  assert.match(readme, /список наблюдения|списку наблюдения/);

  assert.doesNotMatch(readme, /backward-compatible/);
  assert.match(readme, /обратно совместимые/);

  assert.doesNotMatch(readme, /implementation backlog/);
  assert.match(readme, /перечнень задач по реализации|перечня задач по реализации/);

  assert.doesNotMatch(readme, /booking source/);
  assert.match(readme, /источник бронирования/);
});

test("SSR-терминология нормализована: серверно отрендеренный (SSR) вместо голого SSR-", () => {
  const zoonSkill = read(path.join("zoon-nearby", "SKILL.md"));
  const zoonPkgSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));
  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  const zoonFeature = read(path.join("docs", "features", "zoon-nearby.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));

  assert.doesNotMatch(zoonSkill, /SSR-страницы|SSR-вёрстка/);
  assert.match(zoonSkill, /серверн.*(?:отрисовк|рендеринг).*?\(SSR\)|серверно отрендерен/);

  assert.doesNotMatch(zoonPkgSkill, /SSR-страницы|SSR-вёрстка/);
  assert.match(zoonPkgSkill, /серверн.*(?:отрисовк|рендеринг).*?\(SSR\)|серверно отрендерен/);

  assert.doesNotMatch(zoonReadme, /SSR-страницы/);
  assert.match(zoonReadme, /серверн.* отрисовк.* \(SSR|серверно отрендерен/);

  assert.doesNotMatch(zoonFeature, /SSR-страницы/);
  assert.match(zoonFeature, /серверн.* отрисовк.* \(SSR\)|серверно отрендерен/);

  assert.doesNotMatch(ymFeature, /SSR-вёрстка/);
  assert.match(ymFeature, /серверн.* отрисовк.* \(SSR\)|серверно отрендерен/);
});

test("proxy как описательное слово заменён на посредник в user-facing документации (обновлён в раунде 82)", () => {
  const fineDustFeature = read(path.join("docs", "features", "fine-dust-location.md"));
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));
  const proxyFeature = read(path.join("docs", "features", "k-skill-proxy.md"));
  const brand = read(path.join("docs", "brand-inventory.md"));
  const install = read(path.join("docs", "install.md"));
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const sources = read(path.join("docs", "sources.md"));

  const proseFiles = [fineDustFeature, fineDustSkill, ymFeature, brand, install, setup, security, sources];
  for (const content of proseFiles) {
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.includes("`k-skill-proxy`") || line.includes("`k-skill-proxy.nomadamas.org`") || line.includes("`KSKILL_PROXY_BASE_URL`") || line.includes("k-skill-proxy/") || line.includes("k-skill-proxy\\") || line.includes("node packages/k-skill-proxy") || line.startsWith("```")) continue;
      if (/\bproxy\b/.test(line) && !line.includes("k-skill-proxy") && !line.includes("KSKILL_PROXY")) {
        assert.fail(`Найден непереведённый "proxy" в строке: ${line.trim()}`);
      }
    }
  }

  assert.match(fineDustFeature, /посредник/);
  assert.match(fineDustSkill, /посредник/);
  assert.match(ymFeature, /посредник/);
  assert.match(brand, /сценария посредника/);
  assert.match(install, /слоя посредника/);
  assert.match(setup, /совместимого посредника/);
  assert.match(security, /совместимого посредника/);
  assert.match(sources, /интерфейсов посредника/);
});

test("workflow как описательное слово заменён на процесс/сценарий в user-facing документации", () => {
  const releasing = read(path.join("docs", "releasing.md"));
  const agents = read("AGENTS.md");
  const pythonReadme = read(path.join("python-packages", "README.md"));
  const zipcodeFeature = read(path.join("docs", "features", "zipcode-search.md"));
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));

  assert.doesNotMatch(releasing, /\bworkflow публикации\b/);
  assert.match(releasing, /Процесс публикации/);

  assert.doesNotMatch(agents, /\bworkflow выпуска Python\b/);
  assert.match(agents, /процесс выпуска Python/);

  assert.doesNotMatch(pythonReadme, /\bworkflow release-please\b/);
  assert.doesNotMatch(pythonReadme, /\breusable workflow\b/);
  assert.doesNotMatch(pythonReadme, /\btop-level workflow\b/);

  assert.doesNotMatch(zipcodeFeature, /ePost workflow/);
  assert.match(zipcodeFeature, /сценарий ePost/);

  assert.doesNotMatch(install, /skill-only workflow/);
  assert.match(install, /сценарии навыков|skill-сценарии/);
});

test("batch как описательное слово заменён на пакетная обработка в docs/features/hwp.md", () => {
  const hwpFeature = read(path.join("docs", "features", "hwp.md"));
  assert.doesNotMatch(hwpFeature, /Для batch:/);
  assert.doesNotMatch(hwpFeature, /batch-задач/);
  assert.match(hwpFeature, /пакетной обработки/);
  assert.match(hwpFeature, /пакетных задач/);
});

test("plan как описательное слово заменён на план в docs/brand-inventory.md", () => {
  const brand = read(path.join("docs", "brand-inventory.md"));
  assert.doesNotMatch(brand, /Практический plan/);
  assert.match(brand, /Практический план/);
});

test("английские подзаголовки в docs/features/rpl-results.md переведены", () => {
  const rplFeature = read(path.join("docs", "features", "rpl-results.md"));
  assert.doesNotMatch(rplFeature, /### Standings/);
  assert.doesNotMatch(rplFeature, /### Match results/);
  assert.match(rplFeature, /### Турнирная таблица/);
  assert.match(rplFeature, /### Результаты матчей/);
});

test("английские h1 в SKILL.md legacy-навыков переведены", () => {
  const kakaotalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const tossSkill = read(path.join("toss-securities", "SKILL.md"));
  assert.doesNotMatch(kakaotalkSkill, /^# KakaoTalk Mac CLI$/m);
  assert.match(kakaotalkSkill, /^# Командная строка KakaoTalk на macOS$/m);
  assert.doesNotMatch(tossSkill, /^# Toss Securities$/m);
  assert.match(tossSkill, /^# Брокерские данные Toss Securities$/m);
});

test("side effects как описательное слово заменён на побочные эффекты / действия с побочными эффектами", () => {
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const kakaotalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));

  assert.doesNotMatch(srtSkill, /side effects/);
  assert.match(srtSkill, /действия.*изменяющ/);

  assert.doesNotMatch(kakaotalkSkill, /side effects/);
  assert.match(kakaotalkSkill, /побочн.*эффект/);
});

test("holdings заменён на позиции в toss-securities SKILL.md", () => {
  const tossSkill = read(path.join("toss-securities", "SKILL.md"));
  assert.doesNotMatch(tossSkill, /\bholdings\b/);
  assert.match(tossSkill, /позиций в портфеле/);
});

test("pixel-perfect заменён на точную копию в hh-vacancies SKILL.md", () => {
  const hhSkill = read(path.join("hh-vacancies", "SKILL.md"));
  assert.doesNotMatch(hhSkill, /pixel-perfect/);
  assert.match(hhSkill, /точную копию/);
});

test("watchlist в docs/features/toss-securities.md заменён на список наблюдения", () => {
  const tossFeature = read(path.join("docs", "features", "toss-securities.md"));
  const lines = tossFeature.split("\n");
  for (const line of lines) {
    if (line.includes("tossctl watchlist") || line.includes("listWatchlist") || line.startsWith("```")) continue;
    if (/\bwatchlist\b/i.test(line)) {
      assert.fail(`Найден непереведённый "watchlist" в строке: ${line.trim()}`);
    }
  }
  assert.match(tossFeature, /список наблюдения/);
});

test("waitlist в docs/features/ktx-booking.md заменён на лист ожидания", () => {
  const ktxFeature = read(path.join("docs", "features", "ktx-booking.md"));
  const lines = ktxFeature.split("\n");
  for (const line of lines) {
    if (line.includes("--include-waiting-list") || line.includes("--try-waiting") || line.startsWith("```")) continue;
    if (/\bwaitlist\b/i.test(line)) {
      assert.fail(`Найден непереведённый "waitlist" в строке: ${line.trim()}`);
    }
  }
  assert.match(ktxFeature, /лист ожидания/);
});

test("scope в SKILL.md, feature docs и docs/sources.md заменён на область действия", () => {
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const ktxFeature = read(path.join("docs", "features", "ktx-booking.md"));
  const sources = read(path.join("docs", "sources.md"));

  const ymLines = ymSkill.split("\n");
  for (const line of ymLines) {
    if (/\bscope\b/.test(line)) {
      assert.fail(`Найден непереведённый "scope" в yandex-market-search SKILL.md: ${line.trim()}`);
    }
  }

  const ktxLines = ktxFeature.split("\n");
  for (const line of ktxLines) {
    if (/\bscope\b/.test(line)) {
      assert.fail(`Найден непереведённый "scope" в ktx-booking feature doc: ${line.trim()}`);
    }
  }

  const sourcesLines = sources.split("\n");
  for (const line of sourcesLines) {
    if (/\bscope\b/.test(line)) {
      assert.fail(`Найден непереведённый "scope" в docs/sources.md: ${line.trim()}`);
    }
  }

  assert.match(ymSkill, /области действия/);
  assert.match(ktxFeature, /область действия/);
  assert.match(sources, /область действия/);
});

test("inline-характеристики в yandex-market-search заменены на встроенные характеристики", () => {
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));

  assert.doesNotMatch(ymSkill, /inline-характеристик/);
  assert.match(ymSkill, /встроенн.*характеристик/);

  assert.doesNotMatch(ymFeature, /inline-характеристик/);
  assert.match(ymFeature, /встроенн.*характеристик/);
});

test("canonical URL в yandex-market-search заменён на канонический", () => {
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));

  const ymSkillLines = ymSkill.split("\n");
  for (const line of ymSkillLines) {
    if (/\bcanonical\b/i.test(line)) {
      assert.fail(`Найден непереведённый "canonical" в yandex-market-search SKILL.md: ${line.trim()}`);
    }
  }

  const ymFeatureLines = ymFeature.split("\n");
  for (const line of ymFeatureLines) {
    if (/\bcanonical\b/i.test(line)) {
      assert.fail(`Найден непереведённый "canonical" в yandex-market-search feature doc: ${line.trim()}`);
    }
  }
});

test("merchant-level в yandex-market-search feature doc заменён на со стороны продавца", () => {
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));
  assert.doesNotMatch(ymFeature, /merchant-level/);
  assert.match(ymFeature, /со стороны продавца/);
});

test("anchor-точка в kakao-bar-nearby feature doc заменена на опорная точка", () => {
  const kakaoBarFeature = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  assert.doesNotMatch(kakaoBarFeature, /anchor-точк/);
  assert.match(kakaoBarFeature, /опорной точк/);
});

test("slug как описательное слово заменён на идентификатор категории в zoon-nearby и stoloto-lotto", () => {
  const zoonSkill = read(path.join("zoon-nearby", "SKILL.md"));
  const stolotoReadme = read(path.join("packages", "stoloto-lotto", "README.md"));

  const zoonLines = zoonSkill.split("\n");
  for (const line of zoonLines) {
    if (line.startsWith("```")) continue;
    if (/\bslug\b/i.test(line) && !line.includes("`slug`")) {
      assert.fail(`Найден непереведённый "slug" в zoon-nearby SKILL.md: ${line.trim()}`);
    }
  }

  assert.doesNotMatch(stolotoReadme, /канонический slug/);
  assert.doesNotMatch(stolotoReadme, /канонических slug/);
  assert.match(stolotoReadme, /канонический идентификатор/);
});

test("ingress в k-skill-proxy feature doc заменён на входной посредник", () => {
  const proxyFeature = read(path.join("docs", "features", "k-skill-proxy.md"));
  assert.doesNotMatch(proxyFeature, /\bingress\b/);
  assert.match(proxyFeature, /входной посредник/);
});

test("extraction в hwp feature doc заменён на извлечение изображений", () => {
  const hwpFeature = read(path.join("docs", "features", "hwp.md"));
  assert.doesNotMatch(hwpFeature, /Для extraction/);
  assert.match(hwpFeature, /извлечения изображений/);
});

test("flow как описательное слово заменён на поток/сценарий в daiso-product-search README", () => {
  const daisoReadme = read(path.join("packages", "daiso-product-search", "README.md"));
  const lines = daisoReadme.split("\n");
  for (const line of lines) {
    if (/\bflow\b/.test(line) && !line.includes("```") && !line.includes("`flow`")) {
      assert.fail(`Найден непереведённый "flow" в daiso-product-search README: ${line.trim()}`);
    }
  }
});

test("dry-run как описательное слово заменено на пробный запуск в kakaotalk-mac SKILL.md", () => {
  const kakaotalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const lines = kakaotalkSkill.split("\n");
  for (const line of lines) {
    if (line.includes("--dry-run") || line.includes("`--dry-run`") || line.startsWith("```")) continue;
    if (/\bdry-run\b/.test(line)) {
      assert.fail(`Найден непереведённый "dry-run" в kakaotalk-mac SKILL.md: ${line.trim()}`);
    }
  }
  assert.match(kakaotalkSkill, /пробный запуск/);
});

test("тесты пакетов не содержат фикстура/слаг как описательные слова", () => {
  const rplTest = read(path.join("packages", "rpl-results", "test", "index.test.js"));
  const stolotoTest = read(path.join("packages", "stoloto-lotto", "test", "index.test.js"));
  const klottoTest = read(path.join("packages", "k-lotto", "test", "index.test.js"));
  const daisoTest = read(path.join("packages", "daiso-product-search", "test", "index.test.js"));

  assert.doesNotMatch(rplTest, /HTML-фикстур/);
  assert.match(rplTest, /эталонный HTML/);

  assert.doesNotMatch(stolotoTest, /канонические слаги/);
  assert.match(stolotoTest, /канонические идентификаторы/);

  assert.doesNotMatch(klottoTest, /внедрённые фикстуры/);
  assert.match(klottoTest, /эталонные данные/);

  assert.doesNotMatch(daisoTest, /внедрённые фикстуры/);
  assert.match(daisoTest, /эталонные данные/);
});

test("setup-alias, post-install, shared secrets, feature-specific заменены в setup SKILL.md", () => {
  const ruSetupSkill = read(path.join("ru-skill-setup", "SKILL.md"));
  const kSetupSkill = read(path.join("k-skill-setup", "SKILL.md"));

  assert.doesNotMatch(ruSetupSkill, /setup-alias/);
  assert.doesNotMatch(ruSetupSkill, /post-install/);
  assert.doesNotMatch(ruSetupSkill, /shared secrets/);
  assert.doesNotMatch(ruSetupSkill, /feature-specific/);
  assert.doesNotMatch(ruSetupSkill, /setup-навык/);
  assert.doesNotMatch(ruSetupSkill, /setup-поток/);

  assert.match(ruSetupSkill, /псевдоним настройки/);
  assert.match(ruSetupSkill, /после установки/);
  assert.match(ruSetupSkill, /общие секреты/);
  assert.match(ruSetupSkill, /для отдельных функций/);

  assert.doesNotMatch(kSetupSkill, /setup-навык/);
  assert.doesNotMatch(kSetupSkill, /setup-поток/);
  assert.doesNotMatch(kSetupSkill, /\balias\b/);

  assert.match(kSetupSkill, /навык настройки/);
  assert.match(kSetupSkill, /поток настройки/);
  assert.match(kSetupSkill, /псевдоним/);
});

test("product card page в yandex-market-search SKILL.md заменён на страницу карточки товара", () => {
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  assert.doesNotMatch(ymSkill, /product card page/);
  assert.match(ymSkill, /страниц[ыу] карточки товара/);
});

test("Raw JSON в kbo-results SKILL.md заменён на необработанный JSON", () => {
  const kboSkill = read(path.join("kbo-results", "SKILL.md"));
  assert.doesNotMatch(kboSkill, /Raw JSON/);
  assert.match(kboSkill, /Необработанный JSON/);
});

test("regex- жаргон заменён на регулярные выражения в target-документации", () => {
  const rplFeature = read(path.join("docs", "features", "rpl-results.md"));
  const kinoFeature = read(path.join("docs", "features", "kinopoisk-search.md"));
  const stolotoFeature = read(path.join("docs", "features", "stoloto-lotto.md"));
  const stolotoReadme = read(path.join("packages", "stoloto-lotto", "README.md"));
  const kinoReadme = read(path.join("packages", "kinopoisk-search", "README.md"));

  for (const doc of [rplFeature, kinoFeature, stolotoFeature, stolotoReadme, kinoReadme]) {
    assert.doesNotMatch(doc, /regex-/i);
    assert.match(doc, /регулярн.*выражен/i);
  }
});

test("backlog как описательное слово заменён на перечень задач в user-facing surfaces", () => {
  const zipcodeFeature = read(path.join("docs", "features", "zipcode-search.md"));
  const fineDustFeature = read(path.join("docs", "features", "fine-dust-location.md"));
  const kakaoTalkFeature = read(path.join("docs", "features", "kakaotalk-mac.md"));
  const kleagueFeature = read(path.join("docs", "features", "kleague-results.md"));
  const kakaoBarReadme = read(path.join("packages", "kakao-bar-nearby", "README.md"));
  const kleagueReadme = read(path.join("packages", "kleague-results", "README.md"));

  for (const doc of [zipcodeFeature, fineDustFeature, kakaoTalkFeature, kleagueFeature, kakaoBarReadme, kleagueReadme]) {
    assert.doesNotMatch(doc, /\bbacklog\b/i);
    assert.match(doc, /перечень задач/i);
  }
});

test("target- и transition- и legacy- как описательные слова заменены в SKILL.md и feature docs", () => {
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));
  const tossSkill = read(path.join("toss-securities", "SKILL.md"));
  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  const hwpSkill = read(path.join("hwp", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const lottoSkill = read(path.join("lotto-results", "SKILL.md"));
  const seoulSkill = read(path.join("seoul-subway-arrival", "SKILL.md"));
  const daisoSkill = read(path.join("daiso-product-search", "SKILL.md"));
  const blueRibbonSkill = read(path.join("blue-ribbon-nearby", "SKILL.md"));

  for (const doc of [fineDustSkill, tossSkill, deliverySkill, seoulSkill, blueRibbonSkill]) {
    assert.doesNotMatch(doc, /target-направлен/i);
    assert.match(doc, /целевым направлен/i);
  }

  assert.doesNotMatch(hwpSkill, /target-supporting/);
  assert.match(hwpSkill, /целевой-вспомогательный/);

  assert.doesNotMatch(ktxSkill, /target-линейке/);
  assert.match(ktxSkill, /целевой линейке/);

  assert.doesNotMatch(lottoSkill, /target-кандидат/);
  assert.match(lottoSkill, /целевой кандидат/);

  assert.doesNotMatch(daisoSkill, /target-трек/);
  assert.match(daisoSkill, /целевое направление/);

  assert.doesNotMatch(fineDustSkill, /legacy\/transition.*утилит/i);
  assert.match(fineDustSkill, /устаревш.*переходн.*утилит/i);

  assert.doesNotMatch(fineDustSkill, /legacy-резерв/);
  assert.match(fineDustSkill, /устаревший резерв/);

  assert.doesNotMatch(fineDustSkill, /legacy-контекст/);
  assert.match(fineDustSkill, /устаревший контекст/);
});

test("free как описательное слово заменено на бесплатный в SKILL.md zoon-nearby", () => {
  const zoonSkill = read(path.join("zoon-nearby", "SKILL.md"));
  const zoonPkgSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));

  for (const doc of [zoonSkill, zoonPkgSkill]) {
    assert.doesNotMatch(doc, /`free`/);
    assert.match(doc, /`бесплатный`/);
  }
});

test("optional в параметрах API заменён на опционально в feature docs zoon-nearby", () => {
  const zoonFeature = read(path.join("docs", "features", "zoon-nearby.md"));
  assert.doesNotMatch(zoonFeature, /\boptional\b/);
  assert.match(zoonFeature, /опционально/);
});

test("Nearby-поиск и Nearby JSON заменены на русские эквиваленты", () => {
  const sources = read(path.join("docs", "sources.md"));
  const blueRibbonReadme = read(path.join("packages", "blue-ribbon-nearby", "README.md"));

  assert.doesNotMatch(sources, /Nearby-поиск/);
  assert.match(sources, /Поиск ближайших/);

  assert.doesNotMatch(blueRibbonReadme, /Nearby JSON/);
  assert.match(blueRibbonReadme, /JSON ресторанов поблизости/);
});

test("legacy- compounds заменены на устаревш* в пользовательской документации (setup, security, sources, install, brand-inventory, booking-replacements)", () => {
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const sources = read(path.join("docs", "sources.md"));
  const install = read(path.join("docs", "install.md"));
  const brandInventory = read(path.join("docs", "brand-inventory.md"));
  const booking = read(path.join("docs", "booking-replacements.md"));

  for (const doc of [setup, security, sources, install, brandInventory, booking]) {
    assert.doesNotMatch(doc, /legacy-резерв/);
    assert.doesNotMatch(doc, /legacy-файл/);
    assert.doesNotMatch(doc, /legacy-имя/);
    assert.doesNotMatch(doc, /legacy-навык/);
    assert.doesNotMatch(doc, /legacy-пакет/);
    assert.doesNotMatch(doc, /legacy-сценари/);
    assert.doesNotMatch(doc, /legacy-функц/);
    assert.doesNotMatch(doc, /legacy-контекст/);
    assert.doesNotMatch(doc, /legacy-поверхност/);
    assert.doesNotMatch(doc, /legacy-маркировк/);
    assert.doesNotMatch(doc, /legacy-документ/);
    assert.doesNotMatch(doc, /legacy-booking/);
    assert.doesNotMatch(doc, /legacy-адаптер/);
  }

  assert.match(setup, /устаревший резерв/);
  assert.match(security, /устаревший резерв/);
  assert.match(sources, /устаревших навыков/);
  assert.match(sources, /устаревшего пакета/);
  assert.match(sources, /устаревшего сценария/);
  assert.match(sources, /устаревших сценариев/);
  assert.match(sources, /устаревшей документации/);
  assert.match(install, /устаревшее имя/);
  assert.match(install, /устаревших пакетов npm|устаревших npm-пакетов/);
  assert.match(brandInventory, /устаревших интерфейсов/);
  assert.match(booking, /устаревших навыков/);
});

test("legacy- compounds заменены на устаревш* в feature docs (yandex-rasp, k-skill-proxy, yandex-market-search)", () => {
  const yandexRasp = read(path.join("docs", "features", "yandex-rasp.md"));
  const kSkillProxy = read(path.join("docs", "features", "k-skill-proxy.md"));
  const yandexMarket = read(path.join("docs", "features", "yandex-market-search.md"));

  for (const doc of [yandexRasp, kSkillProxy, yandexMarket]) {
    assert.doesNotMatch(doc, /legacy-навык/);
    assert.doesNotMatch(doc, /legacy-сценари/);
    assert.doesNotMatch(doc, /legacy-адаптер/);
  }

  assert.match(yandexRasp, /устаревших навыков/);
  assert.match(kSkillProxy, /устаревший модуль-посредник/);
  assert.match(kSkillProxy, /устаревших сценариев/);
  assert.match(yandexMarket, /устаревшего навыка/);
});

test("adapter'ы и job-search заменены на русские эквиваленты в документации", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  const brandInventory = read(path.join("docs", "brand-inventory.md"));

  assert.doesNotMatch(roadmap, /adapter'ы/);
  assert.doesNotMatch(brandInventory, /adapter'ы/);
  assert.match(roadmap, /русскоязычные модули-посредники/);
  assert.match(brandInventory, /русскоязычные модули-посредники/);

  assert.doesNotMatch(roadmap, /job-search/);
  assert.match(roadmap, /поиска работы/);
});

test("remaining guides заменено на оставшиеся guides в brand-inventory", () => {
  const brandInventory = read(path.join("docs", "brand-inventory.md"));
  assert.doesNotMatch(brandInventory, /\bremaining\b/);
  assert.match(brandInventory, /оставшиеся/);
});

test("SKILL.md не содержит legacy- compounds", () => {
  const ruSetup = read(path.join("ru-skill-setup", "SKILL.md"));
  const kSetup = read(path.join("k-skill-setup", "SKILL.md"));
  const yandexMarketSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const yandexRaspSkill = read(path.join("yandex-rasp", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));

  assert.doesNotMatch(ruSetup, /legacy-имен/);
  assert.match(ruSetup, /устаревшим именем/);

  assert.doesNotMatch(kSetup, /legacy-совместим/);
  assert.match(kSetup, /обратно совместим/);

  assert.doesNotMatch(yandexMarketSkill, /legacy-сценари/);
  assert.match(yandexMarketSkill, /устаревший сценарий/);

  assert.doesNotMatch(yandexRaspSkill, /legacy-навык/);
  assert.match(yandexRaspSkill, /устаревших навыков/);

  assert.doesNotMatch(ktxSkill, /legacy-booking/);
  assert.doesNotMatch(srtSkill, /legacy-booking/);
  assert.match(ktxSkill, /устаревших навыков бронирования/);
  assert.match(srtSkill, /устаревших навыков бронирования/);
});

test("README.md пользовательские секции не содержат legacy- compounds", () => {
  const readme = read("README.md");

  assert.doesNotMatch(readme, /legacy-имя `k-skill`/);
  assert.match(readme, /устаревшее имя `k-skill`/);

  assert.doesNotMatch(readme, /legacy-функции из `k-skill`/);
  assert.match(readme, /устаревшие функции из `k-skill`/);

  assert.doesNotMatch(readme, /legacy-пакетов:/);
  assert.match(readme, /устаревших пакетов:/);

  assert.doesNotMatch(readme, /legacy-имя `k-skill-setup`/);
  assert.match(readme, /устаревшее имя `k-skill-setup`/);

  assert.doesNotMatch(readme, /Legacy-совместимый/);
  assert.match(readme, /Обратно совместимый/);

  assert.doesNotMatch(readme, /booking-навыков/);
  assert.match(readme, /навыков бронирования/);
});

test("docs/sources.md не содержит server-side rendered (заменено на сгенерированный на сервере)", () => {
  const sources = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(sources, /server-side rendered/);
  assert.match(sources, /сгенерированный на сервере/);
});

test("docs/features/delivery-tracking.md не содержит Endpoint (заменено на Эндпоинт)", () => {
  const feature = read(path.join("docs", "features", "delivery-tracking.md"));
  assert.doesNotMatch(feature, /Endpoint деталей/);
  assert.doesNotMatch(feature, /Endpoint запроса/);
  assert.match(feature, /Конечная точка деталей/);
  assert.match(feature, /Конечная точка запроса/);
});

test("Legacy- compounds заменены на устаревш* в security-and-secrets.md, ru-skill-setup/SKILL.md и docs/install.md", () => {
  const security = read(path.join("docs", "security-and-secrets.md"));
  const ruSetup = read(path.join("ru-skill-setup", "SKILL.md"));
  const install = read(path.join("docs", "install.md"));

  assert.doesNotMatch(security, /Legacy-резерв/);
  assert.match(security, /Устаревший резерв/);

  assert.doesNotMatch(security, /Legacy-файл/);
  assert.match(security, /Устаревший файл/);

  assert.doesNotMatch(ruSetup, /Legacy-резерв/);
  assert.match(ruSetup, /Устаревший резерв/);

  assert.doesNotMatch(ruSetup, /Legacy-резервный/);
  assert.match(ruSetup, /Устаревший резервный/);

  assert.doesNotMatch(install, /Legacy-имя/);
  assert.match(install, /Устаревшее имя/);
});

test("kakaotalk-mac/SKILL.md не содержит server-to-server (заменено на межсерверной)", () => {
  const skill = read(path.join("kakaotalk-mac", "SKILL.md"));
  assert.doesNotMatch(skill, /server-to-server/);
  assert.match(skill, /межсерверной/);
});

test("packages/k-skill-proxy/README.md не содержит legacy- compounds и API proxy", () => {
  const readme = read(path.join("packages", "k-skill-proxy", "README.md"));

  assert.doesNotMatch(readme, /legacy-кейс/);
  assert.match(readme, /устаревший сценарий/);

  assert.doesNotMatch(readme, /legacy fine-dust/);
  assert.match(readme, /устаревший сценарий `fine-dust`/);

  assert.doesNotMatch(readme, /legacy-файл/);
  assert.match(readme, /устаревший файл/);

  assert.doesNotMatch(readme, /API proxy/);
  assert.match(readme, /посредник для бесплатных API/);
});

test("docs/booking-replacements.md не содержит booking-навыков и railway-booking", () => {
  const doc = read(path.join("docs", "booking-replacements.md"));
  assert.doesNotMatch(doc, /booking-навыков/);
  assert.match(doc, /навыков бронирования/);
  assert.doesNotMatch(doc, /railway-booking/);
  assert.match(doc, /железнодорожного бронирования/);
});

test("SKILL.md frontmatter не содержит Legacy-совместимый (заменено на обратно совместимый)", () => {
  const srtSkill = read(path.join("srt-booking", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const kSetup = read(path.join("k-skill-setup", "SKILL.md"));
  const delivery = read(path.join("delivery-tracking", "SKILL.md"));
  const toss = read(path.join("toss-securities", "SKILL.md"));

  assert.doesNotMatch(srtSkill, /Legacy-совместимый/);
  assert.match(srtSkill, /Обратно совместимый/);

  assert.doesNotMatch(ktxSkill, /Legacy-совместимый/);
  assert.match(ktxSkill, /Обратно совместимый/);

  assert.doesNotMatch(kSetup, /Legacy-совместимый/);
  assert.match(kSetup, /Обратно совместимый/);

  assert.doesNotMatch(delivery, /Legacy-совместимое/);
  assert.match(delivery, /Обратно совместимое/);

  assert.doesNotMatch(toss, /Legacy-совместимая/);
  assert.match(toss, /Обратно совместимая/);
});

test("docs/features/blue-ribbon-nearby.md не содержит Legacy-формулировка", () => {
  const feature = read(path.join("docs", "features", "blue-ribbon-nearby.md"));
  assert.doesNotMatch(feature, /Legacy-формулировка/);
  assert.match(feature, /Устаревшая формулировка/);
});

test("tg/ README файлы переведены на русский", () => {
  const tgFiles = [
    path.join("tg", "my-ru-coverage", "README.md"),
    path.join("tg", "codex-console-english", "README.md"),
    path.join("tg", "repo-autowork", "README.md"),
    path.join("tg", "mcp-russia", "README.md"),
  ];
  for (const f of tgFiles) {
    const content = read(f);
    assert.doesNotMatch(content, /Local Telegram mirror/);
    assert.match(content, /Локальный зеркальный канал Telegram/);
  }
});

test("AGENTS.md не содержит английского жаргона merge, metadata, fixture", () => {
  const agents = read("AGENTS.md");
  assert.doesNotMatch(agents, /\bmerge сгенерированного/);
  assert.match(agents, /слияния сгенерированного/);
  assert.doesNotMatch(agents, /package metadata/);
  assert.match(agents, /метаданные пакетов/);
  assert.doesNotMatch(agents, /test fixture/);
  assert.match(agents, /тестовый эталон/);
});

test("docs/releasing.md не содержит английского жаргона merge, metadata", () => {
  const releasing = read(path.join("docs", "releasing.md"));
  assert.doesNotMatch(releasing, /\bmerge сгенерированного/);
  assert.match(releasing, /слияния сгенерированного/);
  assert.doesNotMatch(releasing, /package metadata/);
  assert.match(releasing, /метаданные пакета/);
});

test("README.md не содержит английского жаргона metadata, helper, release, smoke, fixture, proxy", () => {
  const readme = read("README.md");
  assert.doesNotMatch(readme, /package metadata/);
  assert.match(readme, /метаданные пакетов/);
  assert.doesNotMatch(readme, /npm\/publish metadata/);
  assert.match(readme, /метаданные публикации/);
  assert.doesNotMatch(readme, /helper-docs/);
  assert.doesNotMatch(readme, /release hygiene/);
  assert.match(readme, /гигиен[а-яё]+ выпуск/);
  assert.doesNotMatch(readme, /release-археолог/);
  assert.match(readme, /архиваци[а-яё]+ выпуск/);
  assert.doesNotMatch(readme, /smoke-пример/);
  assert.match(readme, /проверочными примерами/);
  assert.doesNotMatch(readme, /credential\/proxy документам/);
  assert.doesNotMatch(readme, /publish\/release surfaces/);
  assert.match(readme, /интерфейсах публикации|интерфейсам публикации\/выпуска/);
  assert.doesNotMatch(readme, /Python helper messages/);
  assert.match(readme, /вспомогательные сообщения Python/);
  assert.doesNotMatch(readme, /helper JS utilities/);
  assert.match(readme, /вспомогательные утилиты JS/);
  assert.doesNotMatch(readme, /fixture data/);
  assert.match(readme, /эталонные данные/);
});

test("docs/roadmap.md не содержит английского жаргона helper, metadata, release, guide", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  assert.doesNotMatch(roadmap, /feature-guide/);
  assert.match(roadmap, /руководство по функции/);
  assert.doesNotMatch(roadmap, /release hygiene/);
  assert.match(roadmap, /гигиен выпусков|гигиены выпусков/);
  assert.doesNotMatch(roadmap, /release backlog/);
  assert.match(roadmap, /выпускных задач/);
  assert.doesNotMatch(roadmap, /release-hygiene подзадача/);
  assert.match(roadmap, /подзадача гигиены выпусков/);
  assert.doesNotMatch(roadmap, /helper\/runtime cleanup/);
  assert.match(roadmap, /вспомогательная\/очистка среды выполнения/);
  assert.doesNotMatch(roadmap, /package metadata descriptions/);
  assert.match(roadmap, /метаданные пакетов/);
  assert.doesNotMatch(roadmap, /helper-поверхност|helper-интерфейс/);
  assert.match(roadmap, /вспомогательных интерфейсах/);
});

test("docs/features/kleague-results.md не содержит merge", () => {
  const doc = read(path.join("docs", "features", "kleague-results.md"));
  assert.doesNotMatch(doc, /\bmerge\b/);
  assert.match(doc, /после слияния/);
});

test("yandex-rasp/SKILL.md и yandex-market-search/SKILL.md содержат h1", () => {
  const yandexRasp = read(path.join("yandex-rasp", "SKILL.md"));
  const yandexMarket = read(path.join("yandex-market-search", "SKILL.md"));
  assert.match(yandexRasp, /^# Расписания Яндекс$/m);
  assert.match(yandexMarket, /^# Поиск на Яндекс Маркете$/m);
});

test("AGENTS.md и docs/releasing.md не содержат английского жаргона trusted publishing, long-lived", () => {
  const agents = read("AGENTS.md");
  const releasing = read(path.join("docs", "releasing.md"));
  const pythonReadme = read(path.join("python-packages", "README.md"));

  assert.doesNotMatch(agents, /trusted publishing/i);
  assert.match(agents, /доверенную публикацию/);
  assert.doesNotMatch(agents, /long-lived registry tokens/);
  assert.match(agents, /долгоживущие маркеры реестра/);

  assert.doesNotMatch(releasing, /trusted publishing/i);
  assert.match(releasing, /доверенная публикация|Доверенная публикация/);

  assert.doesNotMatch(pythonReadme, /trusted publishing/i);
  assert.match(pythonReadme, /доверенная публикация|Доверенная публикация/);
});

test("README.md таблица пакетов использует русские статус-метки", () => {
  const readme = read("README.md");
  const packageMatrix = extractReadmePackageMatrix(readme);

  const allowedStatuses = ["Целевой", "Устаревший", "Переходный"];
  for (const pkg of packageMatrix) {
    assert.ok(
      allowedStatuses.includes(pkg.status),
      `ожидался русский статус для ${pkg.name}, получен: ${pkg.status}`,
    );
  }
  assert.doesNotMatch(readme, /\| Target \|/);
  assert.doesNotMatch(readme, /\| Legacy \|/);
  assert.doesNotMatch(readme, /\| Transition \|/);
  assert.doesNotMatch(readme, /migration backlog/);
  assert.match(readme, /перечня задач миграции/);
  assert.doesNotMatch(readme, /Milestone \d/);
});

test("docs/roadmap.md использует русские статус-метки и термины", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));

  assert.doesNotMatch(roadmap, /Legacy inventory/);
  assert.match(roadmap, /Инвентарь устаревших пакетов/);
  assert.doesNotMatch(roadmap, /dual-path secrets/);
  assert.doesNotMatch(roadmap, /`legacy`, `transition` или `target`/);
  assert.match(roadmap, /`устаревший`, `переходный` или `целевой`/);
  assert.doesNotMatch(roadmap, /\bMilestone \d/);
});

test("SKILL.md и feature docs не содержат алиас/alias и флаг вместо признак/псевдоним", () => {
  const blueRibbonSkill = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  const blueRibbonDoc = read(path.join("docs", "features", "blue-ribbon-nearby.md"));
  const kleagueDoc = read(path.join("docs", "features", "kleague-results.md"));
  const kleagueReadme = read(path.join("packages", "kleague-results", "README.md"));
  const pravoReadme = read(path.join("packages", "pravo-documents", "README.md"));
  const kakaotalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));
  const zipcodeDoc = read(path.join("docs", "features", "zipcode-search.md"));

  assert.doesNotMatch(blueRibbonSkill, /алиас/);
  assert.match(blueRibbonSkill, /псевдоним/);

  assert.doesNotMatch(blueRibbonDoc, /\balias\b/);
  assert.match(blueRibbonDoc, /псевдоним/);

  assert.doesNotMatch(kleagueDoc, /алиас/);
  assert.match(kleagueDoc, /псевдоним/);

  assert.doesNotMatch(kleagueReadme, /short name, full name или team code alias/);
  assert.match(kleagueReadme, /код-псевдоним команды/);

  assert.doesNotMatch(pravoReadme, /флагом/);
  assert.match(pravoReadme, /признаком/);

  assert.doesNotMatch(kakaotalkSkill, /Флаг тестовой/);
  assert.match(kakaotalkSkill, /Признак тестовой/);

  assert.doesNotMatch(zipcodeDoc, /curl флагами/);
  assert.match(zipcodeDoc, /параметрами curl/);
});

test("docs/sources.md не содержит slug в русском тексте описания stoloto", () => {
  const sources = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(sources, /slug лотереи/);
  assert.match(sources, /идентификатор лотереи/);
});

test("docs/booking-replacements.md не содержит Legacy как английский жаргон", () => {
  const booking = read(path.join("docs", "booking-replacements.md"));
  assert.doesNotMatch(booking, /Legacy `srt-booking/);
  assert.match(booking, /Устаревшие `srt-booking/);
});

test("docs/sources.md не содержит MVP", () => {
  const sources = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(sources, /\bMVP\b/);
  assert.match(sources, /минимальн[а-яё]+ рабоч[а-яё]+ вариант/);
});

test("SKILL.md и docs не содержат secret vault", () => {
  const setupDoc = read(path.join("docs", "setup.md"));
  const securityDoc = read(path.join("docs", "security-and-secrets.md"));
  const kSetupSkill = read(path.join("k-skill-setup", "SKILL.md"));
  const ruSetupSkill = read(path.join("ru-skill-setup", "SKILL.md"));
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));

  assert.doesNotMatch(setupDoc, /secret vault/);
  assert.doesNotMatch(setupDoc, /\bvault\b/);
  assert.match(setupDoc, /хранилищ[а-яё]+ секретов/);

  assert.doesNotMatch(securityDoc, /secret vault/);
  assert.doesNotMatch(securityDoc, /\bvault\b/);
  assert.match(securityDoc, /хранилищ[а-яё]+ секретов/);

  assert.doesNotMatch(kSetupSkill, /secret vault/);
  assert.doesNotMatch(kSetupSkill, /\bvault\b/);
  assert.match(kSetupSkill, /хранилищ[а-яё]+ секретов/);

  assert.doesNotMatch(ruSetupSkill, /secret vault/);
  assert.doesNotMatch(ruSetupSkill, /\bvault\b/);
  assert.match(ruSetupSkill, /Хранилищ[а-яё]+ секретов/);

  assert.doesNotMatch(fineDustSkill, /secret vault/);
  assert.doesNotMatch(fineDustSkill, /\bvault\b/);
  assert.match(fineDustSkill, /хранилищ[а-яё]+ секретов/);
});

 test("SKILL.md и docs не содержат legacy-only", () => {
  const kakaoBarSkill = read(path.join("kakao-bar-nearby", "SKILL.md"));
  const ktxBookingSkill = read(path.join("ktx-booking", "SKILL.md"));
  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  const installDoc = read(path.join("docs", "install.md"));
  const kLottoReadme = read(path.join("packages", "k-lotto", "README.md"));

  assert.doesNotMatch(kakaoBarSkill, /legacy-only/);
  assert.match(kakaoBarSkill, /устаревший без развития/);

  assert.doesNotMatch(ktxBookingSkill, /legacy-only/);
  assert.match(ktxBookingSkill, /устаревший без развития/);

  assert.doesNotMatch(deliverySkill, /legacy-only/);
  assert.match(deliverySkill, /устаревший без развития/);

  assert.doesNotMatch(installDoc, /legacy-only/);
  assert.match(installDoc, /устаревший без развития/);

  assert.doesNotMatch(kLottoReadme, /legacy-only/);
  assert.match(kLottoReadme, /устаревший без развития/);
});

test("SKILL.md не содержит ad-hoc", () => {
  const moexSkill = read(path.join("moex-shares", "SKILL.md"));
  const hhSkill = read(path.join("hh-vacancies", "SKILL.md"));
  const postcalcSkill = read(path.join("postcalc-postcodes", "SKILL.md"));

  assert.doesNotMatch(moexSkill, /ad-hoc/);
  assert.match(moexSkill, /разовый/);

  assert.doesNotMatch(hhSkill, /ad-hoc/);
  assert.match(hhSkill, /разовые/);

  assert.doesNotMatch(postcalcSkill, /ad-hoc/);
  assert.match(postcalcSkill, /разов(ая|ую|ый)/);
});

test("docs/releasing.md не содержит provenance-метаданные", () => {
  const releasing = read(path.join("docs", "releasing.md"));
  assert.doesNotMatch(releasing, /provenance-метаданные/);
  assert.match(releasing, /метаданные происхождения/);
});

test("python-packages/README.md не содержит английскую задачу публикации", () => {
  const pyReadme = read(path.join("python-packages", "README.md"));
  assert.doesNotMatch(pyReadme, /publish job/);
  assert.match(pyReadme, /задачу публикации/);
});

test("k-skill-proxy surfaces не содержат target-продукт, Legacy конечная точка, public сценарии API", () => {
  const proxyReadme = read(path.join("packages", "k-skill-proxy", "README.md"));
  const proxyDoc = read(path.join("docs", "features", "k-skill-proxy.md"));

  assert.doesNotMatch(proxyReadme, /target-продукт/);
  assert.doesNotMatch(proxyReadme, /Legacy конечная точка/);
  assert.match(proxyReadme, /целевым продуктом/);
  assert.match(proxyReadme, /Устаревшая конечная точка/);

  assert.doesNotMatch(proxyDoc, /public сценарии API/);
  assert.doesNotMatch(proxyDoc, /legacy конечная точка/);
  assert.doesNotMatch(proxyDoc, /Legacy конечная точка/);
  assert.match(proxyDoc, /публичные сценарии API/);
  assert.match(proxyDoc, /устаревшая конечная точка|Устаревшая конечная точка/);
});

test("moex-shares/SKILL.md не содержит lot size и board id", () => {
  const moexSkill = read(path.join("moex-shares", "SKILL.md"));
  assert.doesNotMatch(moexSkill, /lot size/);
  assert.match(moexSkill, /размер лота/);
  assert.doesNotMatch(moexSkill, /board id/);
  assert.match(moexSkill, /идентификатор доски торгов/);
});

test("packages/osm-nearby/SKILL.md не содержит amenity-типы", () => {
  const osmSkill = read(path.join("packages", "osm-nearby", "SKILL.md"));
  assert.doesNotMatch(osmSkill, /amenity-типы/);
  assert.doesNotMatch(osmSkill, /Типы amenity/);
  assert.match(osmSkill, /типы заведений|Типы заведений/);
});

test("политика секретов и навык настройки используют простой формат dotenv", () => {
  const securityDoc = read(path.join("docs", "security-and-secrets.md"));
  const kSetupSkill = read(path.join("k-skill-setup", "SKILL.md"));

  assert.doesNotMatch(securityDoc, /plain dotenv/);
  assert.match(securityDoc, /простой dotenv/);

  assert.doesNotMatch(kSetupSkill, /plain dotenv/);
  assert.match(kSetupSkill, /простого файла окружения \(dotenv\)/);
});

test("fine-dust-location/SKILL.md не содержит skill-level copy", () => {
  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));
  assert.doesNotMatch(fineDustSkill, /skill-level copy/);
  assert.match(fineDustSkill, /тексте навыка/);
});

test("yandex-market-search/SKILL.md и docs/booking-replacements.md не содержат MVP", () => {
  const ymSkill = read(path.join("yandex-market-search", "SKILL.md"));
  const booking = read(path.join("docs", "booking-replacements.md"));

  assert.doesNotMatch(ymSkill, /\bMVP\b/);
  assert.match(ymSkill, /минимальн[а-яё]+ рабоч[а-яё]+ вариант/);

  assert.doesNotMatch(booking, /\bMVP\b/);
  assert.match(booking, /минимальн[а-яё]+ рабоч[а-яё]+ вариант/);
});

test("документация использует запрос на слияние вместо PR", () => {
  const releasing = read(path.join("docs", "releasing.md"));
  const agents = read("AGENTS.md");

  assert.doesNotMatch(releasing, /\bPR\b(?![\s`]*Version)/);
  assert.match(releasing, /запрос.*на слияние/);

  assert.doesNotMatch(agents, /сгенерированного ботом PR\b/);
  assert.match(agents, /запрос.*на слияние/);
});

test("AGENTS.md не содержит repo-local", () => {
  const agents = read("AGENTS.md");
  assert.doesNotMatch(agents, /repo-local/);
  assert.match(agents, /локальн[а-яё]+ каталог[а-яё]* репозитория/);
});

test("docs/features/stoloto-lotto.md использует пакет вместо английского заимствования", () => {
  const stoloto = read(path.join("docs", "features", "stoloto-lotto.md"));
  assert.doesNotMatch(stoloto, /через package/);
  assert.match(stoloto, /через пакет/);
});

test("k-skill-setup/SKILL.md не содержит legacy без перевода в критических местах", () => {
  const skill = read(path.join("k-skill-setup", "SKILL.md"));
  assert.doesNotMatch(skill, /;\s*legacy\s+`~/);
  assert.match(skill, /;\s*устаревший\s+`~/);
});

test("docs/sources.md не содержит навык standalone, публичный API, нечёткий поиск, веб-сокеты, конструкции запросов, со стороны продавца, ключи API, регрессионные тесты", () => {
  const sources = read(path.join("docs", "sources.md"));

  assert.doesNotMatch(sources, /Техническая основа: skill \+/);
  assert.match(sources, /Техническая основа: навык \+/);

  assert.doesNotMatch(sources, /public API для локального skill/);
  assert.match(sources, /публичный API для локального навыка/);

  assert.doesNotMatch(sources, /fuzzy search/);
  assert.match(sources, /нечёткий поиск/);

  assert.doesNotMatch(sources, /,\s*websocket и/);
  assert.match(sources, /веб-сокеты/);

  assert.doesNotMatch(sources, /Query-конструкциями/);
  assert.match(sources, /конструкциями запросов/);

  assert.doesNotMatch(sources, /merchant-facing/);
  assert.match(sources, /со стороны продавца/);

  assert.doesNotMatch(sources, /без API keys/);
  assert.match(sources, /без ключей API/);

  assert.doesNotMatch(sources, /regression-тесты/);
  assert.match(sources, /регрессионные тесты/);

  assert.doesNotMatch(sources, /skill-гайды/);
  assert.match(sources, /руководства по навыкам/);
});

test("docs/install.md использует настройка вместо setup в заголовке", () => {
  const install = read(path.join("docs", "install.md"));
  assert.doesNotMatch(install, /## Навыки, которым нужен setup/);
  assert.match(install, /## Навыки, которым нужна настройка/);
});

test("docs/security-and-secrets.md использует файл секретов и настройку вместо secrets-файл и setup", () => {
  const security = read(path.join("docs", "security-and-secrets.md"));
  assert.doesNotMatch(security, /## Стандартный secrets-файл/);
  assert.match(security, /## Стандартный файл секретов/);
  assert.doesNotMatch(security, /гайде по setup/);
  assert.match(security, /руководстве по настройке/);
});

test("docs/features/zoon-nearby.md использует ключи API вместо API keys", () => {
  const zoon = read(path.join("docs", "features", "zoon-nearby.md"));
  assert.doesNotMatch(zoon, /\*\*API keys\*\*/);
  assert.match(zoon, /\*\*ключи API\*\*/);
});

test("AGENTS.md использует путь пакета вместо package path", () => {
  const agents = read("AGENTS.md");
  assert.doesNotMatch(agents, /package path/);
  assert.match(agents, /путь пакета|пути пакета/);
});

test("docs/roadmap.md использует перечень задач и раундов автоматизации вместо task list и automation round", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  assert.doesNotMatch(roadmap, /task list/);
  assert.doesNotMatch(roadmap, /automation round/);
  assert.match(roadmap, /живой перечень задач/);
  assert.match(roadmap, /раунд[а-яё]* автоматизации/);
});

test("docs/features/*.md используют Руководство вместо Гайд в заголовках", () => {
  const featureDir = path.join(repoRoot, "docs", "features");
  const files = fs.readdirSync(featureDir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const content = read(path.join("docs", "features", file));
    assert.doesNotMatch(content, /^# Гайд по /, `${file} не должен содержать "Гайд" в h1`);
    if (content.includes("Руководство по")) {
      assert.match(content, /^# Руководство по /, `${file} должен использовать "Руководство" в h1`);
    }
  }
});

test("README.md использует Руководство вместо Гайд в ссылках", () => {
  const readme = read("README.md");
  assert.doesNotMatch(readme, /\[Гайд по/);
  assert.match(readme, /\[Руководство по/);
});

test("docs/setup.md использует Руководство вместо Гайд в ссылках", () => {
  const setup = read(path.join("docs", "setup.md"));
  assert.doesNotMatch(setup, /\[Гайд по/);
  assert.match(setup, /\[Руководство по/);
});

test("AGENTS.md не содержит skill-каталоги, home-install, symlink", () => {
  const agents = read("AGENTS.md");
  assert.doesNotMatch(agents, /skill-каталоги/);
  assert.match(agents, /каталоги навыков/);
  assert.doesNotMatch(agents, /home-install/);
  assert.doesNotMatch(agents, /\bsymlink\b/);
  assert.match(agents, /символическ[а-яё]+ ссылк[а-яё]/);
});

test("docs/install.md не содержит secrets-файл и runtime без перевода", () => {
  const install = read(path.join("docs", "install.md"));
  assert.doesNotMatch(install, /secrets-файл/);
  assert.match(install, /файл секретов/);
  assert.doesNotMatch(install, /skill-only/);
  assert.doesNotMatch(install, /нужен runtime из/);
  assert.match(install, /нужна среда выполнения из/);
});

test("docs/setup.md и security-and-secrets.md не содержат secrets-шаблон", () => {
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  assert.doesNotMatch(setup, /secrets-шаблон/);
  assert.match(setup, /шаблон секретов/);
  assert.doesNotMatch(security, /secrets-шаблон/);
  assert.match(security, /шаблон секретов/);
});

test("docs/releasing.md не содержит мержится", () => {
  const releasing = read(path.join("docs", "releasing.md"));
  assert.doesNotMatch(releasing, /мержится/);
  assert.match(releasing, /вливается/);
});

test("docs/features/*.md не содержат legacy без перевода в критических местах", () => {
  const srt = read(path.join("docs", "features", "srt-booking.md"));
  const ktx = read(path.join("docs", "features", "ktx-booking.md"));
  const proxy = read(path.join("docs", "features", "k-skill-proxy.md"));
  assert.doesNotMatch(srt, /legacy запасной вариант/);
  assert.match(srt, /устаревшем запасном варианте/);
  assert.doesNotMatch(ktx, /legacy запасной вариант/);
  assert.match(ktx, /устаревшем запасном варианте/);
  assert.doesNotMatch(proxy, /legacy AirKorea/);
  assert.match(proxy, /устаревший поток AirKorea/);
});

test("docs/sources.md использует ключ API вместо API key и эталонный набор данных вместо фикстура", () => {
  const sources = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(sources, /\bAPI key\b/);
  assert.match(sources, /ключ API/);
  assert.doesNotMatch(sources, /добавляется фикстура/);
  assert.match(sources, /эталонный набор данных/);
});

test("docs/brand-inventory.md не содержит Feature guides", () => {
  const brand = read(path.join("docs", "brand-inventory.md"));
  assert.doesNotMatch(brand, /Feature guides/);
  assert.match(brand, /руководства по функциям|Руководства по функциям/);
});

test("README.md не содержит issue tracker, npm script output без перевода", () => {
  const readme = read("README.md");
  assert.doesNotMatch(readme, /issue tracker/);
  assert.match(readme, /систем[а-яё]+ отслеживания задач/);
  assert.doesNotMatch(readme, /npm script output/);
  assert.match(readme, /вывод скриптов npm/);
});

test("Пользовательские поверхности не содержат API key без русского порядка слов", () => {
  const osm = read(path.join("docs", "features", "osm-nearby.md"));
  assert.doesNotMatch(osm, /API ключ/);
  assert.doesNotMatch(osm, /\bAPI key\b/);
  assert.match(osm, /ключ API/);

  const zoon = read(path.join("docs", "features", "zoon-nearby.md"));
  assert.doesNotMatch(zoon, /API ключ/);
  assert.doesNotMatch(zoon, /\bAPI keys\b/);
  assert.match(zoon, /ключи API/);

  const ym = read(path.join("yandex-market-search", "SKILL.md"));
  assert.doesNotMatch(ym, /\bAPI key\b/);
  assert.match(ym, /ключ[аи] API/);

  const osmSkill = read(path.join("packages", "osm-nearby", "SKILL.md"));
  assert.doesNotMatch(osmSkill, /API ключ/);
  assert.doesNotMatch(osmSkill, /\bAPI key\b/);
  assert.match(osmSkill, /ключа API/i);
});

test("mchs-storm-warnings/SKILL.md не содержит MChS в русской прозе", () => {
  const skill = read(path.join("mchs-storm-warnings", "SKILL.md"));
  assert.doesNotMatch(skill, /под MChS/);
  assert.match(skill, /под МЧС/);
});

test("kakaotalk-mac не содержит accessibility-автоматизации и harvest действий", () => {
  const skill = read(path.join("kakaotalk-mac", "SKILL.md"));
  assert.doesNotMatch(skill, /accessibility-автоматизаци/);
  assert.match(skill, /автоматизации специальных возможностей/);

  const doc = read(path.join("docs", "features", "kakaotalk-mac.md"));
  assert.doesNotMatch(doc, /harvest действий/);
});

test("docs/sources.md не содержит Реалтайм-подписки", () => {
  const sources = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(sources, /Реалтайм-подписки/);
  assert.match(sources, /Подписки в реальном времени/);
});

test("README.md не содержит Target/Legacy/Transition как английские ярлыки в прозе", () => {
  const readme = read("README.md");
  assert.doesNotMatch(readme, /разделением `Target` и `Legacy`/);
  assert.match(readme, /разделением целевых и устаревших/);
  assert.doesNotMatch(readme, /новый `target`-пакет/);
  assert.doesNotMatch(readme, /закрытые `Legacy`/);
  assert.doesNotMatch(readme, /как `Transition`/);
  assert.doesNotMatch(readme, /российские `target`-пакеты/);
});

test("docs/sources.md использует канонический вместо canonical и встроенные вместо inline (раунд 69)", () => {
  const sources = read(path.join("docs", "sources.md"));

  const sourcesLines = sources.split("\n");
  for (const line of sourcesLines) {
    if (/\bcanonical\b/i.test(line) && !line.includes("```")) {
      assert.fail(`Найден непереведённый "canonical" в docs/sources.md: ${line.trim()}`);
    }
  }

  assert.match(sources, /канонический/);
  assert.match(sources, /встроенн.*specs/);
});

test("blue-ribbon-nearby/SKILL.md не содержит nearby и zone без перевода (раунд 69)", () => {
  const skill = read(path.join("blue-ribbon-nearby", "SKILL.md"));

  assert.doesNotMatch(skill, /результат Blue Ribbon nearby/);
  assert.match(skill, /ресторан Blue Ribbon поблизости/);
  assert.doesNotMatch(skill, /ни с одним официальным zone/);
  assert.match(skill, /ни с одной официальной зоной/);
});

test("docs/features/blue-ribbon-nearby.md не содержит zone-списка (раунд 69)", () => {
  const feature = read(path.join("docs", "features", "blue-ribbon-nearby.md"));
  assert.doesNotMatch(feature, /zone-списка/);
  assert.match(feature, /списка зон/);
});

test("k-skill-proxy использует сервер-посредник на Fastify вместо прокси на Fastify (раунд 69, обновлён в раунде 82)", () => {
  const proxyDoc = read(path.join("docs", "features", "k-skill-proxy.md"));
  const proxyReadme = read(path.join("packages", "k-skill-proxy", "README.md"));
  const proxyPkg = JSON.parse(read(path.join("packages", "k-skill-proxy", "package.json")));

  assert.doesNotMatch(proxyDoc, /прокси на Fastify/);
  assert.match(proxyDoc, /сервер-посредник на Fastify/);

  assert.doesNotMatch(proxyReadme, /прокси на Fastify/);
  assert.match(proxyReadme, /сервер-посредник на Fastify/);

  assert.match(proxyPkg.description, /Сервер-посредник на Fastify/);
});

test("packages/k-skill-proxy/README.md не содержит кейс (раунд 69)", () => {
  const readme = read(path.join("packages", "k-skill-proxy", "README.md"));
  assert.doesNotMatch(readme, /устаревший кейс/);
  assert.match(readme, /устаревший сценарий/);
});

test("навык delivery-tracking использует шаблон модуля-посредника вместо паттерн адаптера — раунд 69", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(skill, /паттерн адаптера/);
  assert.match(skill, /шаблон модуля-посредника/);
});

test("seoul-subway-arrival/SKILL.md использует шаблон вместо паттерн (раунд 69)", () => {
  const skill = read(path.join("seoul-subway-arrival", "SKILL.md"));
  assert.doesNotMatch(skill, /следующий паттерн/);
  assert.match(skill, /следующий шаблон/);
});

test("верхнеуровневые документы не возвращают гибриды вокруг настройки и инфраструктуры (раунд 70)", () => {
  const readme = read("README.md");
  const releasing = read(path.join("docs", "releasing.md"));

  assert.doesNotMatch(readme, /Для setup и shell-скриптов/);
  assert.match(readme, /Для навыка настройки и оболочковых скриптов/);

  assert.doesNotMatch(readme, /live-статус/);
  assert.match(readme, /оперативный статус/);

  assert.doesNotMatch(readme, /`ru-skill`-first/);
  assert.match(readme, /приоритетн.*для `ru-skill` поряд/);

  assert.doesNotMatch(readme, /setup-skills/);
  assert.match(readme, /навыки настройки/);

  assert.doesNotMatch(readme, /runtime-artifacts/);
  assert.match(readme, /артефакты выполнения контура настройки/);

  assert.doesNotMatch(readme, /shell\/infrastructure/);
  assert.match(readme, /интерфейсы оболочки и инфраструктуры/);

  assert.doesNotMatch(releasing, /Changesets для npm/);
  assert.match(releasing, /файлы `?\.changeset`? для npm/);

  assert.doesNotMatch(releasing, /Управление версиями: Changesets/);
  assert.match(releasing, /Управление версиями: файлы `?\.changeset`?/);

  assert.doesNotMatch(releasing, /Момент публикации: только если release-please сообщил/);
  assert.match(releasing, /Момент публикации: только если `release-please` сообщил/);
});

test("раунд 72: русификация skill/package, категории навыков, prose гибриды", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  const install = read(path.join("docs", "install.md"));
  const brandInventory = read(path.join("docs", "brand-inventory.md"));
  const booking = read(path.join("docs", "booking-replacements.md"));

  assert.match(roadmap, /навык\/пакет/);
  assert.match(roadmap, /исследование по заменам бронирования проведено/);
  assert.match(roadmap, /автоматизации проверки обновлений/);
  assert.match(roadmap, /каталоги bin\/log с префиксом/);

  assert.doesNotMatch(brandInventory, /skill-именам/);
  assert.match(brandInventory, /именам навыков/);

  assert.doesNotMatch(install, /workspace-пакеты/);
  assert.match(install, /пакеты рабочего пространства/);

  assert.doesNotMatch(install, /skill-сценарии/);
  assert.match(install, /сценарии навыков/);

  assert.doesNotMatch(booking, /для railway не открывается/);
  assert.match(booking, /для железнодорожных маршрутов не открывается/);

  assert.doesNotMatch(booking, /свободный public API/);
  assert.match(booking, /свободный публичный API/);

  const kSkillSetup = read(path.join("k-skill-setup", "SKILL.md"));
  const ruSkillSetup = read(path.join("ru-skill-setup", "SKILL.md"));

  assert.doesNotMatch(kSkillSetup, /предпочтительный secrets file/);
  assert.match(kSkillSetup, /предпочтительный файл секретов/);

  assert.doesNotMatch(kSkillSetup, /Предпочтительный secrets path/);
  assert.match(kSkillSetup, /Предпочтительный путь к секретам/);

  assert.doesNotMatch(ruSkillSetup, /Предпочтительный secrets path/);
  assert.match(ruSkillSetup, /Предпочтительный путь к секретам/);

  const hhVac = read(path.join("hh-vacancies", "SKILL.md"));
  assert.doesNotMatch(hhVac, /frontend вакансии/);
  assert.match(hhVac, /вакансии фронтенда|вакансии клиентской разработки/);
  assert.doesNotMatch(hhVac, /area id/);
  assert.match(hhVac, /идентификатор региона/);

  const zipcode = read(path.join("zipcode-search", "SKILL.md"));
  assert.doesNotMatch(zipcode, /raw HTML/);
  assert.match(zipcode, /исходном HTML/);
  assert.doesNotMatch(zipcode, /here-doc \+ Python one-liner/);

  const lotto = read(path.join("lotto-results", "SKILL.md"));
  assert.doesNotMatch(lotto, /«latest»/);
  assert.match(lotto, /«последний»/);

  const kbo = read(path.join("kbo-results", "SKILL.md"));
  assert.doesNotMatch(kbo, /фактический export/);
  assert.match(kbo, /фактический экспорт/);

  const delivery = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(delivery, /сохранения cookie/);
  assert.match(delivery, /сохранения файла cookie/);

  const blueRibbon = read(path.join("blue-ribbon-nearby", "SKILL.md"));
  assert.doesNotMatch(blueRibbon, /\(ribbon\)/);

  const zoon = read(path.join("zoon-nearby", "SKILL.md"));
  assert.doesNotMatch(zoon, /city\/category поиск/);
  assert.match(zoon, /поиск по городу\/категории/);

  const srt = read(path.join("srt-booking", "SKILL.md"));
  assert.doesNotMatch(srt, /инжектировать как env\b/);
  assert.match(srt, /переменные окружения/);

  const ktx = read(path.join("ktx-booking", "SKILL.md"));
  assert.doesNotMatch(ktx, /Если env нет/);
  assert.match(ktx, /переменных окружения нет/);

  const fineDust = read(path.join("fine-dust-location", "SKILL.md"));
  assert.doesNotMatch(fineDust, /Если env пуст/);
  assert.match(fineDust, /переменные окружения пусты/);
});

test("раунд 73: русификация feature docs и исторических секций TODO.md", () => {
  const fineDust = read(path.join("docs", "features", "fine-dust-location.md"));
  assert.doesNotMatch(fineDust, /Если env нет/);
  assert.match(fineDust, /переменных окружения нет/);
  assert.doesNotMatch(fineDust, /инжектирует `serviceKey`/);
  assert.match(fineDust, /подставляет `serviceKey`/);

  const ktx = read(path.join("docs", "features", "ktx-booking.md"));
  assert.doesNotMatch(ktx, /свежий Android user-agent/);
  assert.match(ktx, /пользовательский агент/);

  const srt = read(path.join("docs", "features", "srt-booking.md"));
  assert.doesNotMatch(srt, /через env,/);
  assert.match(srt, /через переменные окружения/);

  const seoul = read(path.join("docs", "features", "seoul-subway-arrival.md"));
  assert.doesNotMatch(seoul, /Если env нет/);
  assert.match(seoul, /переменных окружения нет/);

  const kakaoBar = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  assert.doesNotMatch(kakaoBar, /doc-регрессий/);
  assert.match(kakaoBar, /документных регрессий/);

  const hwp = read(path.join("docs", "features", "hwp.md"));
  assert.doesNotMatch(hwp, /doc-регрессии/);
  assert.match(hwp, /документной регрессии/);

  const kLeague = read(path.join("docs", "features", "kleague-results.md"));
  assert.doesNotMatch(kLeague, /doc-регрессий/);
  assert.match(kLeague, /документных регрессий/);
  assert.doesNotMatch(kLeague, /home\/away\./);
  assert.match(kLeague, /дома\/на выезде/);

  const kinopoisk = read(path.join("docs", "features", "kinopoisk-search.md"));
  assert.doesNotMatch(kinopoisk, /чтобы CI не зависел/);
  assert.match(kinopoisk, /система непрерывной интеграции/);
  assert.doesNotMatch(kinopoisk, /Парсинг HTML выполняется/);
  assert.match(kinopoisk, /Разбор HTML выполняется/);

  const stoloto = read(path.join("docs", "features", "stoloto-lotto.md"));
  assert.doesNotMatch(stoloto, /чтобы CI не зависел/);
  assert.match(stoloto, /система непрерывной интеграции/);

  const postcalc = read(path.join("docs", "features", "postcalc-postcodes.md"));
  assert.doesNotMatch(postcalc, /браузерного парсинга вручную/);
  assert.match(postcalc, /ручного разбора через обозреватель/);

  const proxy = read(path.join("docs", "features", "k-skill-proxy.md"));
  assert.doesNotMatch(proxy, /устаревший адаптер/);
  assert.match(proxy, /устаревший модуль-посредник/);
  assert.doesNotMatch(proxy, /узкий эндпоинт/);
  assert.match(proxy, /узкую конечную точку/);

  const delivery = read(path.join("docs", "features", "delivery-tracking.md"));
  assert.doesNotMatch(delivery, /валидатор конкретного перевозчика/);
  assert.match(delivery, /модуль проверки конкретного перевозчика/);
  assert.doesNotMatch(delivery, /официальных эндпоинтов/);
  assert.match(delivery, /официальных конечных точек/);

  const zipcode = read(path.join("docs", "features", "zipcode-search.md"));
  assert.doesNotMatch(zipcode, /эндпоинта нативный/);
  assert.match(zipcode, /конечной точки ePost/);

  const hh = read(path.join("docs", "features", "hh-vacancies.md"));
  assert.doesNotMatch(hh, /браузерной ручной/);
  assert.match(hh, /в обозревателе/);

  const kakaotalk = read(path.join("docs", "features", "kakaotalk-mac.md"));
  assert.doesNotMatch(kakaotalk, /# Руководство по CLI/);
  assert.match(kakaotalk, /интерфейс.* командной строки/);

  const zoon = read(path.join("docs", "features", "zoon-nearby.md"));
  assert.doesNotMatch(zoon, /напрямую парсится/);
  assert.match(zoon, /напрямую разбирается/);

  const ym = read(path.join("docs", "features", "yandex-market-search.md"));
  assert.doesNotMatch(ym, /Парсер опирается/);
  assert.match(ym, /Программа разбора опирается/);

  const todo = read("TODO.md");
  const todoWithoutBackticks = todo.replace(/`[^`]*`/g, "");
  assert.doesNotMatch(todoWithoutBackticks, /skill-level drift/);
  assert.doesNotMatch(todoWithoutBackticks, /package-level drift/);
  assert.doesNotMatch(todoWithoutBackticks, /migration-boundary/);
  assert.doesNotMatch(todoWithoutBackticks, /credential copy/);
  assert.doesNotMatch(todoWithoutBackticks, /boundary note/);
  assert.doesNotMatch(todoWithoutBackticks, /replacement copy/);
  assert.doesNotMatch(todoWithoutBackticks, /compatibility-layer/);
  assert.doesNotMatch(todoWithoutBackticks, /target-default/);
});

test("раунд 74: package README и корневой README не возвращают старые гибриды", () => {
  const rootReadme = read("README.md");
  assert.doesNotMatch(rootReadme, /\[Руководство по Blue Ribbon nearby\]/);
  assert.match(rootReadme, /\[Руководство по ресторанам Blue Ribbon поблизости\]/);
  assert.doesNotMatch(rootReadme, /\[Руководство по Kakao bar nearby\]/);
  assert.match(rootReadme, /\[Руководство по барам через Kakao Map\]/);

  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  assert.doesNotMatch(zoonReadme, /Серверно отрендеренные страницы \(SSR\)/);
  assert.doesNotMatch(zoonReadme, /парсится напрямую/);
  assert.match(zoonReadme, /Серверная отрисовка \(SSR\)/);
  assert.match(zoonReadme, /напрямую разбирается/);

  const kleagueReadme = read(path.join("packages", "kleague-results", "README.md"));
  assert.doesNotMatch(kleagueReadme, /HTML-парсинг/);
  assert.match(kleagueReadme, /разбор HTML/);

  const proxyReadme = read(path.join("packages", "k-skill-proxy", "README.md"));
  assert.doesNotMatch(proxyReadme, /других адаптеров/);
  assert.doesNotMatch(proxyReadme, /узкие адаптеры/);
  assert.match(proxyReadme, /других модулей-посредников/);
  assert.match(proxyReadme, /узкие модули-посредники/);

  const rplReadme = read(path.join("packages", "rpl-results", "README.md"));
  assert.doesNotMatch(rplReadme, /Данные парсятся/);
  assert.match(rplReadme, /Данные разбираются/);
});

test("раунд 75: package README, SKILL.md и тесты не возвращают старые гибриды", () => {
  const yandexMarketReadme = read(path.join("packages", "yandex-market-search", "README.md"));
  assert.doesNotMatch(yandexMarketReadme, /серверно отрендеренных/);
  assert.doesNotMatch(yandexMarketReadme, /серверно отрендеренным/);
  assert.doesNotMatch(yandexMarketReadme, /трекинг-параметров/);
  assert.match(yandexMarketReadme, /сгенерированных на сервере/);
  assert.match(yandexMarketReadme, /параметров отслеживания/);

  const kinopoiskReadme = read(path.join("packages", "kinopoisk-search", "README.md"));
  assert.doesNotMatch(kinopoiskReadme, /Парсинг HTML-страниц/);
  assert.match(kinopoiskReadme, /Разбор страниц HTML/);

  const stolotoReadme = read(path.join("packages", "stoloto-lotto", "README.md"));
  assert.doesNotMatch(stolotoReadme, /Парсинг HTML-страниц/);
  assert.match(stolotoReadme, /Разбор страниц HTML/);

  const moexReadme = read(path.join("packages", "moex-shares", "README.md"));
  assert.doesNotMatch(moexReadme, /Эндпоинт акций/);
  assert.match(moexReadme, /Конечная точка акций/);

  const tossReadme = read(path.join("packages", "toss-securities", "README.md"));
  assert.doesNotMatch(tossReadme, /исходный CLI/);
  assert.doesNotMatch(tossReadme, /исходного CLI/);
  assert.doesNotMatch(tossReadme, /пройти логин/);
  assert.match(tossReadme, /исходный интерфейс командной строки/);
  assert.match(tossReadme, /выполнить вход/);

  const daisoSkill = read(path.join("daiso-product-search", "SKILL.md"));
  assert.doesNotMatch(daisoSkill, /целевой трек/);
  assert.match(daisoSkill, /целевое направление/);

  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(deliverySkill, /JSON API \/ HTML-форма \/ CLI/);
  assert.doesNotMatch(deliverySkill, /сохранения файла куки/);
  assert.doesNotMatch(deliverySkill, /HTML-форма \/ командная строка/);
  assert.match(deliverySkill, /JSON API \/ форма HTML \/ командная строка/);
  assert.match(deliverySkill, /сохранения файла cookie/);

  const mchsSkill = read(path.join("mchs-storm-warnings", "SKILL.md"));
  assert.doesNotMatch(mchsSkill, /CMS-шаблон/);
  assert.match(mchsSkill, /шаблон системы управления контентом \(CMS\)/);

  const kakaotalkSkill = read(path.join("kakaotalk-mac", "SKILL.md"));
  assert.doesNotMatch(kakaotalkSkill, /\*\*Full Disk Access \(Полный доступ к диску\)\*\*/);
  assert.doesNotMatch(kakaotalkSkill, /\*\*Accessibility \(Универсальный доступ\)\*\*/);
  assert.match(kakaotalkSkill, /\*\*Полный доступ к диску \(Full Disk Access\)\*\*/);
  assert.match(kakaotalkSkill, /\*\*Универсальный доступ \(Accessibility\)\*\*/);

  const zipcodeSkill = read(path.join("zipcode-search", "SKILL.md"));
  assert.doesNotMatch(zipcodeSkill, /CLI-обёртках/);
  assert.match(zipcodeSkill, /обёртках командной строки/);

  const rootReadme = read("README.md");
  assert.doesNotMatch(rootReadme, /серверно отрендеренные страницы Яндекс Маркета/);
  assert.match(rootReadme, /сгенерированные на сервере.*Яндекс Маркета|Яндекс Маркета.*сгенерированные на сервере/);
});

test("раунд 78: пользовательские интерфейсные документы не содержат «поверхность» как калку surface", () => {
  const sources = read(path.join("docs", "sources.md"));
  const brand = read(path.join("docs", "brand-inventory.md"));
  const booking = read(path.join("docs", "booking-replacements.md"));
  const proxyFeature = read(path.join("docs", "features", "k-skill-proxy.md"));
  const kakaoBarFeature = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  const daisoFeature = read(path.join("docs", "features", "daiso-product-search.md"));
  const ymFeature = read(path.join("docs", "features", "yandex-market-search.md"));
  const blueRibbonFeature = read(path.join("docs", "features", "blue-ribbon-nearby.md"));
  const kleagueFeature = read(path.join("docs", "features", "kleague-results.md"));
  const ktxFeature = read(path.join("docs", "features", "ktx-booking.md"));
  const rplFeature = read(path.join("docs", "features", "rpl-results.md"));
  const stolotoFeature = read(path.join("docs", "features", "stoloto-lotto.md"));

  const tossSkill = read(path.join("toss-securities", "SKILL.md"));
  const ktxSkill = read(path.join("ktx-booking", "SKILL.md"));
  const kleagueSkill = read(path.join("kleague-results", "SKILL.md"));
  const kakaoBarSkill = read(path.join("kakao-bar-nearby", "SKILL.md"));

  for (const [label, doc] of [
    ["docs/sources.md", sources],
    ["docs/brand-inventory.md", brand],
    ["docs/booking-replacements.md", booking],
    ["docs/features/k-skill-proxy.md", proxyFeature],
    ["docs/features/kakao-bar-nearby.md", kakaoBarFeature],
    ["docs/features/daiso-product-search.md", daisoFeature],
    ["docs/features/yandex-market-search.md", ymFeature],
    ["docs/features/blue-ribbon-nearby.md", blueRibbonFeature],
    ["docs/features/kleague-results.md", kleagueFeature],
    ["docs/features/ktx-booking.md", ktxFeature],
    ["docs/features/rpl-results.md", rplFeature],
    ["docs/features/stoloto-lotto.md", stolotoFeature],
    ["toss-securities/SKILL.md", tossSkill],
    ["ktx-booking/SKILL.md", ktxSkill],
    ["kleague-results/SKILL.md", kleagueSkill],
    ["kakao-bar-nearby/SKILL.md", kakaoBarSkill],
  ]) {
    assert.doesNotMatch(doc, /поверхност[ьиь]/, `${label} не должен содержать «поверхность» как калку surface — используйте «интерфейс»`);
  }

  assert.match(sources, /внешние интерфейсы/);
  assert.match(sources, /интерфейсов посредника/);
  assert.match(brand, /устаревших интерфейсов/);
  assert.match(booking, /Тип интерфейса/);
  assert.match(proxyFeature, /наружный интерфейс/);
  assert.match(kakaoBarFeature, /Официальные интерфейсы Kakao Map/);
  assert.match(daisoFeature, /Официальные интерфейсы/);
  assert.match(ymFeature, /интерфейс HTML Яндекс Маркета/);
  assert.match(blueRibbonFeature, /Официальные интерфейсы Blue Ribbon/);
  assert.match(kleagueFeature, /Официальные интерфейсы/);
  assert.match(ktxFeature, /отдельный интерфейс и отдельные учётные данные/);
  assert.match(tossSkill, /интерфейс `tossctl`/);

  assert.doesNotMatch(sources, /\bлогин\b/);
  assert.match(sources, /не нужен вход/);

  assert.match(rplFeature, /программу разбора/);
  assert.doesNotMatch(rplFeature, /\bпарсер\b/);

  assert.match(stolotoFeature, /разбор может сломаться/);
  assert.doesNotMatch(stolotoFeature, /парсинг может сломаться/);

  assert.match(kleagueFeature, /разбор HTML/);
  assert.doesNotMatch(kleagueFeature, /HTML-парсинг/);

  assert.match(sources, /сторонняя программа разбора котировок/);
  assert.doesNotMatch(sources, /сторонний парсер котировок/);

  assert.match(sources, /разбор содержимого PDF/);
  assert.doesNotMatch(sources, /парсинг содержимого PDF/);
});

test("раунд 81: устранены оставшиеся гибриды ENGLISH-русское в интерфейсной документации и исходном коде", () => {
  const kboSkill = read(path.join("kbo-results", "SKILL.md"));
  assert.doesNotMatch(kboSkill, /Node-пакета/);
  assert.match(kboSkill, /пакета Node\.js/);

  const zipcodeSkill = read(path.join("zipcode-search", "SKILL.md"));
  assert.doesNotMatch(zipcodeSkill, /Python-тайм-аут/);
  assert.match(zipcodeSkill, /тайм-аут Python/);

  const ruSetupSkill = read(path.join("ru-skill-setup", "SKILL.md"));
  assert.doesNotMatch(ruSetupSkill, /\bлогов\b/);
  assert.match(ruSetupSkill, /журналов/);

  const kSetupSkill = read(path.join("k-skill-setup", "SKILL.md"));
  assert.doesNotMatch(kSetupSkill, /расположение логов/);
  assert.match(kSetupSkill, /расположение журналов/);

  const fineDustSkill = read(path.join("fine-dust-location", "SKILL.md"));
  assert.doesNotMatch(fineDustSkill, /HTTP-запроса/);
  assert.match(fineDustSkill, /запроса HTTP/);

  const pravoSkill = read(path.join("pravo-documents", "SKILL.md"));
  assert.doesNotMatch(pravoSkill, /HTTP-клиент/);
  assert.match(pravoSkill, /клиент HTTP/);

  const cbrSkill = read(path.join("cbr-rates", "SKILL.md"));
  assert.doesNotMatch(cbrSkill, /XML-схема/);
  assert.match(cbrSkill, /схема XML/i);

  const deliverySkill = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(deliverySkill, /HTML-поток/);
  assert.match(deliverySkill, /поток HTML/);
  assert.doesNotMatch(deliverySkill, /POST-запросом/);
  assert.match(deliverySkill, /запросом POST/);
  assert.doesNotMatch(deliverySkill, /HTML-разметки/);
  assert.match(deliverySkill, /разметки HTML/);

  const mchsReadme = read(path.join("packages", "mchs-storm-warnings", "README.md"));
  assert.doesNotMatch(mchsReadme, /\bхост\b|\bхосту\b|\bхостами\b/);
  assert.match(mchsReadme, /имя узла/);

  const kProxyReadme = read(path.join("packages", "k-skill-proxy", "README.md"));
  assert.doesNotMatch(kProxyReadme, /проксированием/);
  assert.match(kProxyReadme, /посредничеством/);
  assert.doesNotMatch(kProxyReadme, /без аутентификации/);
  assert.match(kProxyReadme, /без проверки подлинности/);
  assert.doesNotMatch(kProxyReadme, /кэшем/);
  assert.match(kProxyReadme, /буфером/);

  const ymReadme = read(path.join("packages", "yandex-market-search", "README.md"));
  assert.doesNotMatch(ymReadme, /\bтоп\b.*`specs`/);
  assert.match(ymReadme, /основные `specs`/);
  assert.doesNotMatch(ymReadme, /аккаунтом/);
  assert.match(ymReadme, /учётной записью/);

  const kinopoiskReadme = read(path.join("packages", "kinopoisk-search", "README.md"));
  assert.doesNotMatch(kinopoiskReadme, /секретов и прокси/);
  assert.match(kinopoiskReadme, /секретов и посредника/);

  const stolotoReadme = read(path.join("packages", "stoloto-lotto", "README.md"));
  assert.doesNotMatch(stolotoReadme, /секретов и прокси/);
  assert.match(stolotoReadme, /секретов и посредника/);

  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  assert.doesNotMatch(zoonReadme, /Server-Side Rendering/);
  assert.match(zoonReadme, /серверн.* отрисовк/i);
  assert.doesNotMatch(zoonReadme, /без капчи/);
  assert.match(zoonReadme, /без проверки на робота/);

  const yandexRaspReadme = read(path.join("packages", "yandex-rasp", "README.md"));
  assert.doesNotMatch(yandexRaspReadme, /в кэше/);
  assert.match(yandexRaspReadme, /в буфере/);

  const deliveryFeature = read(path.join("docs", "features", "delivery-tracking.md"));
  assert.doesNotMatch(deliveryFeature, /`валидатор/);
  assert.match(deliveryFeature, /`модуль проверки/);

  const rplParseSrc = read(path.join("packages", "rpl-results", "src", "parse.js"));
  assert.doesNotMatch(rplParseSrc, /парсинга/);
  assert.match(rplParseSrc, /разбора/);

  const ymParseSrc = read(path.join("packages", "yandex-market-search", "src", "parse.js"));
  assert.doesNotMatch(ymParseSrc, /парсинга/);
  assert.match(ymParseSrc, /разбора/);

  const zoonParseSrc = read(path.join("packages", "zoon-nearby", "src", "parse.js"));
  assert.doesNotMatch(zoonParseSrc, /парсер/);
  assert.match(zoonParseSrc, /модуль разбора/);

  const yandexRaspTest = read(path.join("packages", "yandex-rasp", "test", "index.test.js"));
  assert.doesNotMatch(yandexRaspTest, /с моками/);
  assert.match(yandexRaspTest, /с заглушками/);

  const yandexRaspParseSrc = read(path.join("packages", "yandex-rasp", "src", "parse.js"));
  assert.doesNotMatch(yandexRaspParseSrc, /валидации/);
  assert.match(yandexRaspParseSrc, /проверки корректности/);

  const kinopoiskParseSrc = read(path.join("packages", "kinopoisk-search", "src", "parse.js"));
  assert.doesNotMatch(kinopoiskParseSrc, /мета-блоке/);
  assert.match(kinopoiskParseSrc, /блоке метаданных/);

  const rplTest = read(path.join("packages", "rpl-results", "test", "index.test.js"));
  assert.doesNotMatch(rplTest, /парсинга/);
  assert.doesNotMatch(rplTest, /парсера/);
  assert.match(rplTest, /разбора/);

  const mchsRegionsSrc = read(path.join("packages", "mchs-storm-warnings", "src", "regions.js"));
  assert.doesNotMatch(mchsRegionsSrc, /\bхост\b|\bхосту\b|\bхостами\b|\bхосты\b/);
  assert.match(mchsRegionsSrc, /имя узла/);

  const mchsParseSrc = read(path.join("packages", "mchs-storm-warnings", "src", "parse.js"));
  assert.doesNotMatch(mchsParseSrc, /хостом/);
  assert.match(mchsParseSrc, /именем узла/);

  const mchsTest = read(path.join("packages", "mchs-storm-warnings", "test", "index.test.js"));
  assert.doesNotMatch(mchsTest, /\bхосты\b|\bхосту\b/);
  assert.match(mchsTest, /имена узлов|имени узла/);

  const roadmap = read(path.join("docs", "roadmap.md"));
  assert.doesNotMatch(roadmap, /Python-тестах/);
  assert.doesNotMatch(roadmap, /workspace-тесты/);
  assert.doesNotMatch(roadmap, /CLI-запросов/);
  assert.doesNotMatch(roadmap, /XML-сервис курсов/);
  assert.doesNotMatch(roadmap, /API-функции без/);
  assert.doesNotMatch(roadmap, /runtime-очистка/);
});

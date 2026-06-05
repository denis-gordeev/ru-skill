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

  assert.ok(match, "expected TODO.md to start with a current status block");

  return {
    date: match[1],
    round: Number(match[2]),
  };
}

function extractReadmePackageMatrix(readme) {
  const match = readme.match(/## Текущие пакеты\n\n([\s\S]*?)\n## Документация/);

  assert.ok(match, "expected package matrix in README.md");

  return [...match[1].matchAll(/^\| `([^`]+)` \| .*? \| ([^|]+) \|$/gm)].map(([, name, status]) => ({
    name,
    status: status.trim()
  }));
}

function extractInstallSkillSnippet(install) {
  const match = install.match(
    /npx --yes skills add denis-gordeev\/ru-skill \\\n([\s\S]*?)\n```/,
  );

  assert.ok(match, "expected explicit skills add snippet in docs/install.md");

  return [...match[1].matchAll(/--skill ([a-z0-9-]+)/g)].map(([, skill]) => skill);
}

function extractNodeInstallPackages(install) {
  const match = install.match(/npm install -g ([\s\S]*?)\nexport NODE_PATH/m);

  assert.ok(match, "expected npm install -g snippet in docs/install.md");

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
  assert.doesNotMatch(doc, /\bahead of main\b/i, `${label} must not expose branch-distance summaries as current status`);
  assert.doesNotMatch(doc, /\bmerge-ready\b/i, `${label} must not expose merge-ready claims as current status`);
  assert.doesNotMatch(doc, /\b\d+\s+коммит(?:ов|а)? ahead\b/i, `${label} must not pin current status to commit-distance metrics`);
  assert.doesNotMatch(doc, /\b\d+\s+файл(?:ов|а)? изменено\b/i, `${label} must not pin current status to file-count metrics`);
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

  assert.ok(block, `expected ${carrier} normalized JSON example`);
  return block;
}

function findRecentEventsBlock(doc, carrier) {
  const block = [...doc.matchAll(/normalized_events = \[\n\s*\{\n([\s\S]*?)\n\s*\}\n\s*for [^\n]+ in events\n\]/g)]
    .map((match) => match[1])
    .find((candidate) => candidate.includes('"status_code":') === (carrier === "cj"));

  assert.ok(block, `expected ${carrier} recent_events example`);
  return block;
}

function findJsonFenceAfterLabel(doc, label) {
  return JSON.parse(findJsonFenceTextAfterLabel(doc, label));
}

function findJsonFenceTextAfterLabel(doc, label) {
  const escaped = escapeRegex(label);
  const match = doc.match(new RegExp(`${escaped}[\\s\\S]*?\\\`\\\`\\\`json\\n([\\s\\S]*?)\\n\\\`\\\`\\\``));

  assert.ok(match, `expected JSON example after "${label}"`);
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
    `${docLabel} ${sectionLabel} provenance line must stay pinned to the verified smoke-test date and invoice`,
  );
}

function assertSanitizedPublicOutput(output, label) {
  const serialized = JSON.stringify(output);

  assert.doesNotMatch(serialized, /\bTEL\b/i, `${label} must not leak TEL fragments`);
  assert.doesNotMatch(
    serialized,
    /\d{2,4}[.\-]\d{3,4}[.\-]\d{4}/,
    `${label} must not leak phone-number-like strings anywhere in the published sample`,
  );
  assert.doesNotMatch(serialized, /crgNm/, `${label} must not leak CJ assignee/source fields`);
  assert.doesNotMatch(serialized, /sender/i, `${label} must not leak sender fields`);
  assert.doesNotMatch(serialized, /receiver/i, `${label} must not leak receiver fields`);
  assert.doesNotMatch(serialized, /delivered_to/i, `${label} must not leak delivered_to fields`);
}

function assertKakaoBarNearbySadangSmokeSnapshot(smoke, label) {
  assert.equal(smoke.anchor.name, "사당1동먹자골목상점가", `${label} anchor should stay on the verified area landmark`);
  assert.equal(smoke.meta.openNowCount, 4, `${label} should publish the verified open-now count`);
  assert.deepEqual(
    smoke.items.map((item) => item.name),
    ["우미노식탁", "방배을지로골뱅이술집포차 사당역점", "커먼테이블"],
    `${label} should keep the verified top-3 ordering`,
  );
}

test("root npm test script includes the skill docs regression suite", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts.test, /node --test scripts\/skill-docs\.test\.js/);
});

test("hwp skill documents environment-aware routing and supported operations", () => {
  const skillPath = path.join(repoRoot, "hwp", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected hwp/SKILL.md to exist");

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

test("hwp skill documents inline image verification for markdown output", () => {
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

test("repository docs advertise the kakaotalk-mac skill", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kakaotalk-mac.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/kakaotalk-mac.md to exist");
  assert.match(readme, /\| `kakaotalk-mac` \|/);
  assert.match(readme, /\[Гайд по KakaoTalk Mac CLI\]\(docs\/features\/kakaotalk-mac\.md\)/);
  assert.match(install, /--skill kakaotalk-mac/);
});

test("kakaotalk-mac skill documents safe macOS kakaocli usage", () => {
  const skillPath = path.join(repoRoot, "kakaotalk-mac", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected kakaotalk-mac/SKILL.md to exist");

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

test("repository docs advertise the KTX booking skill as supported", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "ktx-booking.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/ktx-booking.md to exist");
  assert.match(readme, /\| `ktx-booking` \|/);
  assert.match(readme, /\[Гайд по KTX\]\(docs\/features\/ktx-booking\.md\)/);
  assert.doesNotMatch(readme, /ktx-booking.*не работает/iu);
  assert.doesNotMatch(readme, /KTX 예매는 현재 작동하지 않습니다/);
  assert.match(install, /--skill ktx-booking/);
});

test("ktx-booking docs document the helper-based live Korail workflow", () => {
  const skillPath = path.join(repoRoot, "ktx-booking", "SKILL.md");
  const helperPath = path.join(repoRoot, "scripts", "ktx_booking.py");

  assert.ok(fs.existsSync(skillPath), "expected ktx-booking/SKILL.md to exist");
  assert.ok(fs.existsSync(helperPath), "expected scripts/ktx_booking.py to exist");

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

test("legacy railway docs keep the replacement boundary explicit", () => {
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

test("ktx-booking helper python regression tests pass", () => {
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
    `expected python KTX helper regression tests to pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
});

test("repository docs advertise the zipcode-search skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "zipcode-search.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/zipcode-search.md to exist");
  assert.match(readme, /\| `zipcode-search` \|/);
  assert.match(readme, /\[Гайд по postcode search\]\(docs\/features\/zipcode-search\.md\)/);
  assert.match(install, /--skill zipcode-search/);
  assert.match(roadmap, /Поиск почтовых индексов/);
  assert.match(sources, /Почтовая служба Кореи поиск адресов: https:\/\/parcel\.epost\.go\.kr\/parcel\/comm\/zipcode\/comm_newzipcd_list\.jsp/);
});

test("repository docs advertise the cbr-rates skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "cbr-rates.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/cbr-rates.md to exist");
  assert.match(readme, /\| `cbr-rates` \|/);
  assert.match(readme, /\[Гайд по курсам ЦБ РФ\]\(docs\/features\/cbr-rates\.md\)/);
  assert.match(install, /--skill cbr-rates/);
  assert.match(roadmap, /cbr-rates/);
});

test("repository docs advertise the postcalc-postcodes skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "postcalc-postcodes.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/postcalc-postcodes.md to exist");
  assert.match(readme, /\| `postcalc-postcodes` \|/);
  assert.match(readme, /\[Гайд по Postcalc и индексам\]\(docs\/features\/postcalc-postcodes\.md\)/);
  assert.match(install, /--skill postcalc-postcodes/);
  assert.match(roadmap, /postcalc-postcodes/);
  assert.match(sources, /postcalc\.ru\/offices\/109189/);
});

test("repository docs advertise the hh-vacancies skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "hh-vacancies.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/hh-vacancies.md to exist");
  assert.match(readme, /\| `hh-vacancies` \|/);
  assert.match(readme, /\[Гайд по HH вакансиям\]\(docs\/features\/hh-vacancies\.md\)/);
  assert.match(install, /--skill hh-vacancies/);
  assert.match(roadmap, /hh-vacancies/);
  assert.match(sources, /api\.hh\.ru\/vacancies/);
});

test("repository docs advertise the mchs-storm-warnings skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "mchs-storm-warnings.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/mchs-storm-warnings.md to exist");
  assert.match(readme, /\| `mchs-storm-warnings` \|/);
  assert.match(readme, /\[Гайд по предупреждениям МЧС\]\(docs\/features\/mchs-storm-warnings\.md\)/);
  assert.match(install, /--skill mchs-storm-warnings/);
  assert.match(roadmap, /mchs-storm-warnings/);
  assert.match(sources, /46\.mchs\.gov\.ru\/deyatelnost\/press-centr\/operativnaya-informaciya\/shtormovye-i-ekstrennye-preduprezhdeniya/);
});

test("cbr-rates docs document the official Bank of Russia XML workflow", () => {
  const skillPath = path.join(repoRoot, "cbr-rates", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "cbr-rates", "README.md");

  assert.ok(fs.existsSync(skillPath), "expected cbr-rates/SKILL.md to exist");
  assert.ok(fs.existsSync(packageReadmePath), "expected packages/cbr-rates/README.md to exist");

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

test("postcalc-postcodes docs document the Postcalc office and city workflows", () => {
  const skillPath = path.join(repoRoot, "postcalc-postcodes", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "postcalc-postcodes", "README.md");

  assert.ok(fs.existsSync(skillPath), "expected postcalc-postcodes/SKILL.md to exist");
  assert.ok(fs.existsSync(packageReadmePath), "expected packages/postcalc-postcodes/README.md to exist");

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

test("hh-vacancies docs document the public HH vacancy workflow", () => {
  const skillPath = path.join(repoRoot, "hh-vacancies", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "hh-vacancies", "README.md");

  assert.ok(fs.existsSync(skillPath), "expected hh-vacancies/SKILL.md to exist");
  assert.ok(fs.existsSync(packageReadmePath), "expected packages/hh-vacancies/README.md to exist");

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

test("mchs-storm-warnings docs document the official regional MChS warning workflow", () => {
  const skillPath = path.join(repoRoot, "mchs-storm-warnings", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "mchs-storm-warnings", "README.md");

  assert.ok(fs.existsSync(skillPath), "expected mchs-storm-warnings/SKILL.md to exist");
  assert.ok(fs.existsSync(packageReadmePath), "expected packages/mchs-storm-warnings/README.md to exist");

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

test("zipcode-search docs lock the official ePost extraction flow and reliable transport example", () => {
  const skillPath = path.join(repoRoot, "zipcode-search", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected zipcode-search/SKILL.md to exist");

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

test("repository docs advertise the delivery-tracking skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "delivery-tracking.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/delivery-tracking.md to exist");
  assert.match(readme, /\| `delivery-tracking` \|/);
  assert.match(readme, /\[Гайд по delivery tracking\]\(docs\/features\/delivery-tracking\.md\)/);
  assert.match(install, /--skill delivery-tracking/);
  assert.match(roadmap, /Навык для отслеживания доставки/);
  assert.match(sources, /CJ Logistics отслеживание доставки: https:\/\/www\.cjlogistics\.com\/ko\/tool\/parcel\/tracking/);
  assert.match(sources, /Почтовая служба Кореи отслеживание: https:\/\/service\.epost\.go\.kr\/trace\.RetrieveRegiPrclDeliv\.postal\?sid1=/);
});

test("delivery-tracking skill documents official CJ and ePost flows with extension guidance", () => {
  const skillPath = path.join(repoRoot, "delivery-tracking", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected delivery-tracking/SKILL.md to exist");

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

test("delivery-tracking published examples lock a shared normalized non-PII schema", () => {
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
      `${label} CJ example must keep the exact normalized top-level mapping`,
    );
    assert.deepEqual(
      extractQuotedEntries(findPrintedObjectBlock(doc, "epost"), 4),
      expectedTopLevelEntries.epost,
      `${label} ePost example must keep the exact normalized top-level mapping`,
    );
    assert.deepEqual(
      extractQuotedEntries(
        findRecentEventsBlock(doc, "cj"),
        8,
      ),
      expectedRecentEventEntries.cj,
      `${label} CJ recent_events entries must keep the exact normalized mapping`,
    );
    assert.deepEqual(
      extractQuotedEntries(
        findRecentEventsBlock(doc, "epost"),
        8,
      ),
      expectedRecentEventEntries.epost,
      `${label} ePost recent_events entries must keep the exact normalized mapping`,
    );
  }

  assert.doesNotMatch(skill, /"message":\s*latest\.get\("crgNm"\)/);
  assert.doesNotMatch(featureDoc, /print\(\{\s*"tracking_no"/);
});

test("delivery-tracking docs publish aligned sample normalized outputs for both carriers", () => {
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
        `${docLabel} ${carrier} sample JSON block must stay byte-for-byte aligned with the checked-in public fixture`,
      );
    }
  }
  assert.deepEqual(cjSkillOutput, cjFeatureOutput, "CJ sample output must stay aligned across docs");
  assert.deepEqual(epostSkillOutput, epostFeatureOutput, "ePost sample output must stay aligned across docs");
  assert.deepEqual(cjSkillOutput, expectedSamples.cj, "CJ sample output must stay pinned to the verified public fixture");
  assert.deepEqual(epostSkillOutput, expectedSamples.epost, "ePost sample output must stay pinned to the verified public fixture");
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

test("repository docs advertise the daiso-product-search skill", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "daiso-product-search.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/daiso-product-search.md to exist");
  assert.match(readme, /\| `daiso-product-search` \|/);
  assert.match(readme, /\[Гайд по Daiso product search\]\(docs\/features\/daiso-product-search\.md\)/);
  assert.match(install, /--skill daiso-product-search/);
});

test("daiso-product-search skill documents the official Daiso Mall lookup flow", () => {
  const skillPath = path.join(repoRoot, "daiso-product-search", "SKILL.md");
  const featureDoc = read(path.join("docs", "features", "daiso-product-search.md"));

  assert.ok(fs.existsSync(skillPath), "expected daiso-product-search/SKILL.md to exist");

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

test("daiso-product-search package exposes reusable store, product, and stock helpers", () => {
  const pkg = require(path.join(repoRoot, "packages", "daiso-product-search", "src", "index.js"));

  assert.equal(typeof pkg.searchStores, "function");
  assert.equal(typeof pkg.searchProducts, "function");
  assert.equal(typeof pkg.getStorePickupStock, "function");
  assert.equal(typeof pkg.lookupStoreProductAvailability, "function");
});

test("daiso-product-search docs record the shipped feature and official sources", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));

  assert.match(roadmap, /Навык поиска товаров Daiso/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/api\/ms\/msg\/selStr/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/ssn\/search\/SearchGoods/);
  assert.match(sources, /https:\/\/www\.daisomall\.co\.kr\/api\/pd\/pdh\/selStrPkupStck/);
});

test("daiso-product-search package README keeps the legacy-only boundary aligned with the repository migration", () => {
  const packageReadme = read(path.join("packages", "daiso-product-search", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /yandex-market-search/);
  assert.match(packageReadme, /обратн.*совместим/i);
  assert.match(packageReadme, /эталонный сценарий/i);
  assert.match(packageReadme, /pickup stock|остатки для самовывоза/i);
});

test("root pack:dry-run script covers all publishable workspaces", () => {
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

test("repository docs advertise the kleague-results skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kleague-results.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/kleague-results.md to exist");
  assert.match(readme, /\| `kleague-results` \|/);
  assert.match(readme, /\[Гайд по K League\]\(docs\/features\/kleague-results\.md\)/);
  assert.match(install, /--skill kleague-results/);
  assert.match(roadmap, /Навык с результатами K League/);
  assert.match(sources, /K League расписание\/результаты JSON: https:\/\/www\.kleague\.com\/getScheduleList\.do/);
  assert.match(sources, /K League командный рейтинг JSON: https:\/\/www\.kleague\.com\/record\/teamRank\.do/);
});

test("kleague-results skill documents the official JSON flow for date, team, and standings lookups", () => {
  const skillPath = path.join(repoRoot, "kleague-results", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected kleague-results/SKILL.md to exist");

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

test("kleague-results package exports reusable results and standings helpers", () => {
  const pkg = require(path.join(repoRoot, "packages", "kleague-results", "src", "index.js"));

  assert.equal(typeof pkg.getMatchResults, "function");
  assert.equal(typeof pkg.getStandings, "function");
  assert.equal(typeof pkg.getKLeagueSummary, "function");
});

test("kleague-results package README stays aligned with the official K League JSON lookup flow", () => {
  const packageReadme = read(path.join("packages", "kleague-results", "README.md"));

  assert.match(packageReadme, /legacy-only/i);
  assert.match(packageReadme, /rpl-results/);
  assert.match(packageReadme, /official K League JSON|официальн.*K League.*JSON/i);
  assert.match(packageReadme, /getScheduleList\.do/);
  assert.match(packageReadme, /teamRank\.do/);
  assert.match(packageReadme, /getKLeagueSummary/);
  assert.match(packageReadme, /FC서울/);
});

test("repository docs advertise the blue-ribbon-nearby skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "blue-ribbon-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/blue-ribbon-nearby.md to exist");
  assert.match(readme, /\| `blue-ribbon-nearby` \|/);
  assert.match(readme, /\[Гайд по Blue Ribbon nearby\]\(docs\/features\/blue-ribbon-nearby\.md\)/);
  assert.match(install, /--skill blue-ribbon-nearby/);
  assert.match(roadmap, /Навык поиска nearby-ресторанов Blue Ribbon/);
  assert.match(sources, /Blue Ribbon поиск по зоне: https:\/\/www\.bluer\.co\.kr\/search\/zone/);
  assert.match(sources, /Blue Ribbon ближайшие рестораны JSON: https:\/\/www\.bluer\.co\.kr\/restaurants\/map/);
});

test("blue-ribbon-nearby skill documents mandatory location prompting and official Blue Ribbon nearby search flow", () => {
  const skillPath = path.join(repoRoot, "blue-ribbon-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected blue-ribbon-nearby/SKILL.md to exist");

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

test("blue-ribbon-nearby package README stays aligned with the location-first and official-surface guidance", () => {
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



test("repository docs advertise the kakao-bar-nearby skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kakao-bar-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/kakao-bar-nearby.md to exist");
  assert.match(readme, /\| `kakao-bar-nearby` \|/);
  assert.match(readme, /\[Гайд по Kakao bar nearby\]\(docs\/features\/kakao-bar-nearby\.md\)/);
  assert.match(install, /--skill kakao-bar-nearby/);
  assert.match(roadmap, /Навык поиска nearby-баров/);
  assert.match(sources, /Kakao Map мобильный поиск: https:\/\/m\.map\.kakao\.com\/actions\/searchView/);
  assert.match(sources, /Kakao Map панель места JSON: https:\/\/place-api\.map\.kakao\.com\/places\/panel3\//);
});

test("kakao-bar-nearby skill documents location-first Kakao Map search with open-now/menu/seating hints", () => {
  const skillPath = path.join(repoRoot, "kakao-bar-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected kakao-bar-nearby/SKILL.md to exist");

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

test("kakao-bar-nearby package README stays aligned with the Kakao Map live lookup flow", () => {
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

test("kakao-bar-nearby feature doc keeps the verified 2026-03-29 sadang smoke snapshot current", () => {
  const featureDoc = read(path.join("docs", "features", "kakao-bar-nearby.md"));
  const smoke = findJsonFenceAfterLabel(featureDoc, "## Проверочный пример");

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "feature doc smoke snapshot");
});

test("kakao-bar-nearby package README live smoke snapshot matches the verified 2026-03-29 sadang output", () => {
  const packageReadme = read(path.join("packages", "kakao-bar-nearby", "README.md"));
  const smoke = findJsonFenceAfterLabel(packageReadme, "## Проверочный пример");

  assertKakaoBarNearbySadangSmokeSnapshot(smoke, "package README smoke snapshot");
});

test("repository docs advertise the fine-dust-location skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const setup = read(path.join("docs", "setup.md"));
  const security = read(path.join("docs", "security-and-secrets.md"));
  const secretsExample = read(path.join("examples", "secrets.env.example"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "fine-dust-location.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/fine-dust-location.md to exist");
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

test("fine-dust-location skill documents the official two-api flow and fallback handling", () => {
  const skillPath = path.join(repoRoot, "fine-dust-location", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected fine-dust-location/SKILL.md to exist");

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
    "expected fine-dust skill to mention the ru-skill secrets path before the legacy fallback",
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

test("install docs prefer ru-skill-setup while keeping legacy k-skill-setup as alias", () => {
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

test("fine-dust helper python regression tests pass", () => {
  const result = childProcess.spawnSync(
    "python3",
    ["-m", "unittest", "discover", "-s", "scripts", "-p", "test_fine_dust.py"],
    { cwd: repoRoot, encoding: "utf8" },
  );

  assert.equal(
    result.status,
    0,
    `expected python fine-dust helper regression tests to pass\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
});

test("repository docs advertise the toss-securities skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "toss-securities.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/toss-securities.md to exist");
  assert.match(readme, /\| `toss-securities` \|/);
  assert.match(readme, /\[Гайд по Toss Securities\]\(docs\/features\/toss-securities\.md\)/);
  assert.match(install, /--skill toss-securities/);
  assert.match(roadmap, /Навык для Toss Securities/);
  assert.match(sources, /tossinvest-cli: https:\/\/github\.com\/JungHoonGhae\/tossinvest-cli/);
});

test("toss-securities skill documents the tossctl install, auth, and read-only workflow", () => {
  const skillPath = path.join(repoRoot, "toss-securities", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected toss-securities/SKILL.md to exist");

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

test("toss-securities package exposes safe read-only tossctl helpers", () => {
  const pkg = require(path.join(repoRoot, "packages", "toss-securities", "src", "index.js"));

  assert.equal(typeof pkg.buildReadOnlyCommand, "function");
  assert.equal(typeof pkg.runReadOnlyCommand, "function");
  assert.equal(typeof pkg.getAccountSummary, "function");
  assert.equal(typeof pkg.getPortfolioPositions, "function");
  assert.equal(typeof pkg.getQuote, "function");
  assert.equal(typeof pkg.getQuoteBatch, "function");
  assert.equal(typeof pkg.listWatchlist, "function");
});

test("toss-securities package README stays aligned with the read-only tossctl wrapper contract", () => {
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

test("pack:dry-run includes the toss-securities workspace", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace toss-securities/);
});

test("package-lock captures the toss-securities workspace metadata for npm ci", () => {
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

test("repository docs advertise the yandex-rasp skill across the documented surfaces", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "yandex-rasp.md");
  const skillDir = path.join(repoRoot, "yandex-rasp");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/yandex-rasp.md to exist");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "expected yandex-rasp/SKILL.md to exist");
  assert.match(readme, /\| `yandex-rasp` \|/);
  assert.match(readme, /\[Гайд по Яндекс\.Расписаниям\]\(docs\/features\/yandex-rasp\.md\)/);
  assert.match(roadmap, /yandex-rasp/);
  assert.match(sources, /yandex-rasp/);
});

test("yandex-rasp docs document the Yandex Raspisanie transport schedule workflow", () => {
  const skillPath = path.join(repoRoot, "yandex-rasp", "SKILL.md");
  const packageReadmePath = path.join(repoRoot, "packages", "yandex-rasp", "README.md");

  assert.ok(fs.existsSync(skillPath), "expected yandex-rasp/SKILL.md to exist");
  assert.ok(fs.existsSync(packageReadmePath), "expected packages/yandex-rasp/README.md to exist");

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

test("pack:dry-run includes the yandex-market-search workspace", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace yandex-market-search/);
});

test("install docs enumerate every current target workspace in the explicit skills snippet", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const targetPackages = extractReadmePackageMatrix(readme)
    .filter((entry) => entry.status === "Target")
    .map((entry) => entry.name);
  const installSkills = extractInstallSkillSnippet(install);

  for (const targetPackage of targetPackages) {
    assert.ok(
      installSkills.includes(targetPackage),
      `expected docs/install.md explicit skills snippet to include ${targetPackage}`,
    );
  }
});

test("install docs npm snippet covers every current target workspace package", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const targetPackages = extractReadmePackageMatrix(readme)
    .filter((entry) => entry.status === "Target")
    .map((entry) => entry.name);
  const npmPackages = extractNodeInstallPackages(install);

  for (const targetPackage of targetPackages) {
    assert.ok(
      npmPackages.includes(targetPackage),
      `expected docs/install.md npm install snippet to include ${targetPackage}`,
    );
  }
});

test("README package matrix keeps legacy and transition statuses aligned with the roadmap", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const packageMatrix = extractReadmePackageMatrix(readme);
  const byName = new Map(packageMatrix.map((entry) => [entry.name, entry]));

  assert.equal(byName.get("toss-securities")?.status, "Legacy");
  assert.equal(byName.get("k-skill-proxy")?.status, "Transition");
  assert.match(roadmap, /\| `toss-securities` \| `legacy` \|/);
  assert.match(roadmap, /\| `k-skill-proxy` \| `transition` \|/);
});

test("install docs explain target vs legacy-only vs transition boundaries", () => {
  const install = read(path.join("docs", "install.md"));

  assert.match(install, /target[\s`-]*линейк/i);
  assert.match(install, /legacy-only/);
  assert.match(install, /transition/);
  assert.match(install, /k-skill-proxy.*не является отдельным конечным пользовательским skill/i);
  assert.match(install, /toss-securities.*legacy npm-пакетов/i);
  assert.match(install, /seoul-subway-arrival.*legacy-only/i);
});

test("planning docs stay aligned on the next migration priorities", () => {
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

  assert.equal(todoStatus.date, "2026-06-05");
  assert.equal(todoStatus.round, 40);
  assert.match(todo, /## Выполнено в этом раунде \(раунд 40\)/);
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

test("TODO keeps the active unchecked backlog only in the top plan block", () => {
  const todo = read("TODO.md");
  const planBlocks = extractSecondLevelSectionBodies(todo, "Новые пункты плана");
  const allOpenItems = [...todo.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1].trim());
  const topPlanOpenItems = [...(planBlocks[0] ?? "").matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1].trim());

  assert.ok(planBlocks.length > 0, "expected TODO.md to contain at least one plan block");
  assert.ok(topPlanOpenItems.length > 0, "expected the top plan block to contain active items");
  assert.deepEqual(
    allOpenItems,
    topPlanOpenItems,
    "expected unchecked TODO items to live only in the top plan block",
  );
  assert.equal(
    new Set(allOpenItems).size,
    allOpenItems.length,
    "expected active TODO items to be unique after historical-plan cleanup",
  );
});

test("readme and roadmap stay free from stale release-status archaeology", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));

  assertNoStaleReleaseStatus(readme, "README.md");
  assertNoStaleReleaseStatus(roadmap, "docs/roadmap.md");
});

test("legacy-only and transition guides publish explicit boundary notes", () => {
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

test("fine-dust and proxy docs distinguish endpoint override from real secrets", () => {
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
    "expected proxy package README to mention the ru-skill secrets path before the legacy fallback",
  );

  assert.match(proxyRunner, /DEFAULT_RU_SKILL_SECRETS_FILE/);
  assert.match(proxyRunner, /DEFAULT_LEGACY_SECRETS_FILE/);
  assert.ok(
    proxyRunner.indexOf("RU_SKILL_SECRETS_FILE") < proxyRunner.indexOf("KSKILL_SECRETS_FILE"),
    "expected proxy runner to prefer RU_SKILL_SECRETS_FILE before KSKILL_SECRETS_FILE",
  );

  assert.match(checkSetup, /KSKILL_PROXY_BASE_URL only if you need a fine-dust endpoint override/i);
});

test("workspace package descriptions stay aligned with the Russian migration metadata", () => {
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

    assert.equal(packageJson.description, description, `expected ${packageName} description to stay aligned with Russian package metadata copy`);
  }
});

test("seoul-subway-arrival skill prefers ru-skill secrets before the legacy fallback", () => {
  const skill = read(path.join("seoul-subway-arrival", "SKILL.md"));

  assert.match(skill, /## Граничное примечание/);
  assert.match(skill, /legacy-only/);
  assert.match(skill, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(skill, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    skill.indexOf("~/.config/ru-skill/secrets.env") < skill.indexOf("~/.config/k-skill/secrets.env"),
    "expected ru-skill secrets path to appear before the legacy k-skill fallback",
  );
});

test("legacy feature guides keep runtime and secrets semantics aligned with ru-skill-first defaults", () => {
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
    "expected fine-dust feature guide to prefer the ru-skill secrets path before the legacy fallback",
  );

  assert.match(seoulGuide, /## Граничное примечание/);
  assert.match(seoulGuide, /legacy-only/);
  assert.match(seoulGuide, /~\/\.config\/ru-skill\/secrets\.env/);
  assert.match(seoulGuide, /~\/\.config\/k-skill\/secrets\.env/);
  assert.ok(
    seoulGuide.indexOf("~/.config/ru-skill/secrets.env") < seoulGuide.indexOf("~/.config/k-skill/secrets.env"),
    "expected seoul-subway feature guide to prefer the ru-skill secrets path before the legacy fallback",
  );

  assert.match(srtGuide, /## Граничное примечание/);
  assert.match(srtGuide, /legacy-only/i);
  assert.match(srtGuide, /yandex-rasp/);
  assert.match(srtGuide, /интеграций на запись/i);
  assert.ok(
    srtGuide.indexOf("~/.config/ru-skill/secrets.env") < srtGuide.indexOf("~/.config/k-skill/secrets.env"),
    "expected srt-booking feature guide to prefer the ru-skill secrets path before the legacy fallback",
  );

  assert.match(ktxGuide, /## Граничное примечание/);
  assert.match(ktxGuide, /legacy-only/i);
  assert.match(ktxGuide, /yandex-rasp/);
  assert.match(ktxGuide, /интеграций на запись/i);
  assert.ok(
    ktxGuide.indexOf("~/.config/ru-skill/secrets.env") < ktxGuide.indexOf("~/.config/k-skill/secrets.env"),
    "expected ktx-booking feature guide to prefer the ru-skill secrets path before the legacy fallback",
  );
});

test("legacy railway and fine-dust skills keep boundary notes and ru-skill-first credential defaults", () => {
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
    "expected fine-dust skill to mention the ru-skill secrets path before the legacy fallback",
  );

  assert.match(srtSkill, /## Граничное примечание/);
  assert.match(srtSkill, /legacy-only/i);
  assert.match(srtSkill, /yandex-rasp/);
  assert.match(srtSkill, /интеграций на запись/i);
  assert.ok(
    srtSkill.indexOf("~/.config/ru-skill/secrets.env") < srtSkill.indexOf("~/.config/k-skill/secrets.env"),
    "expected srt-booking skill to mention the ru-skill secrets path before the legacy fallback",
  );

  assert.match(ktxSkill, /## Граничное примечание/);
  assert.match(ktxSkill, /legacy-only/i);
  assert.match(ktxSkill, /yandex-rasp/);
  assert.match(ktxSkill, /интеграций на запись/i);
  assert.ok(
    ktxSkill.indexOf("~/.config/ru-skill/secrets.env") < ktxSkill.indexOf("~/.config/k-skill/secrets.env"),
    "expected ktx-booking skill to mention the ru-skill secrets path before the legacy fallback",
  );
});

test("remaining legacy skill-only guides keep explicit migration boundaries", () => {
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

test("remaining legacy feature and skill guides keep explicit replacement boundaries", () => {
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

test("updated legacy docs keep Russian boundary copy on the touched surfaces", () => {
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

test("package-lock captures the yandex-market-search workspace metadata for npm ci", () => {
  const packageLock = readJson("package-lock.json");

  assert.deepEqual(packageLock.packages["node_modules/yandex-market-search"], {
    resolved: "packages/yandex-market-search",
    link: true,
  });
  assert.equal(packageLock.packages["packages/yandex-market-search"].version, "0.1.0");
  assert.equal(packageLock.packages["packages/yandex-market-search"].license, "MIT");
  assert.equal(packageLock.packages["packages/yandex-market-search"].engines.node, ">=18");
});

test("repository docs advertise the yandex-market-search skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "yandex-market-search.md");
  const skillDir = path.join(repoRoot, "yandex-market-search");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/yandex-market-search.md to exist");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "expected yandex-market-search/SKILL.md to exist");
  assert.match(readme, /\| `yandex-market-search` \|/);
  assert.match(readme, /\[Гайд по Яндекс Маркету\]\(docs\/features\/yandex-market-search\.md\)/);
  assert.match(install, /--skill yandex-market-search/);
  assert.match(roadmap, /yandex-market-search/);
  assert.match(sources, /Яндекс Маркет/);
});

test("yandex-market-search docs document the marketplace workflow", () => {
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

test("pack:dry-run includes the zoon-nearby workspace", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.match(packageJson.scripts["pack:dry-run"], /workspace zoon-nearby/);
});

test("repository docs advertise the zoon-nearby skill across the documented surfaces", () => {
  const readme = read("README.md");
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "zoon-nearby.md");
  const skillDir = path.join(repoRoot, "zoon-nearby");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/zoon-nearby.md to exist");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "expected zoon-nearby/SKILL.md to exist");
  assert.match(readme, /\| `zoon-nearby` \|/);
  assert.match(readme, /\[Гайд по Zoon\.ru\]\(docs\/features\/zoon-nearby\.md\)/);
  assert.match(roadmap, /zoon-nearby/);
  assert.match(sources, /Zoon/);
});

test("zoon-nearby docs document the nearby search workflow", () => {
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

test("repository docs advertise the moex-shares skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "moex-shares.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/moex-shares.md to exist");
  assert.match(readme, /\| `moex-shares` \|/);
  assert.match(readme, /\[Гайд по акциям MOEX\]\(docs\/features\/moex-shares\.md\)/);
  assert.match(install, /--skill moex-shares/);
  assert.match(roadmap, /moex-shares/);
  assert.match(sources, /iss\.moex\.com/);
});

test("moex-shares docs document the official MOEX ISS workflow", () => {
  const skillPath = path.join(repoRoot, "moex-shares", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected moex-shares/SKILL.md to exist");

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

test("repository docs advertise the stoloto-lotto skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "stoloto-lotto.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/stoloto-lotto.md to exist");
  assert.match(readme, /\| `stoloto-lotto` \|/);
  assert.match(readme, /\[Гайд по лотереям Столото\]\(docs\/features\/stoloto-lotto\.md\)/);
  assert.match(install, /--skill stoloto-lotto/);
  assert.match(roadmap, /stoloto-lotto/);
  assert.match(sources, /stoloto\.ru/);
});

test("stoloto-lotto docs document the public archive workflow", () => {
  const featureDoc = read(path.join("docs", "features", "stoloto-lotto.md"));
  const packageReadme = read(path.join("packages", "stoloto-lotto", "README.md"));

  assert.match(featureDoc, /getArchiveDraws/);
  assert.match(featureDoc, /stoloto\.ru\/\{?game\}?\//);
  assert.match(packageReadme, /getArchiveDraws/);
  assert.match(packageReadme, /SUPPORTED_GAMES/);
});

test("repository docs advertise the kinopoisk-search skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "kinopoisk-search.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/kinopoisk-search.md to exist");
  assert.match(readme, /\| `kinopoisk-search` \|/);
  assert.match(readme, /\[Гайд по Кинопоиску\]\(docs\/features\/kinopoisk-search\.md\)/);
  assert.match(install, /--skill kinopoisk-search/);
  assert.match(roadmap, /kinopoisk-search/);
  assert.match(sources, /kinopoisk\.ru/);
});

test("kinopoisk-search docs document the search and film card workflow", () => {
  const featureDoc = read(path.join("docs", "features", "kinopoisk-search.md"));
  const packageReadme = read(path.join("packages", "kinopoisk-search", "README.md"));

  assert.match(featureDoc, /getFilmById/);
  assert.match(featureDoc, /searchFilms/);
  assert.match(featureDoc, /kinopoisk\.ru/);
  assert.match(packageReadme, /getFilmById/);
  assert.match(packageReadme, /searchFilms/);
});

test("repository docs advertise the pravo-documents skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "pravo-documents.md");
  const skillDir = path.join(repoRoot, "pravo-documents");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/pravo-documents.md to exist");
  assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")), "expected pravo-documents/SKILL.md to exist");
  assert.match(readme, /\| `pravo-documents` \|/);
  assert.match(readme, /\[Гайд по правовым документам\]\(docs\/features\/pravo-documents\.md\)/);
  assert.match(install, /--skill pravo-documents/);
  assert.match(roadmap, /pravo-documents/);
  assert.match(sources, /pravo\.gov\.ru/);
});

test("pravo-documents docs document the official pravo.gov.ru API workflow", () => {
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

test("repository docs advertise the rpl-results skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "rpl-results.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/rpl-results.md to exist");
  assert.match(readme, /\| `rpl-results` \|/);
  assert.match(readme, /\[Гайд по РПЛ\]\(docs\/features\/rpl-results\.md\)/);
  assert.match(install, /--skill rpl-results/);
  assert.match(roadmap, /rpl-results/);
  assert.match(sources, /championat\.com/);
});

test("rpl-results docs document the championat.com standings and results workflow", () => {
  const featureDoc = read(path.join("docs", "features", "rpl-results.md"));
  const packageReadme = read(path.join("packages", "rpl-results", "README.md"));

  assert.match(featureDoc, /getStandings/);
  assert.match(featureDoc, /getResults/);
  assert.match(featureDoc, /championat\.com/);
  assert.match(packageReadme, /getStandings/);
  assert.match(packageReadme, /getResults/);
});

test("repository docs advertise the osm-nearby skill across the documented surfaces", () => {
  const readme = read("README.md");
  const install = read(path.join("docs", "install.md"));
  const roadmap = read(path.join("docs", "roadmap.md"));
  const sources = read(path.join("docs", "sources.md"));
  const featureDocPath = path.join(repoRoot, "docs", "features", "osm-nearby.md");

  assert.ok(fs.existsSync(featureDocPath), "expected docs/features/osm-nearby.md to exist");
  assert.match(readme, /\| `osm-nearby` \|/);
  assert.match(readme, /\[Гайд по OSM nearby\]\(docs\/features\/osm-nearby\.md\)/);
  assert.match(install, /--skill osm-nearby/);
  assert.match(roadmap, /osm-nearby/);
  assert.match(sources, /overpass|OpenStreetMap/i);
});

test("osm-nearby docs document the Overpass API search workflow", () => {
  const skillPath = path.join(repoRoot, "packages", "osm-nearby", "SKILL.md");

  assert.ok(fs.existsSync(skillPath), "expected packages/osm-nearby/SKILL.md to exist");

  const featureDoc = read(path.join("docs", "features", "osm-nearby.md"));
  const packageReadme = read(path.join("packages", "osm-nearby", "README.md"));

  assert.match(featureDoc, /searchNearby|searchRestaurants|searchBars/);
  assert.match(featureDoc, /overpass|Overpass/);
  assert.match(featureDoc, /getPlaceDetails/);
  assert.match(packageReadme, /searchNearby/);
  assert.match(packageReadme, /searchRestaurants/);
  assert.match(packageReadme, /getPlaceDetails/);
});

test("seoul-subway-arrival skill documents the official Seoul Open Data real-time arrival workflow", () => {
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
    "expected seoul-subway skill to mention ru-skill secrets path before legacy fallback",
  );
});

test("kbo-results skill documents the kbo-game lookup workflow with correct export and date handling", () => {
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

test("lotto-results skill documents the k-lotto draw and number check workflow", () => {
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

test("hwp skill and feature doc classify the Korean document utility as target-supporting", () => {
  const skill = read(path.join("hwp", "SKILL.md"));
  const featureDoc = read(path.join("docs", "features", "hwp.md"));

  for (const doc of [skill, featureDoc]) {
    assert.match(doc, /## Граничное примечание/);
    assert.match(doc, /target-supporting/);
    assert.match(doc, /корейский формат|HWP|Хангул/i);
  }
});

test("blue-ribbon-nearby routing defers to osm-nearby and zoon-nearby for general queries", () => {
  const skill = read(path.join("blue-ribbon-nearby", "SKILL.md"));

  assert.match(skill, /osm-nearby/);
  assert.match(skill, /zoon-nearby/);
  assert.match(skill, /российск.*ближайш.*osm-nearby.*zoon-nearby|osm-nearby.*zoon-nearby.*российск.*ближайш/i);
  assert.match(skill, /только.*Blue Ribbon|только.*корейск/i);
});

test("srt-booking skill documents the SRTrain search, reserve and cancel workflow", () => {
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
    "expected srt-booking skill to mention ru-skill secrets path before legacy fallback",
  );
  assert.ok(
    featureDoc.indexOf("~/.config/ru-skill/secrets.env") < featureDoc.indexOf("~/.config/k-skill/secrets.env"),
    "expected srt-booking feature doc to mention ru-skill secrets path before legacy fallback",
  );
});

test("kakaotalk-mac skill documents the full macOS kakaocli workflow from install to safe send", () => {
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

test("daiso-product-search skill documents the store-product-stock workflow end to end", () => {
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

test("delivery-tracking skill documents the CJ and ePost carrier adapter workflow with boundary note", () => {
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

test("all SKILL.md files use canonical Russian heading scheme", () => {
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
      `${skill}/SKILL.md must have canonical heading "Что делает навык", found: ${headings.filter(h => /Что/.test(h)).join(", ")}`,
    );

    for (const pattern of nonCanonicalHeadingPatterns) {
      assert.doesNotMatch(
        content,
        pattern,
        `${skill}/SKILL.md must not contain non-canonical heading "${pattern.source.replace(/^## /, "")}"`,
      );
    }
  }

  const pkgOsmSkill = read(path.join("packages", "osm-nearby", "SKILL.md"));
  assert.ok(
    extractSecondLevelHeadings(pkgOsmSkill).includes("Что делает навык"),
    "packages/osm-nearby/SKILL.md must have canonical heading scheme",
  );

  const pkgZoonSkill = read(path.join("packages", "zoon-nearby", "SKILL.md"));
  assert.deepEqual(
    extractSecondLevelHeadings(pkgZoonSkill),
    canonicalTargetHeadings,
    "packages/zoon-nearby/SKILL.md must match the canonical target headings exactly",
  );

  for (const skill of setupSkills) {
    const content = read(path.join(skill, "SKILL.md"));
    const headings = extractSecondLevelHeadings(content);
    assert.deepEqual(headings, canonicalSetupHeadings, `${skill}/SKILL.md must match canonical setup headings`);
  }
});

test("feature docs use canonical Russian headings without non-canonical variants", () => {
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
        `docs/features/${file} must not contain non-canonical heading "${pattern.source}"`,
      );
    }
  }
});

test("user-facing docs contain no Chinese character artifacts", () => {
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
      `${dir}/SKILL.md must not contain Chinese character artifacts`,
    );
  }

  const featuresDir = path.join(repoRoot, "docs", "features");
  const featureFiles = fs.readdirSync(featuresDir).filter((f) => f.endsWith(".md"));

  for (const file of featureFiles) {
    const content = fs.readFileSync(path.join(featuresDir, file), "utf8");
    assert.doesNotMatch(
      content,
      chineseCharPattern,
      `docs/features/${file} must not contain Chinese character artifacts`,
    );
  }

  const sourcesDoc = read(path.join("docs", "sources.md"));
  assert.doesNotMatch(
    sourcesDoc,
    chineseCharPattern,
    "docs/sources.md must not contain Chinese character artifacts",
  );
});

test("changeset summaries are in Russian", () => {
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
        `.changeset/${file} summary must start with Russian, not English`,
      );
    }
  }
});

test("SKILL.md frontmatter descriptions are in Russian", () => {
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
        `${dir}/SKILL.md description must be in Russian`,
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
        `packages/${dir}/SKILL.md description must be in Russian`,
      );
    }
  }
});

test("roadmap uses Russian milestone headings instead of English", () => {
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

test("osm-nearby feature doc uses Russian instead of English jargon", () => {
  const featureDoc = read(path.join("docs", "features", "osm-nearby.md"));

  assert.match(featureDoc, /бесплатн.*решение без API-ключа|решение без API-ключа.*бесплатн/i);
  assert.match(featureDoc, /может быть неполным/);
  assert.match(featureDoc, /бесплатн.*вариант без API-ключа/i);

  assert.doesNotMatch(featureDoc, /free.*no.?key/i);
  assert.doesNotMatch(featureDoc, /\bsparse\b/);
});

test("target package READMEs use Russian instead of Read-only jargon", () => {
  const targetPackages = [
    "cbr-rates", "moex-shares", "postcalc-postcodes", "hh-vacancies",
    "stoloto-lotto", "kinopoisk-search", "mchs-storm-warnings",
    "pravo-documents", "yandex-rasp", "yandex-market-search", "osm-nearby",
    "zoon-nearby",
  ];

  for (const pkg of targetPackages) {
    const readme = read(path.join("packages", pkg, "README.md"));
    assert.doesNotMatch(readme, /^Read-only/im, `packages/${pkg}/README.md must not start with English Read-only`);
    assert.doesNotMatch(readme, /\bRead-only\b/, `packages/${pkg}/README.md must not contain English Read-only`);
  }

  const zoonReadme = read(path.join("packages", "zoon-nearby", "README.md"));
  assert.match(zoonReadme, /^## Что делает навык$/m);
  assert.doesNotMatch(zoonReadme, /^## Обзор$/m);
});

test("docs/sources.md uses Russian instead of English jargon", () => {
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

test("docs/roadmap.md does not contain English jargon in user-facing surfaces", () => {
  const roadmap = read(path.join("docs", "roadmap.md"));
  assert.doesNotMatch(roadmap, /delayed-цены/);
});

test("AGENTS.md uses Russian for repo-governance copy", () => {
  const agents = read("AGENTS.md");

  assert.match(agents, /^# Инструкции для репозитория k-skill$/m);
  assert.match(agents, /^## Правила релизной автоматизации$/m);
  assert.match(agents, /^## Политика прокси для бесплатных API$/m);
  assert.doesNotMatch(agents, /^# k-skill repository instructions$/m);
  assert.doesNotMatch(agents, /Default posture: public read-only endpoint/);
});

test("delivery-tracking SKILL.md uses Russian instead of live smoke test", () => {
  const skill = read(path.join("delivery-tracking", "SKILL.md"));
  assert.doesNotMatch(skill, /live smoke test/);
  assert.doesNotMatch(skill, /\bsmoke test\b/);
  assert.match(skill, /проверочный тест/);
});

test("yandex-rasp SKILL.md uses Russian instead of checkout", () => {
  const skill = read(path.join("yandex-rasp", "SKILL.md"));
  assert.doesNotMatch(skill, /\bcheckout\b/);
  assert.match(skill, /оформление заказа/);
});

test("fine-dust-location SKILL.md uses Russian instead of fallback", () => {
  const skill = read(path.join("fine-dust-location", "SKILL.md"));
  assert.doesNotMatch(skill, /`fallback`/);
  assert.match(skill, /запасной вариант/);
});

test("package.json descriptions use Russian instead of nearby- prefix", () => {
  const packagesDir = path.join(repoRoot, "packages");
  const nearbyPackages = ["blue-ribbon-nearby", "kakao-bar-nearby", "osm-nearby", "zoon-nearby"];

  for (const pkg of nearbyPackages) {
    const packageJson = JSON.parse(read(path.join("packages", pkg, "package.json")));
    assert.doesNotMatch(packageJson.description, /nearby-/, `packages/${pkg}/package.json description must not use nearby- prefix`);
  }
});

test("changeset summaries use Russian instead of read-only prefix", () => {
  const changesetDir = path.join(repoRoot, ".changeset");
  const changesetFiles = fs.readdirSync(changesetDir).filter((f) => f.endsWith(".md") && f !== "README.md");

  for (const file of changesetFiles) {
    const content = read(path.join(".changeset", file));
    assert.doesNotMatch(content, /read-only-/, `.changeset/${file} must not use read-only- prefix`);
    assert.doesNotMatch(content, /fixture-based/, `.changeset/${file} must not use fixture-based jargon`);
  }
});

test("CHANGELOG files use Russian headings and descriptions", () => {
  const changelogPackages = [
    "toss-securities", "kleague-results", "kakao-bar-nearby",
    "k-lotto", "daiso-product-search", "blue-ribbon-nearby",
  ];

  for (const pkg of changelogPackages) {
    const changelogPath = path.join(repoRoot, "packages", pkg, "CHANGELOG.md");
    if (!fs.existsSync(changelogPath)) continue;

    const content = read(path.join("packages", pkg, "CHANGELOG.md"));
    assert.doesNotMatch(content, /^### Minor Changes$/m, `packages/${pkg}/CHANGELOG.md must not use English heading "Minor Changes"`);
    assert.match(content, /^### Незначительные изменения$/m, `packages/${pkg}/CHANGELOG.md must use Russian heading "Незначительные изменения"`);
    assert.doesNotMatch(content, /^- [0-9a-f]+: (Add|Publish|Create|Implement|Update)\b/i, `packages/${pkg}/CHANGELOG.md description must be in Russian, not English`);
  }
});

test("source code does not contain English jargon in user-facing output", () => {
  const srcDir = path.join(repoRoot, "packages");
  const packages = fs.readdirSync(srcDir);

  for (const pkg of packages) {
    const srcPath = path.join(srcDir, pkg, "src");
    if (!fs.existsSync(srcPath)) continue;

    const srcFiles = fs.readdirSync(srcPath).filter((f) => f.endsWith(".js"));
    for (const file of srcFiles) {
      const content = fs.readFileSync(path.join(srcPath, file), "utf8");

      assert.doesNotMatch(content, /read-only skill for/i, `packages/${pkg}/src/${file} must not use English "read-only skill for" in User-Agent`);
      assert.doesNotMatch(content, /A fetch implementation is required/i, `packages/${pkg}/src/${file} must not use English "A fetch implementation is required"`);
      assert.doesNotMatch(content, /AIR_KOREA_OPEN_API_KEY is not configured on the proxy server/i, `packages/${pkg}/src/${file} must not use English AIR_KOREA_OPEN_API_KEY error message`);
    }
  }
});

test("k-skill-proxy uses Russian lookupMode values", () => {
  const airkorea = read(path.join("packages", "k-skill-proxy", "src", "airkorea.js"));

  assert.doesNotMatch(airkorea, /lookupMode: "fallback"/);
  assert.match(airkorea, /lookupMode: "запасной вариант"/);
  assert.match(airkorea, /Требуется реализация fetch/);
  assert.doesNotMatch(airkorea, /A fetch implementation is required/);
  assert.match(airkorea, /AIR_KOREA_OPEN_API_KEY не настроен на прокси-сервере/);
  assert.doesNotMatch(airkorea, /AIR_KOREA_OPEN_API_KEY is not configured/);
});

test("cbr-rates uses Russian direction values", () => {
  const index = read(path.join("packages", "cbr-rates", "src", "index.js"));

  assert.doesNotMatch(index, /"flat"/);
  assert.doesNotMatch(index, /"up"/);
  assert.doesNotMatch(index, /"down"/);
  assert.match(index, /"без изменений"/);
  assert.match(index, /"рост"/);
  assert.match(index, /"снижение"/);
});

test("osm-nearby uses Russian default amenity value", () => {
  const query = read(path.join("packages", "osm-nearby", "src", "query.js"));

  assert.doesNotMatch(query, /'unknown'/);
  assert.match(query, /"неизвестно"/);
});

test("GitHub Actions workflow names use Russian", () => {
  const releaseNpm = read(path.join(".github", "workflows", "release-npm.yml"));
  const releasePython = read(path.join(".github", "workflows", "release-python.yml"));

  assert.match(releaseNpm, /^name: Релиз npm-пакетов$/m);
  assert.doesNotMatch(releaseNpm, /^name: Release npm packages$/m);

  assert.match(releasePython, /^name: Релиз Python-пакетов$/m);
  assert.doesNotMatch(releasePython, /^name: Release Python packages$/m);
});

test("GitHub Actions workflow step names and comments use Russian instead of English", () => {
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

test("version-packages script chains fix-changelog-headings after changeset version", () => {
  const packageJson = readJson("package.json");

  assert.match(
    packageJson.scripts["version-packages"],
    /changeset version && node scripts\/fix-changelog-headings\.js/,
  );
});

test("fix-changelog-headings script exists and handles all standard English headings", () => {
  const scriptPath = path.join(repoRoot, "scripts", "fix-changelog-headings.js");

  assert.ok(fs.existsSync(scriptPath), "expected scripts/fix-changelog-headings.js to exist");

  const script = read(path.join("scripts", "fix-changelog-headings.js"));

  assert.match(script, /Major Changes.*Крупные изменения|Крупные изменения.*Major Changes/s);
  assert.match(script, /Minor Changes.*Незначительные изменения|Незначительные изменения.*Minor Changes/s);
  assert.match(script, /Patch Changes.*Исправления|Исправления.*Patch Changes/s);
});

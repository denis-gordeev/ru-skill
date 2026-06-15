const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  buildReadOnlyCommand,
  getAccountSummary,
  getQuote
} = require("../src/index");
const {
  assertReadOnlyCommandName,
  parseJsonOutput
} = require("../src/parse");

test("buildReadOnlyCommand собирает аргументы tossctl для поддерживаемых команд только для чтения", () => {
  const command = buildReadOnlyCommand("quoteGet", {
    symbol: "TSLA",
    configDir: "/tmp/toss",
    sessionFile: "/tmp/toss/session.json"
  });

  assert.equal(command.bin, "tossctl");
  assert.deepEqual(command.args, [
    "--output",
    "json",
    "--config-dir",
    "/tmp/toss",
    "--session-file",
    "/tmp/toss/session.json",
    "quote",
    "get",
    "TSLA"
  ]);
});

test("валидация команд только для чтения отклоняет неподдерживаемые или опасные имена команд", () => {
  assert.equal(assertReadOnlyCommandName("accountSummary"), "accountSummary");
  assert.throws(() => assertReadOnlyCommandName("orderPlace"), /Неподдерживаемая команда tossctl только для чтения/);
});

test("parseJsonOutput аннотирует JSON-нагрузку исходной командой", () => {
  const result = parseJsonOutput('{"ok":true,"items":[1,2]}', "watchlistList");

  assert.equal(result.commandName, "watchlistList");
  assert.deepEqual(result.data, {
    ok: true,
    items: [1, 2]
  });
});

test("buildReadOnlyCommand добавляет фильтр рынка для завершённых ордеров", () => {
  const command = buildReadOnlyCommand("ordersCompleted", {
    market: "us"
  });

  assert.deepEqual(command.args.slice(-4), [
    "orders",
    "completed",
    "--market",
    "us"
  ]);
});

test("публичные помощники выполняют имитацию бинарного файла tossctl и анализируют его JSON-вывод", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "toss-securities-"));
  const binDir = path.join(tempDir, "bin");
  const logFile = path.join(tempDir, "invocation.json");
  fs.mkdirSync(binDir, { recursive: true });

  const script = `#!/bin/sh
printf '%s\n' "$@" > "${logFile}"
if [ "$7" = "account" ] && [ "$8" = "summary" ]; then
  printf '{"accountNo":"123-45","totalAssetAmount":1500000}\n'
  exit 0
fi
if [ "$3" = "quote" ] && [ "$4" = "get" ]; then
  printf '{"symbol":"%s","price":123.45}\n' "$5"
  exit 0
fi
printf '{"args":"%s"}\n' "$*"
`;

  const binPath = path.join(binDir, "tossctl");
  fs.writeFileSync(binPath, script, { mode: 0o755 });

  const env = {
    ...process.env,
    PATH: `${binDir}:${process.env.PATH || ""}`
  };
  const account = await getAccountSummary({
    configDir: "/tmp/toss-config",
    sessionFile: "/tmp/toss-session.json",
    env
  });
  const quote = await getQuote("005930", { env });

  assert.equal(account.commandName, "accountSummary");
  assert.equal(account.data.totalAssetAmount, 1500000);
  assert.equal(quote.data.symbol, "005930");
  assert.match(fs.readFileSync(logFile, "utf8"), /quote|get/);
});

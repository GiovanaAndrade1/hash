const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { runInNewContext } = require("node:vm");
const context = { window: {}, performance, setTimeout };
runInNewContext(
  readFileSync(require.resolve("../assets/js/hash-calculator.js"), "utf8"),
  context,
);
const { calculate } = context.window.HashCalculator;

test("duplicatas não aumentam o número de IPs únicos ou a maior lista", async () => {
  const result = await calculate(["1.2.3.4", "1.2.3.4"]);
  assert.equal(result.unique, 1);
  assert.equal(result.longest, 1);
  assert.equal(result.occupied, 1);
  assert.equal(result.empty, 128989);
  assert.equal(result.load, 1 / 128990);
});

test("estatísticas coincidem com o conjunto original validado no C++", async () => {
  const addresses = readFileSync(
    require.resolve("../Documents/hash/dados_ips.txt"),
    "utf16le",
  )
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/);
  const result = await calculate(addresses);
  assert.equal(result.unique, 64493);
  assert.equal(result.longest, 19);
  assert.equal(result.empty, 103236);
  assert.equal(result.occupied, 25754);
});

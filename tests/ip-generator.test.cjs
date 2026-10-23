const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const { webcrypto } = require('node:crypto');

const context = { window: {}, crypto: webcrypto, Blob, Uint8Array, setTimeout };
runInNewContext(
  readFileSync(require.resolve('../assets/js/ip-generator.js'), 'utf8'),
  context,
);
const { generateFile, isValidQuantity } = context.window.IpGenerator;

test('rejeita quantidades inválidas antes de gerar o arquivo', async () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(isValidQuantity(quantity), false);
    await assert.rejects(generateFile(quantity), { name: 'RangeError' });
  }
});

test('gera exatamente a quantidade solicitada de IPv4, inclusive entre lotes', async () => {
  for (const quantity of [1, 10001]) {
    const progress = [];
    const file = await generateFile(quantity, (done, total) => progress.push([done, total]));
    const text = await file.text();
    assert.equal(file.type, 'text/plain;charset=utf-8');
    assert.ok(text.endsWith('\n'));
    const lines = text.trimEnd().split('\n');
    assert.equal(lines.length, quantity);
    for (const line of lines) {
      assert.match(line, /^\d{1,3}(\.\d{1,3}){3}$/);
      assert.ok(line.split('.').every(octet => Number(octet) <= 255));
    }
    assert.deepEqual(progress, quantity === 1 ? [[1, 1]] : [[10000, 10001], [10001, 10001]]);
  }
});

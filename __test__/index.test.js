import { test, expect, beforeAll } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff, { readFile, genLineDiff } from '../src/index.js';
import { flatData1, flatData2 } from '../__fixtures__/parsedData.js';

const flatDataDiff = '{\n  - follow: false\n    host: hexlet.io\n  - proxy: 123.234.53.22\n  - timeout: 50\n  + timeout: 20\n  + verbose: true\n}';

let json1;
let json2;
let yaml1;
let yml2;
beforeAll(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  json1 = getFixturePath('file1.json');
  json2 = getFixturePath('file2.json');
  yaml1 = getFixturePath('file1.yaml');
  yml2 = getFixturePath('file2.yml');
});

test('test readFile()', () => {
  expect(readFile(json1)).toEqual(flatData1);
  expect(readFile(yaml1)).toEqual(flatData1);
  expect(readFile(yml2)).toEqual(flatData2);
});

test('test genLineDiff()', () => {
  expect(genLineDiff('timeout', flatData1, flatData2)).toBe('  - timeout: 50\n  + timeout: 20');
  expect(genLineDiff('proxy', flatData1, flatData2)).toBe('  - proxy: 123.234.53.22');
  expect(genLineDiff('verbose', flatData1, flatData2)).toBe('  + verbose: true');
  expect(genLineDiff('host', flatData1, flatData2)).toBe('    host: hexlet.io');
});

test('test genDiff()', () => {
  expect(genDiff(json1, json2)).toEqual(flatDataDiff);
  expect(genDiff(json1, yml2)).toEqual(flatDataDiff);
});

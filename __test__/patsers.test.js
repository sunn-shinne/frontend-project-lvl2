import { test, expect, beforeAll } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import { jsonParser, yamlParser } from '../src/parsers';
import { flatData1, flatData2 } from '../__fixtures__/parsedData.js';

let json;
let yaml;
let yml;
beforeAll(() => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', 'flatData', filename);
  json = getFixturePath('file1.json');
  yaml = getFixturePath('file1.yaml');
  yml = getFixturePath('file2.yml');
});

test('test parsers', () => {
  expect(jsonParser(json)).toEqual(flatData1);
  expect(yamlParser(yaml)).toEqual(flatData1);
  expect(yamlParser(yml)).toEqual(flatData2);
});

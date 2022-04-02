import path from 'path';
import { jsonParser, yamlParser } from './parsers.js';

export const readFile = (filepath) => {
  switch (path.extname(filepath)) {
    case '.json':
      return jsonParser(filepath);

    case '.yaml':
    case '.yml':
      return yamlParser(filepath);

    default:
      return jsonParser(filepath);
  }
};

export const genLineDiff = (key, data1, data2) => {
  if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    return `  + ${key}: ${data2[key]}`;
  }
  if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
    return `  - ${key}: ${data1[key]}`;
  }
  if (data1[key] !== data2[key]) {
    return `  - ${key}: ${data1[key]}\n  + ${key}: ${data2[key]}`;
  }
  return `    ${key}: ${data1[key]}`;
};

const genDiff = (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const set = new Set([...Object.keys(data1), ...Object.keys(data2)]);
  const allKeys = [...set].sort();

  const diffArr = allKeys.map((key) => genLineDiff(key, data1, data2));
  const diff = `{\n${diffArr.join('\n')}\n}`;

  return diff;
};

export default genDiff;

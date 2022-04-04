import path from 'path';
import { jsonParser, yamlParser } from './parsers.js';
import stylish from './stylish.js';
import isObject from './utilitys.js';

const readFile = (filepath) => {
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

const genLineDiff = (key, data1, data2) => {
  if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    return [{ currentKey: key, value: data2[key], char: '+' }];
  }
  if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
    return [{ currentKey: key, value: data1[key], char: '-' }];
  }
  if (data1[key] !== data2[key]) {
    return [{ currentKey: key, value: data1[key], char: '-' }, { currentKey: key, value: data2[key], char: '+' }];
  }
  return [{ currentKey: key, value: data1[key], char: ' ' }];
};

const genDiff = (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const compareData = (value1, value2, level = 2) => {
    const set = new Set([...Object.keys(value1), ...Object.keys(value2)]);
    const allKeys = [...set].sort();

    const diffArr = allKeys.map((key) => {
      if (isObject(value1[key]) && isObject(value2[key])) {
        return stylish(key, compareData(value1[key], value2[key], level + 4), level);
      }
      const diffParams = genLineDiff(key, value1, value2, level);
      return diffParams
        .map(({ currentKey, value, char }) => (
          stylish(currentKey, value, level, char)
        ))
        .join('\n');
    });

    const diff = `{\n${diffArr.join('\n')}\n${' '.repeat(level - 2)}}`;
    return diff;
  };
  return compareData(data1, data2);
};

export { readFile };
export default genDiff;

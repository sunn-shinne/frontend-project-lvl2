import path from 'path';
import { jsonParser, yamlParser } from './parsers.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
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

const format = (formatName, params) => {
  switch (formatName) {
    case 'stylish':
      return stylish(params);
    case 'plain':
      return plain(params);
    default: return '';
  }
};

const genLineDiff = (key, data1, data2, level) => {
  if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    return [{
      key, value: data2[key], char: '+', level,
    }];
  }
  if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
    return [{
      key, value: data1[key], char: '-', level,
    }];
  }
  if (data1[key] !== data2[key]) {
    return [{
      key, value: data1[key], char: '-', level,
    }, {
      key, value: data2[key], char: '+', level,
    }];
  }
  return [{
    key, value: data1[key], char: ' ', level,
  }];
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const compareData = (value1, value2, level = 2) => {
    const set = new Set([...Object.keys(value1), ...Object.keys(value2)]);
    const allKeys = [...set].sort();

    const diffArr = allKeys.map((key) => {
      if (isObject(value1[key]) && isObject(value2[key])) {
        const value = compareData(value1[key], value2[key], level + 4);
        const diffParams = [{
          key, value, level, char: ' ',
        }];
        return format(formatName, diffParams);
      }
      const diffParams = genLineDiff(key, value1, value2, level);
      return format(formatName, diffParams);
    });

    const diff = `{\n${diffArr.join('\n')}\n${' '.repeat(level - 2)}}`;
    return diff;
  };
  return compareData(data1, data2);
};

export { readFile };
export default genDiff;

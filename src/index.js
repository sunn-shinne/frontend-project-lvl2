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

const getLineDiff = (key, data1, data2) => {
  if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    return {
      key, from: null, to: data2[key], status: 'added',
    };
  }
  if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
    return {
      key, from: data1[key], to: null, status: 'removed',
    };
  }
  if (data1[key] !== data2[key]) {
    return {
      key, from: data1[key], to: data2[key], status: 'updated',
    };
  }
  return {
    key, from: data1[key], to: data2[key], status: 'not-touched',
  };
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const compareData = (value1, value2, level = 2, way = []) => {
    const set = new Set([...Object.keys(value1), ...Object.keys(value2)]);
    const allKeys = [...set].sort();

    const diffParams = allKeys.map((key) => {
      if (isObject(value1[key]) && isObject(value2[key])) {
        const value = compareData(value1[key], value2[key], level + 4, [...way, key]);
        return {
          key, value, status: 'root', level, way,
        };
      }
      return { ...getLineDiff(key, value1, value2), way: [...way, key], level };
    });
    return diffParams;
  };

  return format(formatName, compareData(data1, data2));
};

export { readFile };
export default genDiff;

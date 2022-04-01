import fs from 'fs';
import path from 'path';

export const readFile = (filepath, extention) => {
  switch (extention) {
    case 'json':
      return JSON.parse(fs.readFileSync(path.resolve(filepath)));
    default:
      return fs.readFileSync(path.resolve(filepath));
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
  const extention = filepath1.split('.').pop();
  const data1 = readFile(filepath1, extention);
  const data2 = readFile(filepath2, extention);

  const set = new Set([...Object.keys(data1), ...Object.keys(data2)]);
  const allKeys = [...set].sort();

  const diffArr = allKeys.map((key) => genLineDiff(key, data1, data2));
  const diff = `{\n${diffArr.join('\n')}\n}`;

  return diff;
};

export default genDiff;

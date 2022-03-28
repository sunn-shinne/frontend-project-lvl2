import fs from 'fs';
import path from 'path';

const readFile = (filepath, extention) => (
  (extention === 'json') ? JSON.parse(fs.readFileSync(path.resolve(filepath))) : fs.readFileSync(path.resolve(filepath))
);

const genLineDiff = (key, data1, data2) => {
  if (!Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
    return `  + ${key}: ${data2[key]}`;
  }
  if (Object.hasOwn(data1, key) && !Object.hasOwn(data2, key)) {
    return `  - ${key}: ${data1[key]}`;
  }
  if (data1[key] !== data2[key]) {
    return [`  - ${key}: ${data1[key]}`, `  + ${key}: ${data2[key]}`];
  }
  return `    ${key}: ${data1[key]}`;
};

const genDiff = (filepath1, filepath2) => {
  const extention = filepath1.split('.').pop();
  const data1 = readFile(filepath1, extention);
  const data2 = readFile(filepath2, extention);

  const set = new Set([...Object.keys(data1), ...Object.keys(data2)]);
  const allKeys = [...set].sort();

  const diffArr = allKeys.flatMap((key) => genLineDiff(key, data1, data2));
  const diff = `{\n${diffArr.join('\n')}\n}`;

  return diff;
};

export default genDiff;

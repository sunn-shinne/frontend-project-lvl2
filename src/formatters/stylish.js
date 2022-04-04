import isObject from '../utilitys.js';

const stylishValue = (data, level) => {
  if (isObject(data)) {
    const entries = Object.entries(data);
    return `{\n${entries.map(([key, value]) => `${' '.repeat(level + 6)}${key}: ${stylishValue(value, level + 4)}`).join('\n')}\n${' '.repeat(level + 2)}}`;
  }
  return data;
};

const stylish = (params) => params
  .map(({
    key, value, level, char,
  }) => (`${' '.repeat(level)}${char} ${key}: ${stylishValue(value, level)}`))
  .join('\n');

export default stylish;

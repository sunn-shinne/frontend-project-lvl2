import isObject from '../utilitys.js';

const stylishValue = (data, level) => {
  if (isObject(data)) {
    const entries = Object.entries(data);
    return `{\n${entries.map(([key, value]) => `${' '.repeat(level + 2)}${key}: ${stylishValue(value, level + 4)}`).join('\n')}\n${' '.repeat(level - 2)}}`;
  }
  return data;
};

const stylishLine = ({
  key, from, to, level, status,
}) => {
  switch (status) {
    case 'added':
      return `${' '.repeat(level)}+ ${key}: ${stylishValue(to, level + 4)}\n`;
    case 'removed':
      return `${' '.repeat(level)}- ${key}: ${stylishValue(from, level + 4)}\n`;
    case 'updated':
      return `${' '.repeat(level)}- ${key}: ${stylishValue(from, level + 4)}\n${' '.repeat(level)}+ ${key}: ${stylishValue(to, level + 4)}\n`;
    case 'not-touched':
      return `${' '.repeat(level)}  ${key}: ${stylishValue(from, level + 4)}\n`;
    default:
      return `${' '.repeat(level)}  ${key}: ${stylishValue(from, level + 4)}\n`;
  }
};

const stylish = (params) => {
  const inner = (node) => {
    if (node.status === 'root') {
      return `${' '.repeat(node.level + 2)}${node.key}: {\n${node.children.flatMap(inner).join('')}${' '.repeat(node.level + 2)}}\n`;
    }
    return stylishLine(node);
  };
  const res = params.flatMap(inner).join('');

  return `{\n${res}}`;
};

export default stylish;

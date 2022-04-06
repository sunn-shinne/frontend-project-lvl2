import isObject from '../utilitys.js';

const plainValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plainLine = ({
  from, to, status, way,
}) => {
  switch (status) {
    case 'added':
      return `Property '${way.join('.')}' was added with value: ${plainValue(to)}`;
    case 'removed':
      return `Property '${way.join('.')}' was removed`;
    case 'updated':
      return `Property '${way.join('.')}' was updated. From ${plainValue(from)} to ${plainValue(to)}`;
    default:
      return null;
  }
};

const plain = (params) => {
  const inner = (node) => {
    if (node.status === 'root') {
      return node.children.flatMap(inner);
    }
    return plainLine(node);
  };
  const res = params
    .flatMap(inner)
    .filter((item) => item !== null)
    .join('\n');

  return `${res}`;
};

export default plain;

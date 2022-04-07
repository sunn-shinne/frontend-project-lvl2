const isObject = (item) => (typeof item === 'object' && item !== null) && !Array.isArray(item);

const hasProperty = (item, key) => Object.prototype.hasOwnProperty.call(item, key);

export { isObject, hasProperty };

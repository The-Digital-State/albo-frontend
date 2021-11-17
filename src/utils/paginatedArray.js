export default (array, pagination = {}) => {
  const paginationMap = new Map(Object.entries(pagination));

  return new Proxy(array, {
    get(target, key) {
      if (paginationMap.has(key)) {
        return paginationMap.get(key);
      }
      return target[key];
    },
  });
};

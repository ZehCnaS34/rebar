const DEFAULT_OPTIONS = {
  toString: f => f.toString()
};

function memoize(options = DEFAULT_OPTIONS) {
  let cache = {};

  const wrapper = (...args) => {
    const handle = options.toString(...args);
    if (handle in cache) return cache[handle];

    cache[handle] = options.handler(...args);
    return cache[handle];
  };

  wrapper.clear = () => {
    cache = {};
  };

  return wrapper;
}

export default memoize;

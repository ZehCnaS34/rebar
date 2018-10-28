const DEFAULT_OPTIONS = {
  toString: f => {
    return f.toString();
  }
};

function memoize(options = DEFAULT_OPTIONS) {
  let cache = {};
  options = { ...options, ...DEFAULT_OPTIONS };

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

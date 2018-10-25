function curry(argCount, fn) {
  function implementation(fn) {
    return function impl(...args) {
      return args.length >= argCount
        ? fn(...args)
        : (...rest) => implementation(...args.concat(rest));
    };
  }

  return typeof fn === "function" ? implementation(fn) : implementation;
}

export default curry;

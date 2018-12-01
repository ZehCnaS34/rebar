import * as c from "./constant";

export const registerField = name => ({
  type: c.REGISTER_FIELD,
  name
});

export const unregisterField = name => ({
  type: c.UNREGISTER_FIELD,
  name
});

export const updateField = (name, value) => ({
  type: c.UPDATE_FIELD,
  name,
  value
});

export const resetField = name => ({
  type: c.RESET_FIELD,
  name
});

import * as c from "./constant";

export const setupFirebase = () => ({
  type: c.SETUP_FIREBASE
});

export const createPost = content => ({
  type: c.CREATE_POST,
  content
});

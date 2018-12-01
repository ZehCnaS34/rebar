import { createSelector } from "reselect";
import * as R from "ramda";

export const posts = state => state.feed.posts.toJS();
export const postOrder = state => state.feed.postOrder.toJS();

export const orderedPosts = createSelector(
  posts,
  postOrder,
  (posts, postOrder) => {
    return postOrder.map(postKey => posts[postKey]);
  }
);

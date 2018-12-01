import { Map, List } from "immutable";
import { combineReducers } from "redux";
import * as c from "./constant";

function posts(state = Map(), action) {
  switch (action.type) {
    case c.MODIFY_POST:
    case c.ADD_POST:
      return state.set(action.key, action.post);
    case c.REMOVE_POST:
      return state.remove(action.key);
    default:
      return state;
  }
}

function postOrder(state = List(), action) {
  switch (action.type) {
    case c.ADD_POST:
      return state.push(action.key);
    case c.REMOVE_POST:
      return state.remove(state.indexOf(action.key));
    default:
      return state;
  }
}

export default combineReducers({
  postOrder,
  posts
});

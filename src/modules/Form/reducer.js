import { Map } from "immutable";
import * as c from "./constant";

const initialState = Map({});

export default function(state = initialState, action) {
  switch (action.type) {
    case c.RESET_FIELD:
    case c.REGISTER_FIELD:
      return state.set(action.name, Map({ value: "" }));
    case c.UNREGISTER_FIELD:
      return state.remove(action.name);
    case c.UPDATE_FIELD:
      return state.set(
        action.name,
        state.get(action.name).set("value", action.value)
      );
    default:
      return state;
  }
}

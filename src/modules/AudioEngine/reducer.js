import { SET_VOLUME } from "./constants";

const initialState = {
  volume: 75
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_VOLUME:
      return { ...state, volume: action.target };
    default:
      return state;
  }
}

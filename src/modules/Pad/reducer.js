import { TAP, NOISE, DOWN_OCTAVE, UP_OCTAVE } from "./constants";

const initialState = {
  rootNote: 44,
  keys: [0, 0, 0, 0, 0, 0, 0],
  isTapping: false
};

const padReducer = (state = initialState, action) => {
  switch (action.type) {
    case UP_OCTAVE:
      return { ...state, rootNote: state.rootNote + 1 };
    case DOWN_OCTAVE:
      return { ...state, rootNote: state.rootNote - 1 };
    case TAP:
      return { ...state, isTapping: true };
    case NOISE:
      return { ...state, isTapping: false };
    default:
      return state;
  }
};

export default padReducer;

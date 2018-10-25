import {
  TAP,
  NOISE,
  DOWN_OCTAVE,
  UP_OCTAVE,
  SET_SCALE,
  SET_KEY,
  SET_OCTAVE
} from "./constants";

const initialState = {
  rootNote: 44,
  key: "c",
  scale: "major",
  octave: 4,
  keys: [0, 0, 0, 0, 0, 0, 0],
  isTapping: false
};

const padReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SCALE:
      return { ...state, scale: action.scale };
    case SET_KEY:
      return { ...state, key: action.key };
    case SET_OCTAVE:
      return { ...state, octave: action.octave };
    case UP_OCTAVE:
      return { ...state, octave: state.octave + 1 };
    case DOWN_OCTAVE:
      return { ...state, octave: state.octave - 1 };
    case TAP:
      return { ...state, isTapping: true };
    case NOISE:
      return { ...state, isTapping: false };
    default:
      return state;
  }
};

export default padReducer;

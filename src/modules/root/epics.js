import { combineEpics } from "redux-observable";
import * as audioEngineEpics from "../AudioEngine/epics";
import * as padEpics from "../Pad/epics";

export default combineEpics(
  ...Object.values(padEpics),
  ...Object.values(audioEngineEpics)
);

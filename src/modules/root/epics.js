import { combineEpics } from "redux-observable";
import * as audioEngineEpics from "../AudioEngine/epics";
import * as padEpics from "../Pad/epics";
import { epics as feedEpics } from "../Feed";

export default combineEpics(
  ...Object.values(padEpics),
  ...Object.values(audioEngineEpics),
  feedEpics
);

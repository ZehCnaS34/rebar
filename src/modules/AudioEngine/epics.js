import { filter, map } from "rxjs/operators";
import ENGINE from "./engine";
import { SET_VOLUME } from "./constants";

const noop = { type: "NOOP" };

export const setVolumeEpic = action$ =>
  action$.pipe(
    filter(action => action.type === SET_VOLUME),
    map(action => {
      ENGINE.volumePercent = action.target / 100;
      return noop;
    }),
    filter(() => false)
  );

import { filter, map } from "rxjs/operators";
import ENGINE from "./engine";
import { SET_VOLUME } from "./constants";
import curry from "../utils/curry";

const noop = { type: "NOOP" };

const percentage = curry(2, function percentage(divisor, action) {
  ENGINE.volumePercent = +action.target / divisor;
  return noop;
});

export const setVolumeEpic = action$ =>
  action$.pipe(
    filter(action => action.type === SET_VOLUME),
    map(percentage(100)),
    filter(() => false)
  );

// @flow
import { ofType } from "redux-observable";
import { REGISTER_KEYS, PLAY, STOP, SET_KEY, SET_SCALE } from "./constants";
import { map, filter } from "rxjs/operators";
import { keyCache, key, minor } from "../AudioEngine/theory";
import { playing, stopped } from "./action";

export const registerKeysEpic = action$ =>
  action$.pipe(
    ofType(REGISTER_KEYS),
    map(action => action.keys.map(keyCache)),
    filter(() => false)
  );

export const setScaleEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_SCALE),
    map(action => {}),
    filter(() => false)
  );

export const playEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLAY),
    map(action => {
      const {
        value: {
          pad: { octave, key: k, scale }
        }
      } = state$;
      const tag = `${k}${octave}`;
      const chan = keyCache(action.note);
      chan.source.frequency.value = key(tag, scale)[action.note];
      console.log({ tag, freq: key(tag, scale)[action.note] });
      chan.volume = 0.5;
      return playing(action.note);
    })
  );

export const stopEpic = action$ =>
  action$.pipe(
    ofType(STOP),
    map(action => {
      const chan = keyCache(action.note);
      chan.volume = 0.0;
      return stopped(action.note);
    })
  );

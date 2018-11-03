// @flow
import { ofType } from "redux-observable";
import {
  REGISTER_KEYS,
  PLAY,
  STOP,
  SET_KEY,
  SET_SCALE,
  FETCH_MIDI_INFO
} from "./constants";
import { map, filter, concatAll } from "rxjs/operators";
import { keyCache, key, minor, getNote } from "../AudioEngine/theory";
import { playing, stopped, play, stop } from "./action";
import { midiAccess } from "../AudioEngine/midi";
import { of, fromEvent } from "rxjs";

const KEY_MAP = (function() {
  const output = {};

  for (let i = 0, k = 44; i <= 7; i++, k++) {
    output[k] = i;
  }

  return output;
})();

const clog = filter(() => false);

export const setupMIDIInfoEpic = action$ =>
  action$.pipe(
    filter(() => false), // NOTE: issue when middi access fails.
    ofType(FETCH_MIDI_INFO),
    map(action => midiAccess()),
    concatAll(),
    map(access => access.inputs.values().next().value),
    map(input => fromEvent(input, "midimessage")),
    concatAll(),
    map(message => {
      const [action, key, intensity] = message.data;
      if (intensity) {
        switch (key) {
          case 44:
          case 45:
          case 46:
          case 47:
          case 48:
          case 49:
          case 50:
            // case 51:
            return play(KEY_MAP[key]);
          default:
            console.log({ key });
            return { type: "NOOP" };
        }
      } else {
        switch (key) {
          case 44:
          case 45:
          case 46:
          case 47:
          case 48:
          case 49:
          case 50:
            // case 51:
            return stop(KEY_MAP[key]);
          default:
            console.log({ key });
            return { type: "NOOP" };
        }
      }
    })
  );

export const registerKeysEpic = action$ =>
  action$.pipe(
    ofType(REGISTER_KEYS),
    map(action => action.keys.map(keyCache)),
    clog
  );

export const setScaleEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_SCALE),
    map(action => {}),
    clog
  );

export const playEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLAY),
    map(action => {
      const {
        value: {
          pad: { octave, key: k, scale, source }
        }
      } = state$;
      const rootNote = `${k}${octave}`;
      const chan = keyCache(action.note);
      const _k = getNote(rootNote, action.note, scale);
      chan.source.type = source;
      chan.source.frequency.value = _k.frequency;
      chan.volume = 0.5;
      return playing(action.note);
    })
  );

export const stopEpic = action$ =>
  action$.pipe(
    ofType(STOP),
    map(action => {
      const chan = keyCache(action.note);
      console.log({ chan });
      chan.volume = 0.0;
      return stopped(action.note);
    })
  );

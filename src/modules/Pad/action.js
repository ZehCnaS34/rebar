// @flow
// import { interval, iif } from "rxjs";
import { filter, mapTo, mergeMap, map } from "rxjs/operators";
import {
  TAP,
  NOISE,
  STOP,
  STOPPED,
  PLAY,
  PLAYING,
  DOWN_OCTAVE,
  UP_OCTAVE,
  REGISTER_KEYS,
  SET_SCALE,
  SET_KEY,
  FETCH_MIDI_INFO,
  SET_SOURCE
} from "./constants";
import ENGINE, { Channel } from "../AudioEngine";
import { ofType } from "redux-observable";

const forceToPercent = (force: number): number => {
  return force / 127;
};

export const tap = () => ({ type: TAP });

export const play = (note: number) => ({ type: PLAY, note });
export const playing = (note: number) => ({ type: PLAYING, note });

export const stop = (note: number) => ({ type: STOP, note });
export const stopped = (note: number) => ({ type: STOPPED, note });

export const downOctave = () => ({ type: DOWN_OCTAVE });

export const upOctave = (octave: number) => ({ type: UP_OCTAVE, octave });

export const setScale = (scale: string) => ({ type: SET_SCALE, scale });

export const setSource = (source: string) => ({ type: SET_SOURCE, source });

export const setKey = (key: string) => ({ type: SET_KEY, key });

export const registerKeys = (keys: Array<number> = []) => ({
  type: REGISTER_KEYS,
  keys
});

export const fetchMIDIInfo = () => ({
  type: FETCH_MIDI_INFO
});

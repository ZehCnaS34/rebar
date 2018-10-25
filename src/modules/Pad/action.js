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
  SET_KEY
} from "./constants";
import ENGINE, { Channel } from "../AudioEngine";
import { ofType } from "redux-observable";

const forceToPercent = (force: number): number => {
  return force / 127;
};

// if (navigator.requestMIDIAccess)
//   navigator.requestMIDIAccess().then(access => {
//     access.inputs.forEach(input => {
//       input.onmidimessage = e => {
//         const [action, note, force] = e.data;
//         const chan = keyCache(note);
//         chan.source.frequency.value = FREQUENCIES[note];
//         switch (action) {
//           case 144: // play
//             console.log(action, note, force);
//             console.log(chan, forceToPercent(force));
//             // chan.volume = 0.3;
//             chan.volumePercent = forceToPercent(force);
//             break;
//           case 128: // stop
//             chan.volume = 0;
//             break;
//           default:
//             console.log(e.data);
//         }
//       };
//       console.log(input);
//     });
//     access.onstatechange = function(e) {};
//   });

// function get() {
//   let KEY = key(0, major);
//   return KEY[Math.floor(Math.random() * KEY.length)];
// }

export const tap = () => ({ type: TAP });

export const play = (note: number) => ({ type: PLAY, note });
export const playing = (note: number) => ({ type: PLAYING, note });

export const stop = (note: number) => ({ type: STOP, note });
export const stopped = (note: number) => ({ type: STOPPED, note });

export const downOctave = () => ({ type: DOWN_OCTAVE });

export const upOctave = (octave: number) => ({ type: UP_OCTAVE, octave });

export const setScale = (scale: string) => ({ type: SET_SCALE, scale });

export const setKey = (key: string) => ({ type: SET_KEY, key });

export const registerKeys = (keys: Array<number> = []) => ({
  type: REGISTER_KEYS,
  keys
});

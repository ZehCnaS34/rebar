// import { interval, iif } from "rxjs";
import { filter, mapTo, mergeMap, map } from "rxjs/operators";
import { TAP, NOISE, STOP, PLAY, DOWN_OCTAVE, UP_OCTAVE } from "./constants";
import ENGINE from "../AudioEngine";

const FREQUENCIES = [
  4186.01,
  3951.07,
  3729.31,
  3520.0,
  3322.44,
  3135.96,
  2959.96,
  2793.83,
  2637.02,
  2489.02,
  2349.32,
  2217.46,
  2093.0,
  1975.53,
  1864.66,
  1760.0,
  1661.22,
  1567.98,
  1479.98,
  1396.91,
  1318.51,
  1244.51,
  1174.66,
  1108.73,
  1046.5,
  987.767,
  932.328,
  880.0,
  830.609,
  783.991,
  739.989,
  698.456,
  659.255,
  622.254,
  587.33,
  554.365,
  523.251,
  493.883,
  466.164,
  440.0,
  415.305,
  391.995,
  369.994,
  349.228,
  329.628,
  311.127,
  293.665,
  277.183,
  261.626,
  246.942,
  233.082,
  220.0,
  207.652,
  195.998,
  184.997,
  174.614,
  164.814,
  155.563,
  146.832,
  138.591,
  130.813,
  123.471,
  116.541,
  110.0,
  103.826,
  97.9989,
  92.4986,
  87.3071,
  82.4069,
  77.7817,
  73.4162,
  69.2957,
  65.4064,
  61.7354,
  58.2705,
  55.0,
  51.9131,
  48.9994,
  46.2493,
  43.6535,
  41.2034,
  38.8909,
  36.7081,
  34.6478,
  32.7032,
  30.8677,
  29.1352,
  27.5
];
FREQUENCIES.reverse();

function createKeyCache() {
  const cache = {};
  return function(note) {
    if (note in cache) {
      return cache[note];
    }

    cache[note] = ENGINE.createChannel();

    const oscillator = ENGINE.ctx.createOscillator();
    cache[note].volume = 0;
    cache[note].source = oscillator;
    return cache[note];
  };
}

const keyCache = createKeyCache();

const major = [0, 2, 4, 5, 7, 9, 11];
const minor = [0, 2, 3, 5, 7, 8, 10];

function key(note, variant = major) {
  return variant.map(dist => FREQUENCIES[note + dist]);
}

window.theory = { major, minor, key };

navigator.requestMIDIAccess().then(access => {
  access.inputs.forEach(input => {
    input.onmidimessage = e => {
      const [action, note, force] = e.data;
      const chan = keyCache(note);
      chan.source.frequency.value = FREQUENCIES[note];
      switch (action) {
        case 144: // play
          console.log(action, note, force);
          chan.volume = 0.3;
          break;
        case 128: // stop
          chan.volume = 0;
          break;
        default:
          console.log(e.data);
      }
    };
    console.log(input);
  });
  access.onstatechange = function(e) {};
});

function randomFrequency() {
  let KEY = key(0, major);
  return KEY[Math.floor(Math.random() * KEY.length)];
}

export const tapEpic = action$ =>
  action$.pipe(
    filter(action => action.type === TAP),
    map(x => {
      const chan = keyCache(0);
      chan.volume = 0.1;
      return { type: NOISE };
    })
  );

export const noiseEpic = action$ =>
  action$.pipe(
    filter(action => action.type === NOISE),
    map(x => {
      const chan = keyCache(0);
      chan.volume = 0.0;
      return { type: "NOOP" };
    })
  );

export const playEpic = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === PLAY),
    mergeMap(action =>
      state$.pipe(
        map(state => {
          const chan = keyCache(action.note);
          chan.source.frequency.value = key(
            state.pad.rootNote + action.note,
            major
          )[action.note];
          chan.volume = 0.1;
        }),
        mapTo({ type: "NOOP" })
      )
    )
  );

export const stopEpic = action$ =>
  action$.pipe(
    filter(action => action.type === STOP),
    map(action => {
      const chan = keyCache(action.note);
      chan.volume = 0.0;
      return { type: "NOOP" };
    })
  );

export const tap = () => ({ type: TAP });

export const play = note => ({ type: PLAY, note });

export const stop = note => ({ type: STOP, note });

export const downOctave = () => ({ type: DOWN_OCTAVE });
export const upOctave = () => ({ type: UP_OCTAVE });

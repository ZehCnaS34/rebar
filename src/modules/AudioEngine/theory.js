import ENGINE, { Pulse, Measure } from "./engine";
import memoize from "../utils/memoize";
import { publishBehavior } from "rxjs/operators";

const MIDDLE_C = 261.626;

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
  261.626, // c4
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
window.FREQUENCIES = FREQUENCIES;

const notes = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];

const KEY_TABLE = (window.KEY_TABLE = (function buildKeyTable() {
  const output = {};
  for (let o = 0, on = 1; o < 88; o += 12, on++) {
    for (let k = 0; k < 12; k++) {
      output[notes[k] + on] = o + k;
    }
  }
  return output;
})());

function getKey(note: number) {
  const channel = ENGINE.createChannel();
  channel.volume = 0;
  ENGINE.masterVolume.gain.value = 0;

  const oscillator = ENGINE.ctx.createOscillator();
  channel.source = oscillator;
  oscillator.start();
  ENGINE.masterVolume.gain.value = 0.2;
  return channel;
}

export const keyCache = memoize({
  handler: getKey
});
window.keyCache = keyCache;

export const major = [0, 2, 4, 5, 7, 9, 11];
export const minor = [0, 2, 3, 5, 7, 8, 10];

export const cord = {
  major: [0, 4, 7],
  minor: []
};
window.cord = cord;

export function key(note, variant = major) {
  if (typeof variant === "string") {
    switch (variant) {
      case "minor":
        return minor.map(dist => FREQUENCIES[KEY_TABLE[note] + dist]);
      case "major":
        return major.map(dist => FREQUENCIES[KEY_TABLE[note] + dist]);
      default:
        throw Error("oh no");
    }
  } else {
    return variant.map(dist => FREQUENCIES[note + dist]);
  }
}

window.theory = { major, minor, key };

// cord
function playCord() {
  let fs = key(44, cord.major);
  let ps = (3).times(i => {
    const p = new Pulse(2000 / 2);
    p.source._source.load();
    window.p = p;
    p.source._source._source.frequency.value = fs[i];
    console.log(p);
    return p;
  });

  const m = new Measure();
  m.notes = ps;
  m.loop();
}

window.playCord = playCord;

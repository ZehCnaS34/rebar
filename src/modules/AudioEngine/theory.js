import ENGINE, { Pulse, Measure, Times } from "./engine";
import memoize from "../utils/memoize";
import * as R from "ramda";
import { publishBehavior } from "rxjs/operators";
import curry from "../utils/curry";

function* cycle(lst) {
  let cursor = 0;
  while (true) {
    yield lst[cursor];
    cursor = (cursor + 1) % lst.length;
  }
}

window.cycle = cycle;
const MIDDLE_C = 261.626;

const omegaStep = 0.5017166822;
const omegaStart = 28.78665388;

const FREQUENCIES = (function() {
  return new Array(120)
    .fill(1)
    .reduce(freqs => [...freqs, freqs[freqs.length - 1] + omegaStep], [
      omegaStart
    ])
    .map(omega => Math.pow(10, omega / 20)); // convert omega to frequencies.
})();

const notes = ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"];
const flatNotes = [
  "a",
  "bb",
  "b",
  "c",
  "db",
  "d",
  "eb",
  "e",
  "f",
  "gb",
  "g",
  "ab"
];

const {
  KEY_TABLE,
  KEY_INDEX_TABLE,
  FREQUENCY_TABLE
} = (function buildKeyTable() {
  const output = {
    KEY_TABLE: {},
    KEY_INDEX_TABLE: {},
    FREQUENCY_TABLE: {}
  };
  for (
    let octaveStartNote = 0, octaveNumber = 1;
    octaveStartNote < 88;
    octaveStartNote += 12, octaveNumber++
  ) {
    for (let keyInOctave = 0; keyInOctave < 12; keyInOctave++) {
      output.KEY_TABLE[notes[keyInOctave] + octaveNumber] =
        octaveStartNote + keyInOctave;

      output.KEY_TABLE[flatNotes[keyInOctave] + octaveNumber] =
        octaveStartNote + keyInOctave;

      output.KEY_INDEX_TABLE[octaveStartNote + keyInOctave] = [
        notes[keyInOctave] + octaveNumber,
        flatNotes[keyInOctave] + octaveNumber
      ];

      output.FREQUENCY_TABLE = {};
    }
  }
  return output;
})();

window.KEY_TABLE = KEY_TABLE;
window.KEY_INDEX_TABLE = KEY_INDEX_TABLE;
window.FREQUENCIES = FREQUENCIES;

function getKey(note: number) {
  const channel = ENGINE.createChannel();
  channel.volume = 0;
  ENGINE.masterVolume.gain.value = 0;

  const oscillator = ENGINE.ctx.createOscillator();
  channel.source = oscillator;
  oscillator.type = "sawtooth";
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
export const ma = [0, 2, 2, 1, 2, 2, 2];

window.minor = minor;
window.R = R;

export const cord = {
  major: [0, 4, 7],
  minor: []
};
window.cord = cord;

// only supports unary functions
function pipe(...fns) {
  if (fns.length === 0) throw Error("pipe must take at least one function");
  return arg => fns.reduce((v, f) => f(v), arg);
}

window.pipe = pipe;

const withFrequency = curry(2, (f, obj) => ({
  ...obj,
  frequency: f
}));

const frequencyFromKeyTable = curry(2, (note, dist) => ({
  frequency: FREQUENCIES[KEY_TABLE[note] + dist],
  note: KEY_INDEX_TABLE[KEY_TABLE[note] + dist][0]
}));

window.frequencyFromKeyTable = frequencyFromKeyTable;

const intoMap = curry(2, (key, data) => ({
  [key]: data
}));

window.intoMap = intoMap;

const withSample = curry(3, (source, sample, obj) => ({
  ...obj,
  source,
  sample
}));

const log = R.bind(console.log, console);

const show = R.tap(log);

const map = curry(2, (fn, v) => fn(v));

const setNote = curry(2, (note, obj) => ({ ...obj, note }));

const mergeIn = curry(2, (o1, o2) => ({ ...o2, ...o1 }));

export function key(note, variant = major) {
  if (typeof variant === "string") {
    switch (variant) {
      case "minor":
        return minor.map(pipe(frequencyFromKeyTable(note)));
      case "major":
        return major.map(pipe(frequencyFromKeyTable(note)));
      default:
        throw Error(`${variant} is not a supported variant.`);
    }
  } else {
    // broken
    return variant.map(dist => FREQUENCIES[note + dist]);
  }
}

export function getNote(rootNote, number, variant = "minor") {
  return key(rootNote, variant)[number];
}

window.theory = { major, minor, key };

// cord
function playCord() {
  let fs = key(44, cord.major);

  let ps = (3).times(i => {
    const p = new Pulse(Times.half);
    p.source._source.load();
    window.p = p;
    p.source._source._source.frequency.value = fs[i];
    return p;
  });

  const m = new Measure();
  m.notes = ps;
  m.loop();
}

window.playCord = playCord;

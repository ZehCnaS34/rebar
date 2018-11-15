import { Pluggable, Node } from "./base";
import { loadSample } from "../AudioEngine/loader";

// @flow

type Timing = number;

export const Times = {
  _bpm: 140,
  get measure(): Timing {
    return (1 / this._bpm) * 60 * 4 * 1000;
  },
  get whole(): Timing {
    return this.measure;
  },
  get half(): Timing {
    return this.measure / 2;
  },
  get third(): Timing {
    return this.measure / 3;
  },
  get quarter(): Timing {
    return this.measure / 4;
  },
  get eigth(): Timing {
    return this.measure / 8;
  },
  get sixteenth(): Timing {
    return this.measure / 16;
  },
  get thirtysecond(): Timing {
    return this.measure / 32;
  },
  get sixtyfourth(): Timing {
    return this.measure / 64;
  },
  get oneSixtyEigth(): Timing {
    return this.measure / 128;
  }
};

const delay = (ms = 0) =>
  new Promise(r => {
    setTimeout(() => {
      r();
    }, ms);
  });
const min = (...args: Array<number>): number => Math.min(...args);
const max = (...args: Array<number>): number => Math.max(...args);
const clamp = (value: number, floor: number, ceil: number): number =>
  max(min(ceil, value), floor);

interface Destination {
  get target(): AudioNode;
}

interface Sourceable {
  load(): void;
  loaded: boolean;
  connect(target: Destination): void;
}

interface Playable {
  get duration(): number;
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  pause(): Promise<boolean>;
}

interface IDable {
  id: string;
}

class Gain implements Destination, Node {
  _maxVolume = 0.5;
  _gain: GainNode;
  constructor() {
    this._gain = ENGINE.ctx.createGain();
    this._gain.connect(ENGINE.masterVolume);
  }

  set volumePercent(v: number): void {
    v = clamp(v, 0, 1);
    this.volume = this._maxVolume * v;
  }

  set volume(value: number) {
    this._gain.gain.setTargetAtTime(
      value,
      this._gain.context.currentTime,
      0.015
    );
  }

  get volume(): number {
    return this._gain.gain.value;
  }

  get target(): AudioNode {
    return this._gain;
  }
}

interface VolumeAdjustable {
  gain: Gain;
}

class Sample {
  gain: GainNode;
  source: AudioBufferSourceNode;
  _buffer: AudioBuffer;
  _ready: boolean;

  constructor() {
    this.gain = ENGINE.ctx.createGain();
    this.setupSource();
    this.connect();
  }

  setupSource() {
    this.source = ENGINE.ctx.createBufferSource();
    this.source.onended = () => {
      const source = ENGINE.ctx.createBufferSource();
      source.buffer = this.buffer;
      source.onended = this.source.onended;
      this.source = source;
      this.connect();
    };
  }

  connect() {
    this._ready = true;
    this.source.connect(this.gain);
    this.gain.connect(ENGINE.masterVolume);
  }

  play() {
    if (!this._ready) return;
    this._ready = false;
    this.source.start();
  }

  set buffer(value) {
    this._buffer = value;
    this.source.buffer = value;
  }

  get buffer() {
    return this._buffer;
  }

  async loadSample(sampleName) {
    this.buffer = await loadSample(sampleName);
  }
}

window.Sample = Sample;

class Note<T: Sourceable>
  implements Playable, VolumeAdjustable, IDable, Sourceable {
  id = "Awesome";
  gain: Gain;
  _source: T;
  _duration: number;
  loaded: boolean = false;

  constructor(source: T) {
    this.gain = new Gain();
    this.gain.volume = 0;
    this._source = source;
  }

  load() {}

  async start() {
    this.gain.volume = 0.3;
    if (!this._source.loaded) {
      this.loaded = true;
      this._source.load();
      this._source.connect(this.gain);
    }
    return false;
  }

  async stop() {
    this.gain.volume = 0.0;
    return false;
  }

  async pause() {
    return false;
  }

  get duration() {
    return this._duration;
  }

  set duration(value) {
    this._duration = value;
  }

  connect(destination) {
    this.gain._gain.connect(destination.target);
  }
}

window.Note = Note;

class ONote implements Sourceable {
  _source: ?OscillatorNode;
  loaded = false;

  load() {
    if (this._source) return;
    this.loaded = true;
    this._source = ENGINE.ctx.createOscillator();
    this._source.start();
    this.setSawtooth();
  }

  setSawtooth() {
    if (this._source) {
      this._source.type = "sawtooth";
    }
  }

  connect(destination: Destination) {
    if (this._source) {
      this._source.connect(destination.target);
    }
  }
}

window.ONote = ONote;

export class Pulse implements Playable {
  source: Note<ONote> = new Note(new ONote());
  _delay: number = 500;
  _duration: number = 500;

  constructor(duration = 500, delay = 500) {
    this._delay = delay;
    this._duration = duration;
  }

  async start() {
    this.source.load();
    this.source.start();
    return false;
  }

  async stop() {
    this.source.stop();
    return false;
  }

  async pause() {
    return false;
  }

  async pulse() {
    await delay(this._delay);
    this.start();
    await delay(this.duration);
    this.stop();
  }

  get duration() {
    return this._duration;
  }
}

window.Pulse = Pulse;

export class Measure implements Playable, IDable {
  id = "hi";
  _notes: Array<Pulse> = [];
  _playing = false;
  _loopHandle: ?IntervalID;

  constructor() {
    const { quarter: qn, oneSixtyEigth: osn } = Times;
    this._notes = [
      new Pulse(osn, qn * 0),
      new Pulse(osn, qn * 1),
      new Pulse(osn, qn * 2),
      new Pulse(osn, qn * 3)
    ];
  }

  set notes(value) {
    this._notes = value;
  }

  get notes() {
    return this._notes;
  }

  async start() {
    this.notes.forEach(pulse => pulse.pulse());
    await delay(this.duration);
    return false;
  }

  async stop() {
    this.notes.forEach(pulse => pulse.stop());
    if (this._loopHandle) clearInterval(this._loopHandle);
    return false;
  }

  async loop() {
    this.start();
    this._loopHandle = setInterval(() => {
      this.start();
    }, Times.measure);
  }

  async pause() {
    throw Error("NOT IMPLEMENTED");
  }

  get duration() {
    return Times.measure;
  }
}

window.Measure = Measure;

function setGainVolume(gain: GainNode, value: number) {
  gain.gain.setTargetAtTime(value, gain.context.currentTime, 0.015);
}

export class EffectChain<T: AudioNode> {
  _channel: Channel;
  _effects: Array<T> = [];

  constructor(channel: Channel) {
    this._channel = channel;
    let gain = channel.ctx.createGain();
    channel.source = gain;
    this._effects.push(gain);
  }

  push(newEffect) {
    if (this._effects.includes(newEffect))
      throw Error("Cannot include same instance of effect in the chain.");
    const lastEffect = this._effects[this._effects.length - 1];
    this._channel.source = newEffect;
    lastEffect.connect(newEffect);
    this._effects.push(newEffect);
  }
}
window.EffectChain = EffectChain;

export class Channel {
  gain: GainNode;
  _source: ?AudioNode;
  _maxVolume = 0.5;
  _volume = 0;

  get ctx() {
    return this.gain.context;
  }

  constructor(ctx: AudioContext) {
    this.gain = ctx.createGain();
    this.volume = this._volume;
    this._source = null;
  }

  set volumePercent(v: number): void {
    v = clamp(v, 0, 1);
    this.volume = this._maxVolume * v;
  }

  get volume() {
    return this.gain.gain.value;
  }

  set volume(value: number) {
    this._volume = value;
    return setGainVolume(this.gain, value);
  }

  get source() {
    return this._source;
  }

  set source(value: AudioNode) {
    if (this._source != null) {
      this._source.disconnect();
    }

    this._source = value;
    this._source.connect(this.gain);
  }
}

class AudioEngine {
  ctx: AudioContext;
  masterVolume: GainNode;
  _maxVolume: number = 0.5;
  _minVolume: number = 0.0;
  _channels: Array<Channel> = [];

  constructor() {
    this.ctx = new AudioContext();
    this.masterVolume = this.ctx.createGain();
    this.volume = this._maxVolume * 0.75;
    this.masterVolume.connect(this.ctx.destination);
  }

  set volumePercent(v: number): void {
    v = clamp(v, 0, 1);
    this.volume = this._maxVolume * v;
  }

  get volume(): number {
    return this.masterVolume.gain.value;
  }

  set volume(v: number): void {
    setGainVolume(
      this.masterVolume,
      clamp(v, this._minVolume, this._maxVolume)
    );
  }

  createChannel(): Channel {
    const chan = new Channel(this.ctx);
    chan.gain.connect(this.masterVolume);
    this._channels.push(chan);
    return chan;
  }
}

Number.prototype.times = function(cb) {
  let output = [];
  for (let i = 0; i < this; i++) {
    output.push(cb(i));
  }
  return output;
};

// window.TEST = () => {
//   let channels = (7).times(() => ENGINE.createChannel());
//   let effectChains = channels.map(channel => {
//     return new EffectChain(channel);
//   });
// };

const ENGINE = new AudioEngine();
export default ENGINE;
window.ENGINE = ENGINE;

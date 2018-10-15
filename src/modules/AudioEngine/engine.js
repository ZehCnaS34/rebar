// @flow

let barTime = (1 / 140) * 60 * 4 * 1000;

let fn = barTime;
let hn = barTime / 2;
let qn = barTime / 4;
let en = barTime / 8;
let sn = barTime / 16;
let tn = barTime / 32;
let ssn = barTime / 64;
let osn = barTime / 128;

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

interface VolumeAdjustable {
  gain: Gain;
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

class Gain implements Destination {
  _gain: GainNode;
  constructor() {
    this._gain = ENGINE.ctx.createGain();
    this._gain.connect(ENGINE.masterVolume);
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

class Pulse implements Playable {
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

class Measure implements Playable, IDable {
  gain = new Gain();
  id = "hi";
  _notes: Array<Pulse> = [];
  _playing = false;

  constructor() {
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
    if (this._playing) return true;
    this._playing = true;
    this.notes.forEach(pulse => pulse.pulse());
    await delay(this.duration);
    this._playing = false;
    return false;
  }

  async stop() {
    this.notes.forEach(pulse => pulse.stop());
    return false;
  }

  async loop() {
    this.start();
    setInterval(() => {
      this.start();
    }, 0);
  }

  async pause() {
    throw Error("NOT IMPLEMENTED");
  }

  get duration() {
    return barTime;
  }
}

window.Measure = Measure;

function setGainVolume(gain: GainNode, value: number) {
  gain.gain.setTargetAtTime(value, gain.context.currentTime, 0.015);
}

class Channel {
  gain: GainNode;
  _source: ?AudioNode;

  constructor(ctx: AudioContext) {
    this.gain = ctx.createGain();

    this._source = null;
  }

  get volume() {
    return this.gain.gain.value;
  }

  set volume(value: number) {
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
  _maxVolume: number;
  _minVolume: number;
  _channels: Array<Channel>;

  constructor() {
    this.ctx = new AudioContext();
    this.masterVolume = this.ctx.createGain();
    this._maxVolume = 0.5;
    this._minVolume = 0.0;
    this._channels = [];
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

const ENGINE = new AudioEngine();
export default ENGINE;
window.ENGINE = ENGINE;

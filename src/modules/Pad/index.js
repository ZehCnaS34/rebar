import React from "react";
import "./Pad.css";
import { Observable, of, fromEvent } from "rxjs";
import ENGINE from "../AudioEngine";
import { connect } from "react-redux";
import {
  tap,
  play,
  stop,
  downOctave,
  upOctave,
  registerKeys,
  setKey,
  setScale,
  setSource,
  fetchMIDIInfo
} from "./action";
import { mergeMap, map, concatAll } from "rxjs/operators";
import { merge } from "emotion";
export * from "./action";
export { default as padReducer } from "./reducer";

class MNumber extends Number {
  static get [Symbol.species]() {
    return Number;
  }

  get measure() {
    return 2000;
  }

  get quarter() {
    return this.measure / 4;
  }
}

window.MNumber = MNumber;

const keyCodeToNote = {
  51: 0,
  52: 1,
  53: 2,
  54: 3,
  55: 4,
  56: 5,
  57: 6
};

const NotePad = ({ onPlay, onStop, children }) => (
  <div
    className="pad"
    onTouchStart={onPlay}
    onTouchEnd={onStop}
    onMouseUp={onStop}
    onMouseDown={onPlay}
  >
    {children}
  </div>
);

class Pad extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pressing = false;
  }

  componentDidMount() {
    this.props.registerKeys([0, 1, 2, 3, 4, 5, 6]);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keydown", this.onKeyDown);
    this.props.setupMIDIInfo();
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = e => {
    const note = keyCodeToNote[e.keyCode];
    if (note != null) this.props.play(note)();
  };

  onKeyUp = e => {
    const note = keyCodeToNote[e.keyCode];
    if (note != null) this.props.stop(note)();
  };

  onSetKey = e => this.props.setKey(e.target.value);

  onSetScale = e => this.props.setScale(e.target.value);

  onSetSource = e => this.props.setSource(e.target.value);

  render() {
    const { rootNote: root, pad } = this.props;
    return (
      <div className="pads">
        <div className="pad-container">
          <NotePad
            onPlay={this.props.play(0)}
            onStop={this.props.stop(0)}
            children={pad.keys[0].source}
          />
          <NotePad
            onPlay={this.props.play(1)}
            onStop={this.props.stop(1)}
            children={"two"}
          />
          <NotePad
            onPlay={this.props.play(2)}
            onStop={this.props.stop(2)}
            children={"three"}
          />
          <NotePad
            onPlay={this.props.play(3)}
            onStop={this.props.stop(3)}
            children={"four"}
          />
          <NotePad
            onPlay={this.props.play(4)}
            onStop={this.props.stop(4)}
            children={"five"}
          />
          <NotePad
            onPlay={this.props.play(5)}
            onStop={this.props.stop(5)}
            children={"six"}
          />
          <NotePad
            onPlay={this.props.play(6)}
            onStop={this.props.stop(6)}
            children={"seven"}
          />
        </div>
        <div className="control">
          <button onClick={this.props.downOctave}>down</button>
          <select value={this.props.pad.octave} onChange={this.props.onOctave}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
          <button onClick={this.props.upOctave}>up</button>
        </div>
        <div className="info">
          <select value={this.props.pad.key} onChange={this.onSetKey}>
            <option value={"a"}>A</option>
            <option value={"b"}>B</option>
            <option value={"c"}>C</option>
            <option value={"d"}>D</option>
            <option value={"e"}>E</option>
            <option value={"f"}>F</option>
            <option value={"g"}>G</option>
          </select>
          <select value={this.props.pad.scale} onChange={this.onSetScale}>
            <option value={"major"}>Major</option>
            <option value={"minor"}>Minor</option>
          </select>
          <select value={this.props.pad.source} onChange={this.onSetSource}>
            <option value={"sine"}>Sine</option>
            <option value={"sawtooth"}>Sawtooth</option>
            <option value={"square"}>Square</option>
            <option value={"triangle"}>Triangle</option>
          </select>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    pad: state.pad,
    tapping: state.pad.isTapping,
    rootNote: state.pad.rootNote
  };
}

function mapDispatch(dispatch) {
  return {
    setupMIDIInfo: () => dispatch(fetchMIDIInfo()),
    setSource: source => dispatch(setSource(source)),
    tap: () => dispatch(tap()),
    setKey: key => dispatch(setKey(key)),
    setScale: scale => dispatch(setScale(scale)),
    registerKeys: keys => dispatch(registerKeys(keys)),
    stop: note => e => {
      dispatch(stop(note));
    },
    play: note => e => {
      dispatch(play(note));
    },
    downOctave: () => dispatch(downOctave()),
    upOctave: () => dispatch(upOctave())
  };
}

export default connect(
  mapState,
  mapDispatch
)(Pad);

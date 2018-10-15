import React from "react";
import "./Pad.css";
import ENGINE from "../AudioEngine";
import { connect } from "react-redux";
import { tap, play, stop, downOctave, upOctave } from "./action";
export * from "./action";
export { default as padReducer } from "./reducer";

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
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = e => {
    if (this.pressing) return;
    this.pressing = true;
    console.log(e.keyCode);
    const note = keyCodeToNote[e.keyCode];
    if (note !== undefined) {
      console.log(note);
      this.props.play(note)();
    }
  };

  onKeyUp = e => {
    const note = keyCodeToNote[e.keyCode];
    this.pressing = false;
    if (note) {
      this.props.stop(note)();
    }
  };

  render() {
    const { rootNote: root } = this.props;
    console.log(this.props.tapping);
    return (
      <div className="pad-container">
        <button onClick={this.props.downOctave}>down</button>
        <NotePad
          onPlay={this.props.play(0)}
          onStop={this.props.stop(0)}
          children={"one"}
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
        <button onClick={this.props.upOctave}>up</button>
      </div>
    );
  }
}

function mapState(state) {
  return {
    tapping: state.pad.isTapping,
    rootNote: state.pad.rootNote
  };
}

function mapDispatch(dispatch) {
  return {
    tap: () => dispatch(tap()),
    stop: note => e => dispatch(stop(note)),
    play: note => e => dispatch(play(note)),
    downOctave: () => dispatch(downOctave()),
    upOctave: () => dispatch(upOctave())
  };
}

export default connect(
  mapState,
  mapDispatch
)(Pad);

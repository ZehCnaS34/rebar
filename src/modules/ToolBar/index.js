import React from "react";
import { connect } from "react-redux";
import "./ToolBar.css";
import { setVolume } from "../AudioEngine";

const Slot = ({ children }) => <div className="slot">{children}</div>;

const Volume = ({ volume, onChange }) => (
  <Slot>
    <input
      onChange={e => onChange(e.target.value)}
      type="range"
      value={volume}
      step={1}
      min={0}
      max={100}
    />
  </Slot>
);

class ToolBar extends React.Component {
  render() {
    return (
      <div className="tool-bar">
        <Volume volume={this.props.volume} onChange={this.props.setVolume} />
      </div>
    );
  }
}

const mapState = state => ({
  volume: state.audioEngine.volume
});

const mapDispatch = dispatch => ({
  setVolume: e => dispatch(setVolume(e))
});

export default connect(
  mapState,
  mapDispatch
)(ToolBar);

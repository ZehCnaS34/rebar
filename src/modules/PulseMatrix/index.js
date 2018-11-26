// @flow
import React from "react";
import "./PulseMatrix.css";

const BAR = 2000;
const QN = BAR / 4;

type PulseState = {
  speed: number,
  delay: number,
  duration: number
};

class Pulse extends React.Component<{}, PulseState> {
  lastTime: ?number;

  state = {
    speed: 500,
    delay: 0,
    duration: QN
  };

  style(x) {
    const offset = (this.state.delay / BAR) * 100;
    const left = (x * 100) / 7;
    return {
      top: `${offset}%`,
      left: `${left}%`
    };
  }

  update() {
    const now = Date.now();
    if (this.lastTime != null) {
      const delta = now - this.lastTime;

      this.setState({
        delay: (this.state.delay + (this.state.speed * delta) / 1000) % BAR
      });
      this.lastTime = Date.now();
    }
    requestAnimationFrame(this.update.bind(this));
  }

  componentDidMount() {
    this.lastTime = Date.now();
    this.update();
  }

  onMouseDown = e => {
    console.log(e);
  };

  render() {
    return (
      <>
        <div
          onDragStart={this.onMouseDown}
          style={this.style(0)}
          className="pulse"
        >
          0{" "}
        </div>
      </>
    );
  }
}

const Measure = () => (
  <div className="measure">
    <Pulse />
  </div>
);

class PulseMatrix extends React.Component<{}, {}> {
  render() {
    return (
      <div className="pulse-matrix">
        <Measure />
      </div>
    );
  }
}

export default PulseMatrix;

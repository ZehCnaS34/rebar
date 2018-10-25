import React, { Component } from "react";
import Pad from "./modules/Pad";
import ToolBar from "./modules/ToolBar";
import "./App.css";
import PulseMatrix from "./modules/PulseMatrix";

class App extends Component {
  render() {
    return (
      <div className="App">
        <PulseMatrix />
        <ToolBar />
        <Pad />
      </div>
    );
  }
}

export default App;

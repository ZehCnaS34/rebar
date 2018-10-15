import React, { Component } from "react";
import Pad from "./modules/Pad";
import ToolBar from "./modules/ToolBar";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ToolBar />
        <Pad />
      </div>
    );
  }
}

export default App;

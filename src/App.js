import React, { Component } from "react";
import Pad from "./modules/Pad";
import ToolBar from "./modules/ToolBar";
import "./App.css";
import PulseMatrix from "./modules/PulseMatrix";
import Feed from "./modules/Feed";
import { Row, Column, Item } from "./modules/Common/Components/Structure";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Row>
          <Feed />
          <Column>
            <PulseMatrix />
            <ToolBar />
            <Pad />
          </Column>
        </Row>
      </div>
    );
  }
}

export default App;

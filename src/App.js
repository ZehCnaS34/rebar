import React, { Component } from "react";
import Pad from "./modules/Pad";
import ToolBar from "./modules/ToolBar";
import PulseMatrix from "./modules/PulseMatrix";
import Feed from "./modules/Feed";
import { Row, Column, Item } from "./modules/Common/Components/Structure";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Row>
          <Feed />
          {/* <Item>
            <Column>
              <Item>
                <PulseMatrix />
              </Item>
              <Item>
                <ToolBar />
              </Item>
              <Item>
                <Pad />
              </Item>
            </Column>
          </Item> */}
        </Row>
      </div>
    );
  }
}

export default App;

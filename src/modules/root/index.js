import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

import { padReducer } from "../Pad";
import { audioEngineReducer } from "../AudioEngine";

import rootEpic from "./epics";

const rootReducer = combineReducers({
  pad: padReducer,
  audioEngine: audioEngineReducer
});
const epicMiddleware = createEpicMiddleware();

export const configureStore = () => {
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    composeEnhancer(
      applyMiddleware(
        epicMiddleware,
        createLogger({
          collapsed: true,
          diff: true
        })
      )
    )
  );

  epicMiddleware.run(rootEpic);

  window.store = store;

  return store;
};

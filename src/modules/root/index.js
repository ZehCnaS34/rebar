import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";

import { padReducer, tapEpic, noiseEpic, playEpic, stopEpic } from "../Pad";
import { audioEngineReducer, setVolumeEpic } from "../AudioEngine";

const rootEpic = combineEpics(
  tapEpic,
  noiseEpic,
  playEpic,
  stopEpic,
  setVolumeEpic
);
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

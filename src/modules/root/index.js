import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";
import sagaMiddlewareFactory from "redux-saga";

import { padReducer } from "../Pad";
import * as padEpics from "../Pad/epics";
import { audioEngineReducer } from "../AudioEngine";
import * as audioEngineEpics from "../AudioEngine/epics";

const sagaMiddleware = sagaMiddlewareFactory();

const rootEpic = combineEpics(
  ...[...Object.values(padEpics), ...Object.values(audioEngineEpics)]
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
        sagaMiddleware,
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

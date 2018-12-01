import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { createLogger } from "redux-logger";
import * as firebase from "firebase";

import { padReducer } from "../Pad";
import { audioEngineReducer } from "../AudioEngine";
import { reducer as feedReducer } from "../Feed";
import { reducer as formReducer } from "../Form";

import rootEpic from "./epics";

const rootReducer = combineReducers({
  pad: padReducer,
  audioEngine: audioEngineReducer,
  feed: feedReducer,
  form: formReducer
});

export const configureStore = () => {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyCxxR4n6KbWdJZV70c8JanazfSXALTG6a0",
    authDomain: "rebar-8f7ae.firebaseapp.com",
    databaseURL: "https://rebar-8f7ae.firebaseio.com/",
    projectId: "rebar-8f7ae",
    storageBucket: "rebar-8f7ae.appspot.com"
  });

  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const epicMiddleware = createEpicMiddleware({
    dependencies: { app, database: app.database }
  });

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

  window.app = app;
  window.store = store;

  epicMiddleware.run(rootEpic);

  return store;
};

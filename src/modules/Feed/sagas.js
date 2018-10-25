import { all, call, put, takeEvery } from "redux-saga/effects";

export function* loadFeed() {
  const action = yield takeEvery("ALEX");
  console.log("is awesome", { action });
  yield put({ type: "awesome" });
}

function* mainSaga() {
  const results = yield all([call(loadFeed)]);
  console.log({ results });
  yield put({ type: "bruh" });
}

export default mainSaga;

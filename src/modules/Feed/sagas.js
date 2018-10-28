import { all, call, put, takeEvery } from "redux-saga/effects";

export function* loadFeed() {
  const action = yield takeEvery("ALEX");
  yield put({ type: "awesome" });
}

function* mainSaga() {
  const results = yield all([call(loadFeed)]);
  yield put({ type: "bruh" });
}

export default mainSaga;

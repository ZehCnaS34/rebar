import { saga as feedSaga } from "../Feed";
import { showResults } from "redux-saga";
import { call, all, put } from "redux-saga/effects";

function* rootSaga(getState) {
  const results = yield all([call(feedSaga)]);
  yield put({ type: "this is wierd" });
}

export default rootSaga;

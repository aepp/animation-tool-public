import {call, fork, takeLatest} from 'redux-saga/effects';
import {showErrorMessage, showWarnMessage} from '../actions';

function* handleShowErrorMessage(action) {
  yield call(
    alert,
    `ERROR --- ${action.payload || ' Something went wrong...'}`
  );
}
function* handleShowWarnMessage(action) {
  yield call(alert, `WARNING --- ${action.payload}`);
}

function* watchShowErrorMessage() {
  yield takeLatest(showErrorMessage.type, handleShowErrorMessage);
}
function* watchShowWarnMessage() {
  yield takeLatest(showWarnMessage.type, handleShowWarnMessage);
}

function* rootSaga() {
  yield fork(watchShowErrorMessage);
  yield fork(watchShowWarnMessage);
}

export default rootSaga;

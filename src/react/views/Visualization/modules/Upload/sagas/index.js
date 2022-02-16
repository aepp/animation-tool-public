import {put, takeLatest, fork} from 'redux-saga/effects';
import {SET_DATASET_FILE, SET_DATASET_FILE_URL} from '../actions';

function* handleSelectDataSetFile(action) {
  const {
    payload: {file}
  } = action;
  if (!file) return;

  yield put({
    type: SET_DATASET_FILE_URL,
    payload: {url: window.URL.createObjectURL(file)}
  });
}

function* watchSelectDataSetSaga() {
  yield takeLatest(SET_DATASET_FILE, handleSelectDataSetFile);
}

function* rootSaga() {
  yield fork(watchSelectDataSetSaga);
}

export default rootSaga;

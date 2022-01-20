import {put, takeLatest, fork} from 'redux-saga/effects';
import {ADD_DATASET_FILE, SET_DATASET_FILE_URL} from '../actions';

function* handleFileUpload(action) {
  const {
    payload: {file}
  } = action;

  yield put({
    type: SET_DATASET_FILE_URL,
    payload: {url: window.URL.createObjectURL(file)}
  });
}

function* watchAddDataSetSaga() {
  yield takeLatest(ADD_DATASET_FILE, handleFileUpload);
}

function* rootSaga() {
  yield fork(watchAddDataSetSaga);
}

export default rootSaga;

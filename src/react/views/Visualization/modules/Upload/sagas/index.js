import {put, takeLatest, fork, select} from 'redux-saga/effects';
import {setDataSetFile, setDataSetFileUrl} from '../actions';
import {selectDataSetFileUrl} from '../reducers';

function* handleSelectDataSetFile(action) {
  const file = action.payload;
  if (!file) return;

  const currentUrl = yield select(selectDataSetFileUrl);
  if (currentUrl) URL.revokeObjectURL(currentUrl);

  yield put(setDataSetFileUrl(window.URL.createObjectURL(file)));
}

function* watchSelectDataSetSaga() {
  yield takeLatest(setDataSetFile.type, handleSelectDataSetFile);
}

function* rootSaga() {
  yield fork(watchSelectDataSetSaga);
}

export default rootSaga;

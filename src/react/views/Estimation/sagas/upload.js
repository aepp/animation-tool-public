import {takeLatest, fork, put} from 'redux-saga/effects';
import {
  setEstimationVideoUrl,
  updateEstimationVideoFile
} from '../actions/estimationPlayback';

function* handleUpdateEstimationVideoFile(action) {
  const file = action.payload;
  if (file) yield put(setEstimationVideoUrl(window.URL.createObjectURL(file)));
}

function* watchUpdateEstimationVideoFile() {
  yield takeLatest(
    updateEstimationVideoFile.type,
    handleUpdateEstimationVideoFile
  );
}

function* rootSaga() {
  yield fork(watchUpdateEstimationVideoFile);
}
export default rootSaga;

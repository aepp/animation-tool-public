import {fork, takeLatest, select} from 'redux-saga/effects';
import {DOWNLOAD_DETECTION_RESULTS} from '../actions';
import {selectDetectedPoses, selectDetectionModel} from '../reducers';

function* handleDownloadResults() {
  const poses = yield select(selectDetectedPoses);
  const model = yield select(selectDetectionModel);
  const json = JSON.stringify({
    source: {
      id: 'tf',
      details:{
        model
      }
    },
    frames: poses
  });
  const blob = new Blob([json], {type: 'application/json'});

  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'poses.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function* watchDownloadResults() {
  yield takeLatest(DOWNLOAD_DETECTION_RESULTS, handleDownloadResults);
}

function* rootSaga() {
  yield fork(watchDownloadResults);
}

export default rootSaga;

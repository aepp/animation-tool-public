import {fork, takeLatest, select} from 'redux-saga/effects';
import {DataSourceType} from '../../../../config/constants';
import {downloadEstimationResult} from '../actions/estimationResult';
import {selectDetectedPoses, selectDetectionModel} from '../reducers';

function* handleDownloadResults() {
  const poses = yield select(selectDetectedPoses);
  const model = yield select(selectDetectionModel);
  const json = JSON.stringify({
    source: {
      id: DataSourceType.DATA_SOURCE_TF,
      details: {
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
  URL.revokeObjectURL(href);
}

function* watchDownloadResults() {
  yield takeLatest(downloadEstimationResult.type, handleDownloadResults);
}

function* rootSaga() {
  yield fork(watchDownloadResults);
}

export default rootSaga;

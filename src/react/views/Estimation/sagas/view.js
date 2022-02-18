import {fork, put, select, takeLatest} from 'redux-saga/effects';
import {cleanupEstimationView} from '../actions/view';
import {resetEstimationPlayback} from '../actions/estimationPlayback';
import {resetEstimation} from '../actions/estimation';
import {selectEstimationVideoUrl} from '../reducers';
import {LOCAL_STORAGE_POSE_DETECTOR_INSTANCE} from '../../../../config/constants';

function* handleCleanup() {
  console.log('cleanup estimation');
  const estimationVideoUrl = yield select(selectEstimationVideoUrl);
  if (estimationVideoUrl) URL.revokeObjectURL(estimationVideoUrl);

  yield put(resetEstimationPlayback());

  const detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];
  if (detector) {
    detector.reset();
    detector.dispose();
    window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE] = undefined;
  }
  yield put(resetEstimation());
}

function* watchCleanup() {
  yield takeLatest(cleanupEstimationView.type, handleCleanup);
}

function* rootSaga() {
  yield fork(watchCleanup);
}
export default rootSaga;

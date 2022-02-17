import {put, takeLatest, fork} from 'redux-saga/effects';
import {
  endEstimationVideo,
  setIsEstimationVideoPlaying,
  startEstimationVideo,
  stopEstimationVideo
} from '../actions/estimationPlayback';
import {
  endDetection,
  pauseDetection,
  startDetection
} from '../actions/estimation';

function* handleVideoPlaybackStart(action) {
  yield put(setIsEstimationVideoPlaying(true));
  yield put(startDetection(action.payload));
}

function* handleVideoPlaybackPause() {
  yield put(setIsEstimationVideoPlaying(false));
  yield put(pauseDetection());
}

function* handleVideoPlaybackEnd() {
  yield put(setIsEstimationVideoPlaying(false));
  yield put(endDetection());
}

function* watchVideoPlaybackStart() {
  yield takeLatest(startEstimationVideo.type, handleVideoPlaybackStart);
}
function* watchVideoPlaybackPause() {
  yield takeLatest(stopEstimationVideo.type, handleVideoPlaybackPause);
}
function* watchVideoPlaybackEnd() {
  yield takeLatest(endEstimationVideo.type, handleVideoPlaybackEnd);
}

function* rootSaga() {
  yield fork(watchVideoPlaybackStart);
  yield fork(watchVideoPlaybackPause);
  yield fork(watchVideoPlaybackEnd);
}

export default rootSaga;

import {put, takeLatest, fork} from 'redux-saga/effects';
import {
  endEstimationVideo,
  setIsEstimationVideoPlaying,
  startEstimationVideo,
  stopEstimationVideo
} from '../actions/estimationPlayback';
import {
  endEstimation,
  pauseEstimation,
  startEstimation
} from '../actions/estimation';

function* handleVideoPlaybackStart(action) {
  yield put(setIsEstimationVideoPlaying(true));
  yield put(startEstimation(action.payload));
}

function* handleVideoPlaybackPause() {
  yield put(setIsEstimationVideoPlaying(false));
  yield put(pauseEstimation());
}

function* handleVideoPlaybackEnd() {
  yield put(setIsEstimationVideoPlaying(false));
  yield put(endEstimation());
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

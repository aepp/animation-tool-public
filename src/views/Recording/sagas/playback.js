import {put, takeLatest, fork, call} from 'redux-saga/effects';

import {
  SET_IS_VIDEO_PLAYING,
  VIDEO_PLAYBACK_END,
  VIDEO_PLAYBACK_PAUSE,
  VIDEO_PLAYBACK_START,
  START_DETECTION,
  PAUSE_DETECTION,
  END_DETECTION
} from '../actions';

function* handleVideoPlaybackStart(action) {
  const {
    payload: {videoElementPreview, videoElementOriginal}
  } = action;

  if (!videoElementOriginal) return;

  yield call({
    context: videoElementOriginal,
    fn: videoElementOriginal.play
  });
  yield call({
    context: videoElementPreview,
    fn: videoElementPreview.play
  });
  yield put({type: SET_IS_VIDEO_PLAYING, payload: {isVideoPlaying: true}});
  yield put({
    type: START_DETECTION,
    payload: {videoElementPreview, videoElementOriginal}
  });
}
function* handleVideoPlaybackPause(action) {
  const {
    payload: {videoElementPreview, videoElementOriginal}
  } = action;

  if (!videoElementOriginal) return;

  yield call({
    context: videoElementPreview,
    fn: videoElementPreview.pause
  });
  yield call({
    context: videoElementOriginal,
    fn: videoElementOriginal.pause
  });
  yield put({type: SET_IS_VIDEO_PLAYING, payload: {isVideoPlaying: false}});
  yield put({type: PAUSE_DETECTION});
}

function* handleVideoPlaybackEnd() {
  yield put({type: SET_IS_VIDEO_PLAYING, payload: {isVideoPlaying: false}});
  yield put({type: END_DETECTION});
}

function* watchVideoPlaybackStart() {
  yield takeLatest(VIDEO_PLAYBACK_START, handleVideoPlaybackStart);
}
function* watchVideoPlaybackPause() {
  yield takeLatest(VIDEO_PLAYBACK_PAUSE, handleVideoPlaybackPause);
}
function* watchVideoPlaybackEnd() {
  yield takeLatest(VIDEO_PLAYBACK_END, handleVideoPlaybackEnd);
}

function* rootSaga() {
  yield fork(watchVideoPlaybackStart);
  yield fork(watchVideoPlaybackPause);
  yield fork(watchVideoPlaybackEnd);
}

export default rootSaga;

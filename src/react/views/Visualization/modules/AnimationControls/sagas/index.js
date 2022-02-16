import * as PropTypes from 'prop-types';
import {put, takeLatest, fork, select, throttle} from 'redux-saga/effects';
import {
  CHANGE_PLAYBACK_SPEED,
  RESET_PLAYBACK_SPEED_AND_DIRECTION,
  SET_IS_PLAYING,
  SET_PLAYBACK_SPEED,
  SET_PLAYBACK_SPEED_AND_DIRECTION,
  TOGGLE_PLAY,
  updateCurrentFrameIdxToThree
} from '../actions';
import {
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE,
  PLAYBACK_DIRECTION_DEFAULT,
  PLAYBACK_DIRECTION_REVERSE,
  PLAYBACK_SPEEDS
} from '../../../../../../constants';
import {selectFramesCount} from '../../Animation/reducers';
import {
  selectIsPlaying,
  selectPlaybackDirection,
  selectPlaybackSpeedMultiplierIdx
} from '../reducers';

function* handleTogglePlay() {
  const isPlaying = yield select(selectIsPlaying);
  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  yield put({type: SET_IS_PLAYING, payload: {isPlaying: !isPlaying}});
  if (isPlaying === true) {
    yield put({
      type: RESET_PLAYBACK_SPEED_AND_DIRECTION
    });
    animationControllerInstance.resetPlayback();
  }
  animationControllerInstance.isPlaying = !isPlaying;
}

function* handleChangePlaybackSpeed(action) {
  const {
    payload: {playbackDirection}
  } = action;
  const currentPlaybackSpeedMultiplierIdx = yield select(
    selectPlaybackSpeedMultiplierIdx
  );
  const currentPlaybackDirection = yield select(selectPlaybackDirection);

  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  if (currentPlaybackDirection !== playbackDirection) {
    animationControllerInstance.playbackSpeed = PLAYBACK_SPEEDS[0];
    animationControllerInstance.playbackDirection = playbackDirection;
    yield put({
      type: SET_PLAYBACK_SPEED_AND_DIRECTION,
      payload: {playbackSpeedMultiplierIdx: 0, playbackDirection}
    });
  } else {
    const playbackSpeedMultiplierIdx =
      currentPlaybackSpeedMultiplierIdx !== null &&
      currentPlaybackSpeedMultiplierIdx + 1 < PLAYBACK_SPEEDS.length
        ? currentPlaybackSpeedMultiplierIdx + 1
        : 0;
    animationControllerInstance.playbackSpeed =
      PLAYBACK_SPEEDS[playbackSpeedMultiplierIdx];
    yield put({
      type: SET_PLAYBACK_SPEED,
      payload: {
        playbackSpeedMultiplierIdx
      }
    });
  }
}
handleChangePlaybackSpeed.propTypes = {
  payload: PropTypes.shape({
    playbackDirection: PropTypes.oneOf([
      PLAYBACK_DIRECTION_DEFAULT,
      PLAYBACK_DIRECTION_REVERSE
    ]).isRequired
  })
};

function* handleUpdateCurrentFrameIdxToThree(action) {
  const frameIdx = action.payload;
  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  animationControllerInstance.updateFrameIdxFromUi(frameIdx);

  const framesCount = yield select(selectFramesCount);
  if (animationControllerInstance.isPlaying) {
    if (framesCount - 1 === frameIdx || frameIdx === 0) {
      animationControllerInstance.isPlaying = false;
      yield put({type: SET_IS_PLAYING, payload: {isPlaying: false}});
    }
  }
}

function* watchTogglePlay() {
  yield takeLatest(TOGGLE_PLAY, handleTogglePlay);
}
function* watchChangePlaybackSpeed() {
  yield takeLatest(CHANGE_PLAYBACK_SPEED, handleChangePlaybackSpeed);
}
function* watchUpdateCurrentFrameIdxToThree() {
  yield throttle(
    50,
    updateCurrentFrameIdxToThree.type,
    handleUpdateCurrentFrameIdxToThree
  );
}

function* rootSaga() {
  yield fork(watchTogglePlay);
  yield fork(watchChangePlaybackSpeed);
  yield fork(watchUpdateCurrentFrameIdxToThree);
}

export default rootSaga;

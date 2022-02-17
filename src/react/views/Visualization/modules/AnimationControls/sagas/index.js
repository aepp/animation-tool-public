import * as PropTypes from 'prop-types';
import {put, takeLatest, fork, select, throttle} from 'redux-saga/effects';
import {
  changePlaybackSpeed,
  resetPlaybackSpeedAndDirection,
  setIsPlaying,
  setPlaybackSpeed,
  setPlaybackSpeedAndDirection,
  togglePlay,
  updateCurrentFrameIdxToThree
} from '../actions';
import {
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE,
  PlayBackDirectionType,
  PLAYBACK_SPEEDS
} from '../../../../../../config/constants';
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
  yield put(setIsPlaying(!isPlaying));
  if (isPlaying === true) {
    yield put(resetPlaybackSpeedAndDirection());
    animationControllerInstance.resetPlayback();
  }
  animationControllerInstance.isPlaying = !isPlaying;
}

function* handleChangePlaybackSpeed(action) {
  const playbackDirection = action.payload;
  const currentPlaybackSpeedMultiplierIdx = yield select(
    selectPlaybackSpeedMultiplierIdx
  );
  const currentPlaybackDirection = yield select(selectPlaybackDirection);

  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  if (currentPlaybackDirection !== playbackDirection) {
    animationControllerInstance.playbackSpeed = PLAYBACK_SPEEDS[0];
    animationControllerInstance.playbackDirection = playbackDirection;
    yield put(
      setPlaybackSpeedAndDirection({
        playbackSpeedMultiplierIdx: 0,
        playbackDirection
      })
    );
  } else {
    const playbackSpeedMultiplierIdx =
      currentPlaybackSpeedMultiplierIdx !== null &&
      currentPlaybackSpeedMultiplierIdx + 1 < PLAYBACK_SPEEDS.length
        ? currentPlaybackSpeedMultiplierIdx + 1
        : 0;
    animationControllerInstance.playbackSpeed =
      PLAYBACK_SPEEDS[playbackSpeedMultiplierIdx];
    yield put(setPlaybackSpeed(playbackSpeedMultiplierIdx));
  }
}
handleChangePlaybackSpeed.propTypes = {
  payload: PropTypes.shape({
    playbackDirection: PropTypes.oneOf(Object.keys(PlayBackDirectionType))
      .isRequired
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
      yield put(setIsPlaying(false));
    }
  }
}

function* watchTogglePlay() {
  yield takeLatest(togglePlay.type, handleTogglePlay);
}
function* watchChangePlaybackSpeed() {
  yield takeLatest(changePlaybackSpeed.type, handleChangePlaybackSpeed);
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

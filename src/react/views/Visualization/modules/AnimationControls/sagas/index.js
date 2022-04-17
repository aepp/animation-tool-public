import * as PropTypes from 'prop-types';
import {put, takeLatest, fork, select, throttle} from 'redux-saga/effects';
import {
  increaseFps,
  resetFpsMultiplierAndDirection,
  setIsPlaying,
  setFpsMultiplier,
  setFpsMultiplierAndDirection,
  togglePlay,
  updateCurrentFrameIdxToThree
} from '../actions';
import {
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE,
  PlayBackDirectionType,
  FPS_SPEED_UPS
} from '../../../../../../config/constants';
import {selectFramesCount} from '../../Animation/reducers';
import {selectIsPlaying, selectPlaybackDirection} from '../reducers';
import {selectBaseFps} from '../../CoordinatesChart/reducers';

function* handleTogglePlay() {
  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  if (!animationControllerInstance) return;

  const isPlaying = yield select(selectIsPlaying);
  const baseFps = yield select(selectBaseFps);

  yield put(setIsPlaying(!isPlaying));
  if (isPlaying === true) {
    yield put(resetFpsMultiplierAndDirection());
    animationControllerInstance.resetPlayback({baseFps});
  }
  animationControllerInstance.isPlaying = !isPlaying;
}

function* handleIncreaseFps(action) {
  const playbackDirection = action.payload;
  const currentPlaybackDirection = yield select(selectPlaybackDirection);

  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  if (currentPlaybackDirection !== playbackDirection) {
    animationControllerInstance.fpsMultiplier = FPS_SPEED_UPS[0];
    animationControllerInstance.playbackDirection = playbackDirection;
    yield put(
      setFpsMultiplierAndDirection({
        fpsMultiplier: FPS_SPEED_UPS[0],
        playbackDirection
      })
    );
  } else {
    const fpsMultiplier = animationControllerInstance.incrementFrameRate();
    yield put(setFpsMultiplier(fpsMultiplier));
  }
}
handleIncreaseFps.propTypes = {
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
function* watchIncreaseFps() {
  yield takeLatest(increaseFps.type, handleIncreaseFps);
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
  yield fork(watchIncreaseFps);
  yield fork(watchUpdateCurrentFrameIdxToThree);
}

export default rootSaga;

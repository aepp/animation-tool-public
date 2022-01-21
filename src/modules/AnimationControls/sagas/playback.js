import * as PropTypes from 'prop-types';
import {put, takeLatest, fork, select} from 'redux-saga/effects';
import {
  CHANGE_PLAYBACK_SPEED,
  RESET_PLAYBACK_SPEED_AND_DIRECTION,
  SET_IS_PLAYING,
  SET_PLAYBACK_SPEED,
  SET_PLAYBACK_SPEED_AND_DIRECTION,
  TOGGLE_PLAY
} from '../actions';
import {
  LOCAL_STORAGE_THREE_INSTANCE,
  PLAYBACK_DIRECTION_DEFAULT,
  PLAYBACK_DIRECTION_REVERSE,
  PLAYBACK_SPEEDS
} from '../../../constants';
import {
  selectIsPlaying,
  selectPlaybackDirection,
  selectPlaybackSpeedMultiplierIdx
} from '../reducers';

function* handleTogglePlay() {
  const isPlaying = yield select(selectIsPlaying);
  const threeInstance = window[LOCAL_STORAGE_THREE_INSTANCE];
  yield put({type: SET_IS_PLAYING, payload: {isPlaying: !isPlaying}});
  if (isPlaying === true) {
    yield put({
      type: RESET_PLAYBACK_SPEED_AND_DIRECTION
    });
  }
  threeInstance.isPlaying = !isPlaying;
}

function* handleChangePlaybackSpeed(action) {
  const {
    payload: {playbackDirection}
  } = action;
  const currentPlaybackSpeedMultiplierIdx = yield select(
    selectPlaybackSpeedMultiplierIdx
  );
  const currentPlaybackDirection = yield select(selectPlaybackDirection);

  const threeInstance = window[LOCAL_STORAGE_THREE_INSTANCE];

  if (currentPlaybackDirection !== playbackDirection) {
    threeInstance.playbackSpeed = PLAYBACK_SPEEDS[0];
    threeInstance.playbackDirection = playbackDirection;
    yield put({
      type: SET_PLAYBACK_SPEED_AND_DIRECTION,
      payload: {playbackSpeedMultiplierIdx: 0, playbackDirection}
    });
  } else {
    const playbackSpeedMultiplierIdx =
      currentPlaybackSpeedMultiplierIdx !== null && currentPlaybackSpeedMultiplierIdx + 1 < PLAYBACK_SPEEDS.length
        ? currentPlaybackSpeedMultiplierIdx + 1
        : 0;
    threeInstance.playbackSpeed = PLAYBACK_SPEEDS[playbackSpeedMultiplierIdx];
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

function* watchTogglePlay() {
  yield takeLatest(TOGGLE_PLAY, handleTogglePlay);
}
function* watchChangePlaybackSpeed() {
  yield takeLatest(CHANGE_PLAYBACK_SPEED, handleChangePlaybackSpeed);
}

function* rootSaga() {
  yield fork(watchTogglePlay);
  yield fork(watchChangePlaybackSpeed);
}

export default rootSaga;

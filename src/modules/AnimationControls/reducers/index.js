import {
  SET_PLAYBACK_SPEED_AND_DIRECTION,
  SET_PLAYBACK_SPEED,
  SET_IS_PLAYING,
  RESET_PLAYBACK_SPEED_AND_DIRECTION
} from '../actions';
import {PLAYBACK_DIRECTION_DEFAULT} from '../../../constants';

export const reducerKey = 'animationControls';

const defaultState = {
  isPlaying: true,
  playbackSpeedMultiplierIdx: null,
  playbackDirection: PLAYBACK_DIRECTION_DEFAULT
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload.isPlaying
      };
    case SET_PLAYBACK_SPEED_AND_DIRECTION:
      return {
        ...state,
        playbackSpeedMultiplierIdx: action.payload.playbackSpeedMultiplierIdx,
        playbackDirection: action.payload.playbackDirection
      };
    case SET_PLAYBACK_SPEED:
      return {
        ...state,
        playbackSpeedMultiplierIdx: action.payload.playbackSpeedMultiplierIdx
      };
    case RESET_PLAYBACK_SPEED_AND_DIRECTION:
      return {
        ...state,
        playbackSpeedMultiplierIdx: null,
        playbackDirection: PLAYBACK_DIRECTION_DEFAULT
      };
    default:
      return state;
  }
};

export default r;

export const selectIsPlaying = state => state[reducerKey].isPlaying;
export const selectPlaybackSpeedMultiplierIdx = state =>
  state[reducerKey].playbackSpeedMultiplierIdx;
export const selectPlaybackDirection = state =>
  state[reducerKey].playbackDirection;

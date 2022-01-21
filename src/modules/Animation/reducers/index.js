import {
  FINISH_ANIMATION_INIT,
} from '../actions';
import {UPDATE_CURRENT_FRAME_IDX} from '../actions/uiChannel';

export const reducerKey = 'animation';
const defaultState = {
  isInitialized: false,
  currentFrameIdx: 0
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case FINISH_ANIMATION_INIT:
      return {
        ...state,
        isInitialized: true
      };
    case UPDATE_CURRENT_FRAME_IDX:
      return {
        ...state,
        currentFrameIdx: action.payload.currentFrameIdx
      };
    default:
      return state;
  }
};

export default r;

export const selectIsAnimationInitialized = state =>
  state[reducerKey].isInitialized;
export const selectCurrentFrameIdx = state =>
  state[reducerKey].currentFrameIdx;

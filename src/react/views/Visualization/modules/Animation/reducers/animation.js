import {FINISH_ANIMATION_INIT} from '../actions/animation';
import {
  UPDATE_CURRENT_FRAME_IDX_FROM_THREE,
  UPDATE_FRAMES_COUNT
} from '../actions/uiChannel';

export const reducerKey = 'animation';
const defaultState = {
  isInitialized: false,
  currentFrameIdx: 0,
  framesCount: 0,
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case FINISH_ANIMATION_INIT:
      return {
        ...state,
        isInitialized: true
      };
    case UPDATE_CURRENT_FRAME_IDX_FROM_THREE:
      return {
        ...state,
        currentFrameIdx: action.payload.currentFrameIdx
      };
    case UPDATE_FRAMES_COUNT:
      return {
        ...state,
        framesCount: action.payload.framesCount
      };
    default:
      return state;
  }
};

export default r;

export const selectors = {
  selectIsAnimationInitialized: state => state[reducerKey].isInitialized,
  selectCurrentFrameIdx: state => state[reducerKey].currentFrameIdx,
  selectFramesCount: state => state[reducerKey].framesCount,
};


import {createReducer} from '@reduxjs/toolkit';
import {updateCurrentFrameIdx} from '../../AnimationControls/actions';
import {
  finishAnimationInit,
  resetAnimation,
  updateFramesCount
} from '../actions/animation';
import {updateCurrentFrameIndexFromThree} from '../actions/uiChannel';

export const reducerKey = 'animation';
const defaultState = {
  isInitialized: false,
  currentFrameIdx: 0,
  framesCount: 0
};
const r = createReducer(defaultState, {
  [finishAnimationInit]: state => {
    state.isInitialized = true;
  },
  [updateCurrentFrameIdx]: (state, action) => {
    state.currentFrameIdx = action.payload;
  },
  [updateCurrentFrameIndexFromThree]: (state, action) => {
    state.currentFrameIdx = action.payload;
  },
  [updateFramesCount]: (state, action) => {
    state.framesCount = action.payload;
  },
  [resetAnimation]: () => ({
    ...defaultState
  })
});

export default r;

export const selectors = {
  selectIsAnimationInitialized: state => state[reducerKey].isInitialized,
  selectCurrentFrameIdx: state => state[reducerKey].currentFrameIdx,
  selectFramesCount: state => state[reducerKey].framesCount
};

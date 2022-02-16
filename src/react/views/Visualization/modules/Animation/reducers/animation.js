import {finishAnimationInit} from '../actions/animation';
import {
  updateCurrentFrameIndexFromThree,
  updateFramesCount
} from '../actions/uiChannel';
import {updateCurrentFrameIdx} from '../../AnimationControls/actions';
import {createReducer} from '@reduxjs/toolkit';

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
  }
});

export default r;

export const selectors = {
  selectIsAnimationInitialized: state => state[reducerKey].isInitialized,
  selectCurrentFrameIdx: state => state[reducerKey].currentFrameIdx,
  selectFramesCount: state => state[reducerKey].framesCount
};

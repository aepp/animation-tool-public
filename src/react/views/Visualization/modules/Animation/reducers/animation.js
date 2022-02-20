import {createReducer} from '@reduxjs/toolkit';
import {updateCurrentFrameIdx} from '../../AnimationControls/actions';
import {
  beginAnimationInit,
  cancelAnimationInit,
  finishAnimationInit,
  resetAnimation,
  updateFramesCount
} from '../actions/animation';
import {updateCurrentFrameIndexFromThree} from '../actions/uiChannel';

export const reducerKey = 'animation';
const defaultState = {
  isLoading: false,
  isInitialized: false,
  currentFrameIdx: 0,
  framesCount: 0
};
const r = createReducer(defaultState, {
  [beginAnimationInit]: state => {
    state.isInitialized = false;
    state.isLoading = true;
  },
  [finishAnimationInit]: state => {
    state.isInitialized = true;
    state.isLoading = false;
  },
  [cancelAnimationInit]: state => {
    state.isInitialized = false;
    state.isLoading = false;
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
  selectIsAnimationLoading: state => state[reducerKey].isLoading,
  selectCurrentFrameIdx: state => state[reducerKey].currentFrameIdx,
  selectFramesCount: state => state[reducerKey].framesCount
};

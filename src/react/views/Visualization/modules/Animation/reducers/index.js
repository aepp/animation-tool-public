import {createReducer, createSelector} from '@reduxjs/toolkit';
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

/**
 * @typedef AnimationState
 * @type {object}
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {number} currentFrameIdx
 * @property {number} framesCount
 */
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

/**
 * @param state
 * @return AnimationState
 */
const selectSelf = state => state[reducerKey];
export const selectIsAnimationInitialized = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.isInitialized
);
export const selectIsAnimationLoading = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.isLoading
);
export const selectCurrentFrameIdx = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.currentFrameIdx
);
export const selectFramesCount = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.framesCount
);

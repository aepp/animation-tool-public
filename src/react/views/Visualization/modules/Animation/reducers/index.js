import {createReducer, createSelector} from '@reduxjs/toolkit';
import {updateCurrentFrameIdx} from '../../AnimationControls/actions';
import {
  beginAnimationInit,
  cancelAnimationInit,
  finishAnimationInit,
  resetAnimation,
  setOriginalFps,
  updateFramesCount
} from '../actions/animation';
import {
  updateCurrentFrameIndexFromThree,
  updateHoveredJointDataFromThree
} from '../actions/uiChannel';
import {DEFAULT_PLAYBACK_FPS} from '../../../../../../config/constants';

export const reducerKey = 'animation';

/**
 * @typedef AnimationState
 * @type {object}
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {number} currentFrameIdx
 * @property {number} framesCount
 * @property {object} hoveredJointData
 * @property {number} originalFps
 */
const defaultState = {
  isLoading: false,
  isInitialized: false,
  currentFrameIdx: 0,
  hoveredJointData: null,
  framesCount: 0,
  originalFps: DEFAULT_PLAYBACK_FPS
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
  [updateHoveredJointDataFromThree]: (state, action) => {
    state.hoveredJointData = action.payload;
  },
  [setOriginalFps]: (state, action) => {
    state.originalFps = action.payload;
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
export const selectHoveredJointData = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.hoveredJointData
);
export const selectOriginalFps = createSelector(
  selectSelf,
  /** @param {AnimationState} state */ state => state.originalFps
);

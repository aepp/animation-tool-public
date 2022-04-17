import {createReducer, createSelector} from '@reduxjs/toolkit';
import {updateCurrentFrameIdx} from '../../AnimationControls/actions';
import {
  beginAnimationInit,
  cancelAnimationInit,
  finishAnimationInit,
  resetAnimation,
  updateFramesCount
} from '../actions/animation';
import {
  updateCurrentFrameIndexFromThree,
  updateHoveredJointDataFromThree
} from '../actions/uiChannel';

export const reducerKey = 'animation';

/**
 * @typedef AnimationState
 * @type {object}
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {number} currentFrameIdx
 * @property {number} framesCount
 * @property {object} hoveredJointData
 */
const defaultState = {
  isLoading: false,
  isInitialized: false,
  currentFrameIdx: 0,
  hoveredJointData: null,
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
  [updateHoveredJointDataFromThree]: (state, action) => {
    state.hoveredJointData = action.payload;
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

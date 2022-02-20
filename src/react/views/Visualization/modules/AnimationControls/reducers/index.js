import {createReducer, createSelector} from '@reduxjs/toolkit';
import {PlayBackDirectionType} from '../../../../../../config/constants';
import {
  resetAnimationControls,
  setIsPlaying,
  setFpsMultiplierAndDirection,
  setFpsMultiplier,
  resetFpsMultiplierAndDirection,
  toggleInlineAnimationControlsVisibility
} from '../actions';

export const reducerKey = 'animationControls';

/**
 * @typedef AnimationControlsState
 * @type {object}
 * @property {number} [fpsMultiplier]
 * @property {boolean} isPlaying.
 * @property {PlayBackDirectionType} playbackDirection
 * @property {boolean} areInlineControlsVisible
 */

/**
 * @type AnimationControlsState
 */
const defaultState = {
  isPlaying: false,
  fpsMultiplier: 1,
  playbackDirection: PlayBackDirectionType.DEFAULT,
  areInlineControlsVisible: true
};
const r = createReducer(defaultState, {
  [setIsPlaying]: (state, action) => {
    state.isPlaying = action.payload;
  },
  [setFpsMultiplierAndDirection]: (state, action) => {
    state.fpsMultiplier = action.payload.fpsMultiplier;
    state.playbackDirection = action.payload.playbackDirection;
  },
  [setFpsMultiplier]: (state, action) => {
    state.fpsMultiplier = action.payload;
  },
  [resetFpsMultiplierAndDirection]: state => {
    state.fpsMultiplier = 1;
    state.playbackDirection = PlayBackDirectionType.DEFAULT;
  },
  [toggleInlineAnimationControlsVisibility]: state => {
    state.areInlineControlsVisible = !state.areInlineControlsVisible;
  },
  [resetAnimationControls]: () => ({
    ...defaultState
  })
});

export default r;

/**
 * @param state
 * @return AnimationControlsState
 */
const selectSelf = state => state[reducerKey];
export const selectIsPlaying = createSelector(
  selectSelf,
  /** @param {AnimationControlsState} state */ state => state.isPlaying
);
export const selectFpsMultiplier = createSelector(
  selectSelf,
  /** @param {AnimationControlsState} state */ state => state.fpsMultiplier
);
export const selectPlaybackDirection = createSelector(
  selectSelf,
  /** @param {AnimationControlsState} state */ state => state.playbackDirection
);
export const selectAreInlineAnimationControlsVisible = createSelector(
  selectSelf,
  /** @param {AnimationControlsState} state */ state =>
    state.areInlineControlsVisible
);

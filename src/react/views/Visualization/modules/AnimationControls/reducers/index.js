import {createReducer, createSelector} from '@reduxjs/toolkit';
import {PlayBackDirectionType} from '../../../../../../config/constants';
import {
  resetAnimationControls,
  setIsPlaying,
  setPlaybackSpeedAndDirection,
  setPlaybackSpeed,
  resetPlaybackSpeedAndDirection,
  toggleInlineAnimationControlsVisibility
} from '../actions';

export const reducerKey = 'animationControls';

/**
 * @typedef AnimationControlsState
 * @type {object}
 * @property {number} [playbackSpeedMultiplierIdx]
 * @property {boolean} isPlaying.
 * @property {PlayBackDirectionType} playbackDirection
 * @property {boolean} areInlineControlsVisible
 */

/**
 * @type AnimationControlsState
 */
const defaultState = {
  isPlaying: true,
  playbackSpeedMultiplierIdx: null,
  playbackDirection: PlayBackDirectionType.DEFAULT,
  areInlineControlsVisible: true
};
const r = createReducer(defaultState, {
  [setIsPlaying]: (state, action) => {
    state.isPlaying = action.payload;
  },
  [setPlaybackSpeedAndDirection]: (state, action) => {
    state.playbackSpeedMultiplierIdx =
      action.payload.playbackSpeedMultiplierIdx;
    state.playbackDirection = action.payload.playbackDirection;
  },
  [setPlaybackSpeed]: (state, action) => {
    state.playbackSpeedMultiplierIdx = action.payload;
  },
  [resetPlaybackSpeedAndDirection]: state => {
    state.playbackSpeedMultiplierIdx = null;
    state.playbackSpeedMultiplierIdx = null;
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
export const selectPlaybackSpeedMultiplierIdx = createSelector(
  selectSelf,
  /** @param {AnimationControlsState} state */ state =>
    state.playbackSpeedMultiplierIdx
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

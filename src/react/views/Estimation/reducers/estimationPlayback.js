import {createReducer, createSelector} from '@reduxjs/toolkit';
import {
  resetEstimationPlayback,
  setEstimationVideoOriginalDimensions,
  setEstimationVideoPreviewDimensions,
  setEstimationVideoUrl,
  setIsEstimationVideoInitialized,
  setIsEstimationVideoPlaying,
  updateEstimationVideoCurrentTime,
  updateEstimationVideoTotalTime
} from '../actions/estimationPlayback';

export const reducerKey = 'estimationPlayback';

/**
 * @typedef EstimationPlaybackState
 * @type {object}
 * @property {boolean} isInitialized
 * @property {string | null} estimationVideoUrl
 * @property {boolean} isPlaying
 * @property {number} totalTime
 * @property {number} currentTime
 * @property {{[width]: number, [height]: number}} previewVideoDimensions
 * @property {{[width]: number, [height]: number}} originalVideoDimensions
 */
const defaultState = {
  isInitialized: false,
  estimationVideoUrl: null,
  isPlaying: false,
  currentTime: 0,
  totalTime: 1,
  previewVideoDimensions: {},
  originalVideoDimensions: {}
};
const r = createReducer(defaultState, {
  [setIsEstimationVideoInitialized]: (state, action) => {
    state.isInitialized = action.payload;
  },
  [setEstimationVideoUrl]: (state, action) => {
    state.estimationVideoUrl = action.payload;
  },
  [setIsEstimationVideoPlaying]: (state, action) => {
    state.isPlaying = action.payload;
  },
  [updateEstimationVideoTotalTime]: (state, action) => {
    state.totalTime = action.payload;
  },
  [updateEstimationVideoCurrentTime]: (state, action) => {
    state.currentTime =
      typeof action.payload !== 'boolean' ? action.payload : state.currentTime;
  },
  [setEstimationVideoPreviewDimensions]: (state, action) => {
    state.previewVideoDimensions = action.payload;
  },
  [setEstimationVideoOriginalDimensions]: (state, action) => {
    state.originalVideoDimensions = action.payload;
  },
  [resetEstimationPlayback]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return EstimationPlaybackState
 */
const selectSelf = state => state[reducerKey];
export const selectors = {
  selectIsEstimationVideoInitialized: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state => state.isInitialized
  ),
  selectEstimationVideoUrl: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state =>
      state.estimationVideoUrl
  ),
  selectIsEstimationVideoPlaying: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state => state.isPlaying
  ),
  selectEstimationVideoCurrentTime: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state => state.currentTime
  ),
  selectEstimationVideoTotalTime: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state => state.totalTime
  ),
  selectEstimationVideoPreviewDimensions: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state =>
      state.previewVideoDimensions
  ),
  selectEstimationVideoOriginalDimensions: createSelector(
    selectSelf,
    /** @param {EstimationPlaybackState} state */ state =>
      state.originalVideoDimensions
  )
};

import {createReducer, createSelector} from '@reduxjs/toolkit';
import {
  finishC3ChartInit,
  initC3Chart,
  resetC3Chart,
  setC3AttributeDictionary,
  setC3ChartArgs
} from '../actions/c3';

export const reducerKey = 'c3Chart';

/**
 * @typedef C3ChartState
 * @type {object}
 * @property {boolean} isLoading
 * @property {boolean} isInitialized
 * @property {object} chartArgs
 * @property {object} attributeDictionary
 */
const defaultState = {
  isLoading: false,
  isInitialized: false,
  chartArgs: undefined,
  attributeDictionary: undefined
};
const r = createReducer(defaultState, {
  [initC3Chart]: state => {
    state.isInitialized = false;
    state.isLoading = true;
  },
  [finishC3ChartInit]: state => {
    state.isInitialized = true;
    state.isLoading = false;
  },
  [setC3ChartArgs]: (state, action) => {
    state.chartArgs = action.payload;
  },
  [setC3AttributeDictionary]: (state, action) => {
    state.attributeDictionary = action.payload;
  },
  [resetC3Chart]: () => ({
    ...defaultState
  })
});

export default r;

/**
 * @param state
 * @return C3ChartState
 */
const selectSelf = state => state[reducerKey];
export const selectIsC3ChartInitialized = createSelector(
  selectSelf,
  /** @param {C3ChartState} state */ state => state.isInitialized
);
export const selectC3ChartArgs = createSelector(
  selectSelf,
  /** @param {C3ChartState} state */ state => state.chartArgs
);
export const selectC3AttributeDictionary = createSelector(
  selectSelf,
  /** @param {C3ChartState} state */ state => state.attributeDictionary
);

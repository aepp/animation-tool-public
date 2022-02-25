import {createReducer, createSelector} from '@reduxjs/toolkit';
import {
  cleanUpAnimationView,
  finishVisualizationViewInit
} from '../actions/view';

export const reducerKey = 'visualizationView';

/**
 * @typedef VisualizationViewState
 * @type {object}
 * @property {boolean} isInitialized
 */
const defaultState = {
  isInitialized: false
};
const r = createReducer(defaultState, {
  [finishVisualizationViewInit]: state => {
    state.isInitialized = true;
  },
  [cleanUpAnimationView]: () => ({
    ...defaultState
  })
});

export default r;

/**
 * @param state
 * @return VisualizationViewState
 */
const selectSelf = state => state[reducerKey];
export const selectIsVisualizationViewInitialized = createSelector(
  selectSelf,
  /** @param {VisualizationViewState} state */ state => state.isInitialized
);

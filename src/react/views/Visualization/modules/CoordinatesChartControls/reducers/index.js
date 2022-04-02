import {createSelector, createReducer} from '@reduxjs/toolkit';
import {
  resetCoordinatesChartControls,
  selectJoint,
  deselectJoint
} from '../actions';

export const reducerKey = 'coordinatesChartControls';

/**
 * @typedef CoordinatesChartControlsState
 * @type {string[]} selectedJoints
 */

/**
 * @type CoordinatesChartControlsState
 */
const defaultState = {
  selectedJoints: []
};
const r = createReducer(defaultState, {
  [selectJoint]: (state, action) => {
    state.selectedJoints.push(action.payload);
  },
  [deselectJoint]: (state, action) => {
    state.selectedJoints = state.selectedJoints.filter(j => {
      if (j.name !== action.payload.name) return true;
      return j.component !== action.payload.component;
    });
  },
  [resetCoordinatesChartControls]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return CoordinatesChartControlsState
 */
const selectSelf = state => state[reducerKey];
export const selectSelectedJoints = createSelector(
  selectSelf,
  state => state.selectedJoints
);

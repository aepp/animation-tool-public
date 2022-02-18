import {createSelector, createReducer} from '@reduxjs/toolkit';
import {resetDataSet, setDataSet} from '../actions';

export const reducerKey = 'dataSet';

/**
 * @type {PreProcessedDataSet}
 */
const defaultState = {
  dataSource: undefined,
  framesPerPerson: [],
  personIndices: [],
  extremes: {},
  normalization: {}
};
const r = createReducer(defaultState, {
  [setDataSet]: (state, action) => action.payload,
  [resetDataSet]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return PreProcessedDataSet
 */
const selectSelf = state => state[reducerKey];
export const selectDataSet = createSelector(selectSelf, state => state);

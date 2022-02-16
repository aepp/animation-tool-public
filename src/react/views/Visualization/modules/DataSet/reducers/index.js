import {createSelector, createReducer} from '@reduxjs/toolkit';
import {setDataSet} from '../actions';

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
  [setDataSet]: (state, action) => action.payload
});

export default r;

export const selectDataSet = createSelector(
  state => state[reducerKey],
  dataSet => dataSet
);

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
  normalization: {},
  original: undefined
};
const r = createReducer(defaultState, {
  [setDataSet]: (state, action) => {
    state.framesPerPerson = action.payload.framesPerPerson;
    state.personIndices = action.payload.personIndices;
    state.extremes = action.payload.extremes;
    state.normalization = action.payload.normalization;
    state.dataSource = action.payload.dataSource;
    state.original = action.payload.original;
  },
  [resetDataSet]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return PreProcessedDataSet
 */
const selectSelf = state => state[reducerKey];
export const selectDataSet = createSelector(selectSelf, state => state);
export const selectOriginalDataSet = createSelector(
  selectSelf,
  state => state.original
);

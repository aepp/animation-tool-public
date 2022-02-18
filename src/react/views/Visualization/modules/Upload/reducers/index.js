import {resetUpload, setDataSetFileUrl} from '../actions';
import {createReducer, createSelector} from '@reduxjs/toolkit';

export const reducerKey = 'upload';

/**
 * @typedef DataSetUploadState
 * @type {object}
 * @property {string} [url]
 */
const defaultState = {
  url: null
};
const r = createReducer(defaultState, {
  [setDataSetFileUrl]: (state, action) => {
    state.url = action.payload;
  },
  [resetUpload]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return PreProcessedDataSet
 */
const selectSelf = state => state[reducerKey];
export const selectDataSetFileUrl = createSelector(
  selectSelf,
  /** @param {DataSetUploadState} state */
  state => state.url
);

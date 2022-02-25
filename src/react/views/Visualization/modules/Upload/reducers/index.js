import {
  beginUpload,
  finishUpload,
  resetUpload,
  setDataFileType,
  setDataFileUrl,
  setInputFileType
} from '../actions';
import {createReducer, createSelector} from '@reduxjs/toolkit';

export const reducerKey = 'upload';

/**
 * @typedef DataUploadState
 * @type {object}
 * @property {boolean} isLoading
 * @property {boolean} isLoaded
 * @property {SupportedInputFileFormat} [dataFiletype]
 * @property {SupportedInputFileFormat} [inputFileType]
 * @property {string} [url]
 */
const defaultState = {
  isLoading: false,
  isLoaded: false,
  dataFiletype: null,
  inputFileType: null,
  url: null
};
const r = createReducer(defaultState, {
  [beginUpload]: state => {
    state.isLoading = true;
    state.isLoaded = false;
  },
  [finishUpload]: state => {
    state.isLoading = false;
    state.isLoaded = true;
  },
  [setDataFileUrl]: (state, action) => {
    state.url = action.payload;
  },
  [setDataFileType]: (state, action) => {
    state.dataFiletype = action.payload;
  },
  [setInputFileType]: (state, action) => {
    state.inputFileType = action.payload;
  },
  [resetUpload]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return PreProcessedDataSet
 */
const selectSelf = state => state[reducerKey];
export const selectIsFileUploading = createSelector(
  selectSelf,
  /** @param {DataUploadState} state */
  state => state.isLoading
);
export const selectIsFileUploaded = createSelector(
  selectSelf,
  /** @param {DataUploadState} state */
  state => state.isLoaded
);
export const selectDataFileUrl = createSelector(
  selectSelf,
  /** @param {DataUploadState} state */
  state => state.url
);
export const selectInputFileType = createSelector(
  selectSelf,
  /** @param {DataUploadState} state */
  state => state.inputFileType
);
export const selectDataFileType = createSelector(
  selectSelf,
  /** @param {DataUploadState} state */
  state => state.dataFiletype
);

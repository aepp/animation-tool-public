import {createReducer} from '@reduxjs/toolkit';
import {resetStats, setAnnotationParameter} from '../actions';
import {annotationParameters} from '../constants';

export const reducerKey = 'stats';

const defaultState = {
  annotationParameter: annotationParameters.bodyWeight
};

const r = createReducer(defaultState, {
  [setAnnotationParameter]: (state, action) => {
    state.annotationParameter = action.payload;
  },
  [resetStats]: () => ({
    ...defaultState
  })
});

export default r;

export const selectors = {
  selectSelectedAnnotationParameter: state =>
    state[reducerKey].annotationParameter
};
export const selectSelectedAnnotationParameter =
  selectors.selectSelectedAnnotationParameter;

import {createReducer} from '@reduxjs/toolkit';
import {setDrawerState, setAppConfig} from '../actions';

export const reducerKey = 'app';

const defaultState = {
  isDrawerOpen: false,
  appConfig: {
    standalone: true
  }
};
const r = createReducer(defaultState, {
  [setAppConfig]: (state, action) => {
    state.appConfig = action.payload;
  },
  [setDrawerState]: (state, action) => {
    state.isDrawerOpen = action.payload;
  }
});

export default r;

export const selectIsDrawerOpen = state => state[reducerKey].isDrawerOpen;
export const selectIsStandalone = state =>
  state[reducerKey].appConfig.standalone;

import {createReducer} from '@reduxjs/toolkit';
import {setDrawerState, setAppConfig, registerSpaceToggling} from '../actions';

export const reducerKey = 'app';

const defaultState = {
  isDrawerOpen: false,
  isSpaceTogglingRegistered: false,
  appConfig: {
    standalone: true
  }
};
const r = createReducer(defaultState, {
  [setAppConfig]: (state, action) => {
    state.appConfig = action.payload;
  },
  [registerSpaceToggling]: state => {
    state.isSpaceTogglingRegistered = true;
  },
  [setDrawerState]: (state, action) => {
    state.isDrawerOpen = action.payload;
  }
});

export default r;

export const selectIsDrawerOpen = state => state[reducerKey].isDrawerOpen;
export const selectIsStandalone = state =>
  state[reducerKey].appConfig.standalone;
export const selectIsSpaceTogglingRegistered = state =>
  state[reducerKey].isSpaceTogglingRegistered;

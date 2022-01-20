import {
  FINISH_VISUALIZATION_INIT,
} from '../actions';

export const reducerKey = 'visualization';
const defaultState = {
  isInitialized: false,
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case FINISH_VISUALIZATION_INIT:
      return {
        ...state,
        isInitialized: true
      };
    default:
      return state;
  }
};

export default r;

export const selectIsVisualizationInitialized = state =>
  state[reducerKey].isInitialized;

import {SET_DRAWER_STATE} from '../actions';

export const reducerKey = 'app';

const defaultState = {
  isDrawerOpen: false
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DRAWER_STATE:
      return {
        ...state,
        isDrawerOpen: action.payload.isDrawerOpen
      };
    default:
      return state;
  }
};

export default r;

export const selectIsDrawerOpen = state => state[reducerKey].isDrawerOpen;

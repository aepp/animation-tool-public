import {
  SET_DATASET_FILE_URL
} from '../actions';

export const reducerKey = 'upload';

const defaultState = {
  url: null,
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DATASET_FILE_URL:
      return {
        ...state,
        url: action.payload.url
      };
    default:
      return state;
  }
};

export default r;

export const selectDataSetFileUrl = (state) =>
  state[reducerKey].url;

import animationReducer, {
  reducerKey as animationReducerKey,
  selectors as animationSelectors
} from './animation';
import {combineReducers} from 'redux';

export const reducerKey = 'visualization';
const r = combineReducers({
  [animationReducerKey]: animationReducer
});
export default r;

export const selectIsAnimationInitialized = state =>
  animationSelectors.selectIsAnimationInitialized(state[reducerKey]);
export const selectIsAnimationLoading = state =>
  animationSelectors.selectIsAnimationLoading(state[reducerKey]);
export const selectCurrentFrameIdx = state =>
  animationSelectors.selectCurrentFrameIdx(state[reducerKey]);
export const selectFramesCount = state =>
  animationSelectors.selectFramesCount(state[reducerKey]);

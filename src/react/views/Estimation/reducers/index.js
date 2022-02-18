import {combineReducers} from 'redux';
import estimationReducer, {
  reducerKey as estimationReducerKey,
  selectors as estimationSelectors
} from './estimation';
import estimationPlaybackReducer, {
  reducerKey as estimationPlaybackReducerKey,
  selectors as estimationPlaybackSelectors
} from './estimationPlayback';

export const reducerKey = 'estimationModule';
const r = combineReducers({
  [estimationReducerKey]: estimationReducer,
  [estimationPlaybackReducerKey]: estimationPlaybackReducer
});
export default r;

export const selectDetectedPoses = state =>
  estimationSelectors.selectDetectedPoses(state[reducerKey]);
export const selectHasDetectionStarted = state =>
  estimationSelectors.selectHasDetectionStarted(state[reducerKey]);
export const selectHasDetectionFinished = state =>
  estimationSelectors.selectHasDetectionFinished(state[reducerKey]);
export const selectIsDetecting = state =>
  estimationSelectors.selectIsDetecting(state[reducerKey]);
export const selectIsModelWarmingUp = state =>
  estimationSelectors.selectIsModelWarmingUp(state[reducerKey]);
export const selectIsModelWarmedUp = state =>
  estimationSelectors.selectIsModelWarmedUp(state[reducerKey]);
export const selectDetectionModel = state =>
  estimationSelectors.selectDetectionModel(state[reducerKey]);
export const selectEstimationConfig = state =>
  estimationSelectors.selectEstimationConfig(state[reducerKey]);

export const selectIsEstimationVideoInitialized = state =>
  estimationPlaybackSelectors.selectIsEstimationVideoInitialized(
    state[reducerKey]
  );
export const selectEstimationVideoUrl = state =>
  estimationPlaybackSelectors.selectEstimationVideoUrl(state[reducerKey]);
export const selectIsEstimationVideoPlaying = state =>
  estimationPlaybackSelectors.selectIsEstimationVideoPlaying(state[reducerKey]);
export const selectEstimationVideoTotalTime = state =>
  estimationPlaybackSelectors.selectEstimationVideoTotalTime(state[reducerKey]);
export const selectEstimationVideoCurrentTime = state =>
  estimationPlaybackSelectors.selectEstimationVideoCurrentTime(
    state[reducerKey]
  );
export const selectEstimationVideoPreviewDimensions = state =>
  estimationPlaybackSelectors.selectEstimationVideoPreviewDimensions(
    state[reducerKey]
  );
export const selectEstimationVideoOriginalDimensions = state =>
  estimationPlaybackSelectors.selectEstimationVideoOriginalDimensions(
    state[reducerKey]
  );

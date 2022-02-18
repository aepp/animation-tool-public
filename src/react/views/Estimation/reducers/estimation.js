import {createReducer} from '@reduxjs/toolkit';
import {SupportedModels} from '@tensorflow-models/pose-detection';
import {ScoreThreshHold} from '../../../../config/tensorFlow';
import {
  setEstimationStatus,
  setHasEstimationStarted,
  addEstimatedPose,
  beginWarmUpModel,
  finishWarmUpModel,
  resetEstimation
} from '../actions/estimation';

export const reducerKey = 'recording';

const detectionModel = SupportedModels.MoveNet; // SupportedModels.PoseNet
const defaultState = {
  detectionModel,
  estimationConfig: {
    maxPoses: 1,
    flipHorizontal: false,
    scoreThreshold: ScoreThreshHold[detectionModel]
  },
  isModelWarmingUp: false,
  isModelWarmedUp: false,
  hasDetectionStarted: false,
  hasDetectionFinished: false,
  isDetecting: false,
  detectedPoses: []
};

const r = createReducer(defaultState, {
  [setEstimationStatus]: (state, action) => {
    state.hasDetectionStarted =
      typeof action.payload.hasDetectionStarted === 'boolean'
        ? action.payload.hasDetectionStarted
        : state.hasDetectionStarted;
    state.hasDetectionFinished =
      typeof action.payload.hasDetectionFinished === 'boolean'
        ? action.payload.hasDetectionFinished
        : state.hasDetectionFinished;
    state.isDetecting =
      typeof action.payload.isDetecting === 'boolean'
        ? action.payload.isDetecting
        : state.isDetecting;
  },
  [setHasEstimationStarted]: (state, action) => {
    state.hasDetectionStarted = action.payload;
  },
  [addEstimatedPose]: (state, action) => {
    state.detectedPoses.push(action.payload);
  },
  [beginWarmUpModel]: state => {
    state.isModelWarmedUp = false;
    state.isModelWarmingUp = true;
  },
  [finishWarmUpModel]: state => {
    state.isModelWarmedUp = true;
    state.isModelWarmingUp = false;
  },
  [resetEstimation]: () => ({
    ...defaultState
  })
});

export default r;

export const selectors = {
  selectDetectedPoses: state => state[reducerKey].detectedPoses,
  selectHasDetectionStarted: state => state[reducerKey].hasDetectionStarted,
  selectHasDetectionFinished: state => state[reducerKey].hasDetectionFinished,
  selectIsDetecting: state => state[reducerKey].isDetecting,
  selectIsModelWarmingUp: state => state[reducerKey].isModelWarmingUp,
  selectIsModelWarmedUp: state => state[reducerKey].isModelWarmedUp,
  selectDetectionModel: state => state[reducerKey].detectionModel,
  selectEstimationConfig: state => state[reducerKey].estimationConfig
};

import {createReducer} from '@reduxjs/toolkit';
import {SupportedModels, movenet} from '@tensorflow-models/pose-detection';
import {ScoreThreshHold} from '../../../../config/tensorFlow';
import {BASE_FPS_TF} from '../../../../config/constants';
import {
  setEstimationStatus,
  setHasEstimationStarted,
  addEstimationFrame,
  beginWarmUpModel,
  finishWarmUpModel,
  resetEstimation,
  setDetectionModel,
  setDetectionModelType,
  setEstimationConfig,
  setDetectionFps,
  addEstimationFrameStamp
} from '../actions/estimation';

export const reducerKey = 'recording';

const detectionModel = SupportedModels.MoveNet;
const maxPoses = 2;
const defaultState = {
  detectionModel,
  detectionModelType: movenet.modelType.MULTIPOSE_LIGHTNING,
  maxPoses,
  estimationConfig: {
    maxPoses,
    scoreThreshold: ScoreThreshHold[detectionModel]
  },
  isModelWarmingUp: false,
  isModelWarmedUp: false,
  hasDetectionStarted: false,
  hasDetectionFinished: false,
  isDetecting: false,
  estimationFrames: [],
  frameStamps: [],
  detectionFps: BASE_FPS_TF
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
  [addEstimationFrame]: (state, action) => {
    state.estimationFrames.push(action.payload);
  },
  [addEstimationFrameStamp]: (state, action) => {
    state.frameStamps.push(action.payload);
  },
  [beginWarmUpModel]: state => {
    state.isModelWarmedUp = false;
    state.isModelWarmingUp = true;
  },
  [finishWarmUpModel]: state => {
    state.isModelWarmedUp = true;
    state.isModelWarmingUp = false;
  },
  [setDetectionModel]: (state, action) => {
    state.detectionModel = action.payload;
  },
  [setDetectionModelType]: (state, action) => {
    state.detectionModelType = action.payload;
  },
  [setEstimationConfig]: (state, action) => {
    state.estimationConfig = action.payload;
  },
  [setDetectionFps]: (state, action) => {
    state.detectionFps = action.payload;
  },
  [resetEstimation]: () => ({
    ...defaultState
  })
});

export default r;

export const selectors = {
  selectEstimationFrames: state => state[reducerKey].estimationFrames,
  selectHasDetectionStarted: state => state[reducerKey].hasDetectionStarted,
  selectHasDetectionFinished: state => state[reducerKey].hasDetectionFinished,
  selectIsDetecting: state => state[reducerKey].isDetecting,
  selectIsModelWarmingUp: state => state[reducerKey].isModelWarmingUp,
  selectIsModelWarmedUp: state => state[reducerKey].isModelWarmedUp,
  selectDetectionModel: state => state[reducerKey].detectionModel,
  selectDetectionModelType: state => state[reducerKey].detectionModelType,
  selectEstimationConfig: state => state[reducerKey].estimationConfig,
  selectDetectionFps: state => state[reducerKey].detectionFps,
  selectEstimationFrameStamps: state => state[reducerKey].frameStamps
};

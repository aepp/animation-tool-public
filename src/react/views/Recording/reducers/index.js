import {
  ADD_DETECTED_POSE,
  SET_HAS_DETECTION_STARTED,
  FINISH_WARM_UP_MODEL,
  SET_IS_VIDEO_PLAYING,
  SET_RECORDING_INTERVAL_ID,
  BEGIN_WARM_UP_MODEL,
  SET_DETECTION_STATUS
} from '../actions';
import * as poseDetection from '@tensorflow-models/pose-detection';

export const reducerKey = 'recording';

const defaultState = {
  detectionModel: poseDetection.SupportedModels.PoseNet,
  isModelWarmingUp: false,
  isModelWarmedUp: false,
  hasDetectionStarted: false,
  hasDetectionFinished: false,
  isDetecting: false,
  detectedPoses: [],
  isVideoPlaying: false,
  recordingIntervalId: -1
};
const r = (state = defaultState, action) => {
  switch (action.type) {
    case SET_DETECTION_STATUS:
      return {
        ...state,
        hasDetectionStarted:
          typeof action.payload.hasDetectionStarted === 'boolean'
            ? action.payload.hasDetectionStarted
            : state.hasDetectionStarted,
        hasDetectionFinished:
          typeof action.payload.hasDetectionFinished === 'boolean'
            ? action.payload.hasDetectionFinished
            : state.hasDetectionFinished,
        isDetecting:
          typeof action.payload.isDetecting === 'boolean'
            ? action.payload.isDetecting
            : state.isDetecting
      };
    case SET_HAS_DETECTION_STARTED:
      return {
        ...state,
        hasDetectionStarted: action.payload.hasDetectionStarted
      };
    case SET_IS_VIDEO_PLAYING:
      return {
        ...state,
        isVideoPlaying: action.payload.isVideoPlaying
      };
    case SET_RECORDING_INTERVAL_ID:
      return {
        ...state,
        recordingIntervalId: action.payload.recordingIntervalId
      };
    case ADD_DETECTED_POSE:
      return {
        ...state,
        detectedPoses: [...state.detectedPoses, action.payload.pose]
      };
    case BEGIN_WARM_UP_MODEL:
      return {
        ...state,
        isModelWarmedUp: false,
        isModelWarmingUp: true
      };
    case FINISH_WARM_UP_MODEL:
      return {
        ...state,
        isModelWarmedUp: true,
        isModelWarmingUp: false
      };
    default:
      return state;
  }
};

export default r;

export const selectDetectedPoses = state => state[reducerKey].detectedPoses;
export const selectIsVideoPlaying = state => state[reducerKey].isVideoPlaying;
export const selectRecordingIntervalId = state =>
  state[reducerKey].recordingIntervalId;
export const selectHasDetectionStarted = state =>
  state[reducerKey].hasDetectionStarted;
export const selectIsModelWarmingUp = state =>
  state[reducerKey].isModelWarmingUp;
export const selectIsModelWarmedUp = state => state[reducerKey].isModelWarmedUp;
export const selectDetectionModel = state => state[reducerKey].detectionModel;
export const selectDetectionStatus = state => ({
  hasDetectionStarted: state[reducerKey].hasDetectionStarted,
  hasDetectionFinished: state[reducerKey].hasDetectionFinished,
  isDetecting: state[reducerKey].isDetecting
});

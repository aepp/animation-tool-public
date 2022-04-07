import {SupportedModels, movenet} from '@tensorflow-models/pose-detection';
import {VERSION} from '@mediapipe/pose';

export const ScoreThreshHold = {
  [SupportedModels.PoseNet]: 0.9,
  [SupportedModels.MoveNet]: 0.7,
  [SupportedModels.BlazePose]: 0.5
};

export const modelTypes = {
  [SupportedModels.PoseNet]: [],
  [SupportedModels.MoveNet]: [
    movenet.modelType.MULTIPOSE_LIGHTNING,
    movenet.modelType.SINGLEPOSE_LIGHTNING,
    movenet.modelType.SINGLEPOSE_THUNDER
  ],
  [SupportedModels.BlazePose]: ['lite', 'full', 'heavy']
};
export const DetectorConfigs = {
  [SupportedModels.PoseNet]: {
    quantBytes: 4,
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: {width: 500, height: 500},
    multiplier: 0.75
    // architecture: 'ResNet50',
    // outputStride: 16,
    // inputResolution: {width: 257, height: 200},
    // quantBytes: 2
  },
  [SupportedModels.BlazePose]: {
    runtime: 'tfjs-webgl', //'mediapipe',
    modelType: 'lite', // 'lite' | 'full' | 'heavy'
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${VERSION}`
  },
  [SupportedModels.MoveNet]: {
    // runtime: 'tfjs-webgl',
    modelType: movenet.modelType.MULTIPOSE_LIGHTNING,
    enableTracking: true,
    minPoseScore: 0.3,
    multiPoseMaxDimension: 512
  }
};

export const hasModelTypes = model =>
  [SupportedModels.BlazePose, SupportedModels.MoveNet].includes(model);

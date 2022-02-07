import {LOCAL_STORAGE_POSE_DETECTOR_INSTANCE} from '../../../constants';

export const detectorConfig = {
  architecture: 'ResNet50',
  outputStride: 16,
  inputResolution: {width: 257, height: 200},
  quantBytes: 2
};

export const estimationConfig = {
  maxPoses: 1,
  flipHorizontal: false,
  scoreThreshold: 0.5,
  nmsRadius: 20
};

export const getDetector = () => window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];
export const setDetector = detector =>
  (window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE] = detector);

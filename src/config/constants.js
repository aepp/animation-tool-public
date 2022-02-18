export const APP_BAR_HEIGHT = 64;

export const LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE =
  'LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE';
export const LOCAL_STORAGE_POSE_DETECTOR_INSTANCE =
  'LOCAL_STORAGE_POSE_DETECTOR_INSTANCE';

/**
 * @readonly
 * @enum {string}
 * @property {string} DEFAULT
 * @property {string} REVERSE
 */
export const PlayBackDirectionType = {
  /** @member {string} */
  DEFAULT: 'DEFAULT',
  /** @member {string} */
  REVERSE: 'REVERSE'
};

export const PLAYBACK_SPEED_DEFAULT = 1;
export const PLAYBACK_SPEEDS = [2, 5, 10, 30, 60];

/**
 * @readonly
 * @enum {string}
 * @property {string} JSON
 * @property {string} ZIP
 */
export const DataSetFileFormat = {
  JSON: '.json',
  ZIP: '.zip'
};

export const IgnoredFileNamesPatterns = ['DS_Store', '__MACOSX'];

/**
 * @readonly
 * @enum {string}
 * @property {string} DATA_SOURCE_KINECT
 * @property {string} DATA_SOURCE_KINECT_AZURE
 * @property {string} DATA_SOURCE_TF
 */
export const DataSourceType = {
  /** @member {string} */
  DATA_SOURCE_KINECT: 'Kinect',
  /** @member {string} */
  DATA_SOURCE_KINECT_AZURE: 'Kinect Azure',
  /** @member {string} */
  DATA_SOURCE_TF: 'TensorFlow'
};

// three.js
export const ORBIT_CONTROLS_Z_LIMIT_ADDITION = 5;

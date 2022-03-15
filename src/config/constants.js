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

export const BASE_FPS = 30;
export const DEFAULT_FPS_MULTIPLIER = 1;
export const FPS_SPEED_UPS = [1.5, 2, 2.5, 3];

/**
 * @readonly
 * @enum {string}
 * @property {string} JSON
 * @property {string} ZIP
 */
export const SupportedInputFileFormat = {
  JSON: '.json',
  ZIP: '.zip',
  MP4: '.mp4'
};

/**
 * @readonly
 * @enum {string}
 * @property {string} JSON
 * @property {string} ZIP
 */
export const MimeType = {
  JSON: 'application/json',
  ZIP: 'application/zip',
  MP4: 'video/mp4'
};

/**
 * @readonly
 * @enum {string}
 * @property {MimeType.JSON}
 * @property {MimeType.ZIP}
 * @property {MimeType.MP4}
 */
export const MimeTypeLabel = {
  [MimeType.JSON]: 'json dataset',
  [MimeType.ZIP]: 'zip archive',
  [MimeType.MP4]: 'mp4 video'
};

export const SupportedDataSetFileFormats = [SupportedInputFileFormat.JSON];

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

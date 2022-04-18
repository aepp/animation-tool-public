/**
 * @typedef Normalization
 * @description parameters used to scale the dataset points to the values between 0 and 1
 *              and shift the dataset to the center of the scene (i.e. html element containing
 *              the animation).
 * @type {object}
 * @property {number} translateX  required shift on the x axis.
 * @property {number} translateY  required shift on the y axis.
 * @property {number} translateZ  required shift on the z axis.
 * @property {number} scaleFactor length of the vector, which represents the distance between
 *                                a point with smallest x, y, and z available in the dataset
 *                                and a point with the largest x, y, and z available in the dataset.
 */

/**
 * @typedef Extremes
 * @type {object}
 * @property {number} zMin - smallest z value of the entire dataset.
 * @property {number} yMin - smallest y value of the entire dataset.
 * @property {number} xMin - smallest x value of the entire dataset.
 * @property {number} zMax - highest z value of the entire dataset.
 * @property {number} yMax - highest y value of the entire dataset.
 * @property {number} xMax - highest x value of the entire dataset.
 */

/**
 * @typedef PreProcessedDataSet
 * @type {object}
 * @property {object[]} framesPerPerson
 * @property {number[]} personIndices
 * @property {Extremes} extremes
 * @property {Normalization} normalization
 * @property {DataSourceType} dataSource
 */
import {DataSourceType, DEFAULT_PLAYBACK_FPS} from '../../config/constants';
import {frameStampToMilliseconds} from '../../react/views/Visualization/util/time';

/**
 * @class
 * @abstract
 */
export class CommonDataSetProcessor {
  /**
   * @type {DataSourceType}
   * @protected
   */
  _dataSource = undefined;

  /**
   * @type {RegExp}
   * @private
   */
  _startsWithNumberAndOptUnderscoreRegex = new RegExp(/^[\d]+_*/);

  /**
   * @type {RegExp}
   * @private
   */
  _endsWithSingleCharacterAndUnderscoreRegex = new RegExp(/_[XYZ]$/);

  /**
   * @type {Array}
   * @private
   */
  _frames;

  /**
   * @type {Extremes}
   * @private
   */
  _extremes = {
    xMin: 0,
    yMin: 0,
    zMin: 0,
    xMax: 1,
    yMax: 1,
    zMax: 1
  };

  /**
   * @type {number}
   * @private
   */
  _normalScaleFactor = undefined;

  /**
   * @type {number}
   * @private
   */
  _translateX = undefined;

  /**
   * @type {number}
   * @private
   */
  _translateY = undefined;

  /**
   * @type {number}
   * @private
   */
  _translateZ = undefined;

  /**
   * @public
   * @param frames
   * @param dataSource
   */
  constructor(
    {frames = [], dataSource = DataSourceType.DATA_SOURCE_KINECT} = {
      frames: [],
      dataSource: DataSourceType.DATA_SOURCE_KINECT
    }
  ) {
    this._frames = frames;
    this._dataSource = dataSource;
  }

  /**
   * determine pose estimation FPS based on total frames count and the timestamp of the last frame
   * @protected
   * @returns {number}
   */
  getDetectionFps() {
    if (!this._frames || !this._frames.length) return DEFAULT_PLAYBACK_FPS;
    return (
      this._frames.length /
      (frameStampToMilliseconds(
        this._frames[this._frames.length - 1]['frameStamp']
      ) /
        1000)
    );
  }

  /**
   * main entry point of a dataset processor; transforms a frames array to a format which is used by the render logic
   * @public
   */
  preProcess = () => {};

  /**
   * calculate the 2D scale factor to normalize joints' vectors size using extremes calculated previously
   * @protected
   * @returns {CommonDataSetProcessor}
   */
  calculateNormalScaleFactor2D = () => {
    this.normalScaleFactor = Math.sqrt(
      Math.pow(this.extremes.xMax - this.extremes.xMin, 2) +
        Math.pow(this.extremes.yMax - this.extremes.yMin, 2)
    );
    return this;
  };

  /**
   * calculate the 3D scale factor to normalize joints' vectors size using extremes calculated previously
   * @protected
   * @returns {CommonDataSetProcessor}
   */
  calculateNormalScaleFactor3D = () => {
    this.normalScaleFactor = Math.sqrt(
      Math.pow(this.extremes.xMax - this.extremes.xMin, 2) +
        Math.pow(this.extremes.yMax - this.extremes.yMin, 2) +
        Math.pow(this.extremes.zMax - this.extremes.zMin, 2)
    );
    return this;
  };

  /**
   * calculate the translation value to normalize joints' vectors position using extremes calculated previously
   * @protected
   * @returns {CommonDataSetProcessor}
   */
  calculateTranslations = () => {
    this.translateX =
      this.extremes.xMin + (this.extremes.xMax - this.extremes.xMin) / 2;
    this.translateY =
      this.extremes.yMin + (this.extremes.yMax - this.extremes.yMin) / 2;
    this.translateZ =
      this.extremes.zMin + (this.extremes.zMax - this.extremes.zMin) / 2;
  };

  /**
   * normalize given point by scaling and shifting it using normalization parameters previously calculated
   * @protected
   * @param point
   * @returns {{x: number, y: number, z: number}}
   */
  getNormalizedCenteredPoint = point => ({
    ...point,
    x: (point.x - this.translateX) / this.normalScaleFactor,
    y: (point.y - this.translateY) / this.normalScaleFactor,
    z: (point.z - this.translateZ) / this.normalScaleFactor
  });

  /**
   * @protected
   * @returns {Array}
   */
  get frames() {
    return this._frames;
  }

  /**
   * @protected
   * @param {Array} value
   */
  set frames(value) {
    this._frames = value;
  }

  /**
   * @protected
   * @returns {RegExp}
   */
  get startsWithNumberAndOptUnderscoreRegex() {
    return this._startsWithNumberAndOptUnderscoreRegex;
  }

  /**
   * @protected
   * @returns {RegExp}
   */
  get endsWithSingleCharacterAndUnderscoreRegex() {
    return this._endsWithSingleCharacterAndUnderscoreRegex;
  }

  /**
   * @protected
   * @returns {Extremes}
   */
  get extremes() {
    return this._extremes;
  }

  /**
   * @protected
   * @param value
   */
  set extremes(value) {
    this._extremes = value;
  }

  /**
   * @protected
   * @returns {number}
   */
  get normalScaleFactor() {
    return this._normalScaleFactor;
  }

  /**
   * @protected
   * @param value
   */
  set normalScaleFactor(value) {
    this._normalScaleFactor = value;
  }

  /**
   * @protected
   * @returns {number}
   */
  get translateX() {
    return this._translateX;
  }

  /**
   * @protected
   * @param value
   */
  set translateX(value) {
    this._translateX = value;
  }

  /**
   * @protected
   * @returns {number}
   */
  get translateY() {
    return this._translateY;
  }

  /**
   * @protected
   * @param value
   */
  set translateY(value) {
    this._translateY = value;
  }

  /**
   * @protected
   * @returns {number}
   */
  get translateZ() {
    return this._translateZ;
  }

  /**
   * @protected
   * @param value
   */
  set translateZ(value) {
    this._translateZ = value;
  }
}

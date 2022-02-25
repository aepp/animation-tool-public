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
/**
 * @class
 * @abstract
 */
export class CommonDataSetProcessor {
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

  constructor({frames}) {
    this._frames = frames;
  }

  preProcess = () => {};

  calculateNormalScaleFactor2D = () => {
    this.normalScaleFactor = Math.sqrt(
      Math.pow(this.extremes.xMax - this.extremes.xMin, 2) +
        Math.pow(this.extremes.yMax - this.extremes.yMin, 2)
    );
    return this;
  };

  calculateNormalScaleFactor3D = () => {
    this.normalScaleFactor = Math.sqrt(
      Math.pow(this.extremes.xMax - this.extremes.xMin, 2) +
        Math.pow(this.extremes.yMax - this.extremes.yMin, 2) +
        Math.pow(this.extremes.zMax - this.extremes.zMin, 2)
    );
    return this;
  };

  calculateTranslations = () => {
    this.translateX =
      this.extremes.xMin + (this.extremes.xMax - this.extremes.xMin) / 2;
    this.translateY =
      this.extremes.yMin + (this.extremes.yMax - this.extremes.yMin) / 2;
    this.translateZ =
      this.extremes.zMin + (this.extremes.zMax - this.extremes.zMin) / 2;
  };

  getNormalizedCenteredPoint = point => ({
    ...point,
    x: (point.x - this.translateX) / this.normalScaleFactor,
    y: (point.y - this.translateY) / this.normalScaleFactor,
    z: (point.z - this.translateZ) / this.normalScaleFactor
  });
  /**
   * @public
   * @returns {Array}
   */
  get frames() {
    return this._frames;
  }

  /**
   * @public
   * @param {Array} value
   */
  set frames(value) {
    this._frames = value;
  }

  /**
   * @public
   * @returns {RegExp}
   */
  get startsWithNumberAndOptUnderscoreRegex() {
    return this._startsWithNumberAndOptUnderscoreRegex;
  }

  /**
   * @public
   * @returns {RegExp}
   */
  get endsWithSingleCharacterAndUnderscoreRegex() {
    return this._endsWithSingleCharacterAndUnderscoreRegex;
  }

  get extremes() {
    return this._extremes;
  }

  set extremes(value) {
    this._extremes = value;
  }

  get normalScaleFactor() {
    return this._normalScaleFactor;
  }

  set normalScaleFactor(value) {
    this._normalScaleFactor = value;
  }

  get translateX() {
    return this._translateX;
  }

  set translateX(value) {
    this._translateX = value;
  }

  get translateY() {
    return this._translateY;
  }

  set translateY(value) {
    this._translateY = value;
  }

  get translateZ() {
    return this._translateZ;
  }

  set translateZ(value) {
    this._translateZ = value;
  }
}

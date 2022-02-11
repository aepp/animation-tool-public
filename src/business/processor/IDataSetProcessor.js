export class IDataSetProcessor {
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
   * @type {object}
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
    this.translateX = this.extremes.xMin;
    this.translateY = this.extremes.yMin;
    this.translateZ = this.extremes.zMin;
  };

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

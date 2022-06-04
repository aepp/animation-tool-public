/**
 * A helper class that holds the pre-processed input data set.
 *
 * @class
 */
export class DataSetModel {
  /**
   * @type {Extremes}
   * @private
   */
  _extremes = {
    xMin: -1,
    xMax: 1,
    yMin: -1,
    yMax: 1,
    zMin: 0,
    zMax: 1
  };

  /**
   * @type {Normalization}
   * @private
   */
  _normalization = {
    scaleFactor: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0
  };

  _framesPerPerson = [];

  _personIndices = [];

  _maxFramesCount;

  /**
   *
   * @param {Extremes} extremes
   * @param {Normalization} normalization
   */
  constructor(
    {
      extremes = undefined,
      normalization = undefined,
      framesPerPerson = undefined,
      framesCount = undefined,
      personIndices = undefined
    } = {
      extremes: undefined,
      normalization: undefined,
      framesPerPerson: undefined,
      framesCount: undefined,
      personIndices: undefined
    }
  ) {
    this._extremes = extremes || this._extremes;
    this._normalization = normalization || this._normalization;
    this._framesPerPerson = framesPerPerson;
    this._maxFramesCount = framesCount;
    this._personIndices = personIndices;
  }

  get extremes() {
    return this._extremes;
  }

  set extremes(value) {
    this._extremes = value;
  }

  get normalization() {
    return this._normalization;
  }

  set normalization(value) {
    this._normalization = value;
  }
  get framesPerPerson() {
    return this._framesPerPerson;
  }

  set framesPerPerson(value) {
    this._framesPerPerson = value;
  }

  get maxFramesCount() {
    return this._maxFramesCount;
  }

  set maxFramesCount(value) {
    this._maxFramesCount = value;
  }

  get personIndices() {
    return this._personIndices;
  }

  set personIndices(value) {
    this._personIndices = value;
  }
}

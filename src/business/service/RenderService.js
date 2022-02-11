import {LineBasicMaterial, PointsMaterial, Math as ThreeMath} from 'three';

export class RenderService {
  _pointsMaterial = new PointsMaterial({size: 0.01, color: 0xff3333});

  _lineMaterial = new LineBasicMaterial({
    color: 0x222222,
    linewidth: 2
  });

  /**
   * @type {{zMin: number, yMin: number, zMax: number, yMax: number, xMax: number, xMin: number}}
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
   *
   * @type {{translateZ: number, translateY: number, scaleFactor: number, translateX: number}}
   * @private
   */
  _normalization = {
    scaleFactor: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0
  };

  constructor({extremes, normalization}) {
    this._extremes = extremes;
    this._normalization = normalization;
  }

  getDefaultCameraPosition = ({fov}) => [
    0,
    0,
    this.calculateFovDistance({fov}) + 0.01
  ];

  getDefaultCameraLookAt = ({fov}) => [
    0,
    0,
    this.calculateFovDistance({fov})+ 0.01
  ];

  calculateFovDistance = ({fov = 45}) =>
    // (this.extremes.xMax - this.extremes.xMin - this.normalization.translateX) /
    // this.normalization.scaleFactor /
    // (2 * Math.tan(ThreeMath.degToRad(fov / 2)));
    // tan(45/2) = h/2 / x
    (this.extremes.yMax - this.extremes.yMin - this.normalization.translateY) /
    this.normalization.scaleFactor /
    2 /
    Math.tan(ThreeMath.degToRad(fov  / 2));

  get lineMaterial() {
    return this._lineMaterial;
  }

  get pointsMaterial() {
    return this._pointsMaterial;
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
}

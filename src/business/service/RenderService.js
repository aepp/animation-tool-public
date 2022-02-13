import {
  LineBasicMaterial,
  PointsMaterial,
  Math as ThreeMath,
  BufferGeometry,
  Line,
  Points,
  Vector3,
  Float32BufferAttribute,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
import {Line2} from 'three/examples/jsm/lines/Line2';

export class RenderService {
  /* BEGIN: "abstract" methods (may / should be overwritten in corresponding render service implementations) */
  /**
   * @returns {[number[]]} array of tuples with indices of two adjacent parts
   */
  getAdjacentJointPairs = () => [[0, 0]];
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3 | Vector2}
   */
  getVector({x, y, z = 0}) {
    return new Vector3(x, y, z).getPositionFromMatrix();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Float32BufferAttribute}
   */
  getPoint({x, y, z = 0}) {
    return new Float32BufferAttribute([x, y, z], 3);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number[]}
   */
  getPositions({x, y, z}) {
    return [x, y, z];
  }
  /* END "abstract" methods */

  /**
   * @type {PointsMaterial}
   * @private
   */
  _pointsMaterial = new PointsMaterial({size: 0.01, color: 0xff3333});

  /**
   *
   * @type {LineBasicMaterial}
   * @private
   */
  _lineMaterial = new LineBasicMaterial({
    color: 0x222222,
    linewidth: 2
  });

  _fatLineMaterial = new LineMaterial({
    color: 0xffffff,
    linewidth: 10, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true
  });

  /**
   *
   * @type {MeshBasicMaterial}
   * @private
   */
  _meshMaterial = new MeshBasicMaterial({color: 0xff0000});

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

  /**
   *
   * @param {{zMin: number, yMin: number, zMax: number, yMax: number, xMax: number, xMin: number}} extremes
   * @param {{translateZ: number, translateY: number, scaleFactor: number, translateX: number}} normalization
   */
  constructor({extremes, normalization}) {
    this._extremes = extremes;
    this._normalization = normalization;
    this._fatLineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  }

  /**
   *
   * @param frame
   * @returns {*[]}
   */
  generateAnimationObjectsFromFrame = ({frame}) => {
    const objects = [];
    this.getAdjacentJointPairs().forEach(([i, j]) => {
      for (const person of frame) {
        // fat lines

        let positions = [];
        positions.push(...this.getPositions(person.keyPoints[i]));
        positions.push(...this.getPositions(person.keyPoints[j]));
        let geometry = new LineGeometry();
        geometry.setPositions(positions);
        // geometry.setColors( [255, 0, 0, 0, 255, 20] );

        objects.push(new Line2(geometry, this.fatLineMaterial));

        // lines
        // let geometry = new BufferGeometry();
        //
        // objects.push(
        //   new Line(
        //     geometry.setFromPoints([
        //       this.getVector(person.keyPoints[i]),
        //       this.getVector(person.keyPoints[j])
        //     ]),
        //     this.lineMaterial
        //   )
        // );
        //
        // points
        // geometry = new BufferGeometry();
        // objects.push(
        //   new Points(
        //     geometry.setAttribute(
        //       'position',
        //       this.getPoint(person.keyPoints[i])
        //     ),
        //     this.pointsMaterial
        //   )
        // );

        // spheres
        const sphere = new Mesh(
          new SphereGeometry(0.005, 32, 16),
          this.meshMaterial
        );

        sphere.position.set(...this.getPositions(person.keyPoints[i]));

        objects.push(sphere);
      }
    });
    return objects;
  };

  calculateFovDistance = ({fov = 45}) =>
    (this.extremes.yMax + 0.01 - (this.extremes.yMin - 0.01)) /
    this.normalization.scaleFactor /
    2 /
    Math.tan(ThreeMath.degToRad(fov / 2));

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

  get meshMaterial() {
    return this._meshMaterial;
  }

  set meshMaterial(value) {
    this._meshMaterial = value;
  }

  get fatLineMaterial() {
    return this._fatLineMaterial;
  }

  set fatLineMaterial(value) {
    this._fatLineMaterial = value;
  }
}

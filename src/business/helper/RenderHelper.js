import {
  Math as ThreeMath,
  Vector3,
  Float32BufferAttribute,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferGeometry,
  LineDashedMaterial,
  Line,
  // eslint-disable-next-line no-unused-vars
  Object3D
} from 'three';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
import {Line2} from 'three/examples/jsm/lines/Line2';

/**
 * @typedef CoordinateObjectType
 * @type {object}
 * @property {number} x
 * @property {number} y
 * @property {number} [z]
 */

/**
 * This class is responsible for animation rendering. This is a generic class
 * that provides the most common rendering features. The 2D and 3D rendering aspects
 * are covered in the corresponding render helpers.
 *
 * @abstract
 */
export class RenderHelper {
  /* BEGIN: "abstract" methods (may / should be overwritten in corresponding render service implementations) */
  /**
   * @abstract
   * @returns {number[][]} array of tuples with indices of two adjacent parts
   */
  getAdjacentJointPairs = () => [[0, 0]];
  /**
   * Returns a Three.js vector object from provided coordinates.
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
   * Returns a Three.js point object from provided coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Float32BufferAttribute}
   */
  getPoint({x, y, z = 0}) {
    return new Float32BufferAttribute([x, y, z], 3);
  }

  /**
   * Return coordinates object as a flat array where position 0 corresponds to X, 1 to Y and 2 to Z coordinate.
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
   * A Three.js material object used for body joints.
   *
   * @constant
   * @type {LineMaterial}
   * @private
   */
  _fatLineMaterial = new LineMaterial({
    color: 0xffffff,
    linewidth: 10, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true
  });

  /**
   * An object holding the pre-processed data set.
   *
   * @type {DataSetModel}
   * @private
   */
  _dataSetModel;

  /**
   * An array of body joints connection points represented as spheres.
   *
   * @type {Mesh[]}
   * @private
   */
  _spheres = [];

  /**
   * An array of body joints represented as lines.
   *
   * @type {Line2[]}
   * @private
   */
  _lines = [];

  /**
   * @type {LineGeometry[]}
   * @private
   */
  _lineGeometries = [];

  /**
   * @param {DataSetModel} dataSetModel
   */
  constructor({dataSetModel}) {
    this._dataSetModel = dataSetModel;
    this._fatLineMaterial.resolution.set(window.innerWidth, window.innerHeight);

    dataSetModel.personIndices.forEach(personIdx => {
      this._spheres[personIdx] = this._spheres[personIdx] || [];
      this._lineGeometries[personIdx] = this._lineGeometries[personIdx] || [];
      this._lines[personIdx] = this._lines[personIdx] || [];
    });
  }

  /**
   *
   * @param {number} frameIdx
   * @returns {{toAdd: Object3D[], toRemove: Object3D[]}}
   */
  generateAnimationObjectsFromFrame = ({frameIdx}) => {
    const frame = this.dataSetModel.framesPerPerson[frameIdx];
    const objectIdsPerPerson = this.dataSetModel.personIndices.reduce(
      (objectIds, personIdx) => {
        objectIds[personIdx] = 0;
        return objectIds;
      },
      []
    );

    const nonOrphanPersonIds = [];
    this.getAdjacentJointPairs().forEach(([i, j]) => {
      for (const [personIdx, person] of frame.entries()) {
        if (!person.keyPoints.length) continue;
        const pId =
          typeof person.personIdx !== 'undefined'
            ? person.personIdx
            : personIdx;
        nonOrphanPersonIds.push(pId);
        // fat lines
        const objectIdx = objectIdsPerPerson[pId];
        this._lineGeometries[pId][objectIdx] =
          this._lineGeometries[pId][objectIdx] || new LineGeometry();

        this._lineGeometries[pId][objectIdx].setPositions([
          ...this.getPositions(person.keyPoints[i]),
          ...this.getPositions(person.keyPoints[j])
        ]);

        // geometry.setColors( [255, 0, 0, 0, 255, 20] );

        this._lines[pId][objectIdx] =
          this._lines[pId][objectIdx] ||
          new Line2(
            this._lineGeometries[pId][objectIdx],
            this._fatLineMaterial
          );
        this._lines[pId][objectIdx].geometry =
          this._lineGeometries[pId][objectIdx];
        this._lines[pId][objectIdx].updateMorphTargets();

        // spheres
        this._updateSphere({
          personIdx: pId,
          sphereIdx: i,
          keyPoints: person.keyPoints
        });
        this._updateSphere({
          personIdx: pId,
          sphereIdx: j,
          keyPoints: person.keyPoints
        });

        this._lines[pId][objectIdx].castShadow = true;
        this._lines[pId][objectIdx].receiveShadow = true;

        objectIdsPerPerson[pId]++;
      }
    });

    const orphanPersonIds = this.dataSetModel.personIndices.filter(
      pId => !nonOrphanPersonIds.includes(pId)
    );

    return {
      toAdd: [
        ...this._spheres
          .filter((s, i) => !orphanPersonIds.includes(i))
          .reduce(
            (allSpheres, personsSpheres) => [...allSpheres, ...personsSpheres],
            []
          ),
        ...this._lines
          .filter((l, i) => !orphanPersonIds.includes(i))
          .reduce(
            (allLines, personsLines) => [...allLines, ...personsLines],
            []
          )
      ],
      toRemove: [
        ...this._spheres
          .filter((s, i) => orphanPersonIds.includes(i))
          .reduce(
            (allSpheres, personsSpheres) => [...allSpheres, ...personsSpheres],
            []
          ),
        ...this._lines
          .filter((l, i) => orphanPersonIds.includes(i))
          .reduce(
            (allLines, personsLines) => [...allLines, ...personsLines],
            []
          )
      ]
    };
  };

  /**
   *
   * @param {number} personIdx
   * @param {number} sphereIdx
   * @param {Array.<CoordinateObjectType>} keyPoints
   * @private
   */
  _updateSphere({personIdx, sphereIdx, keyPoints}) {
    this._spheres[personIdx][sphereIdx] =
      this._spheres[personIdx][sphereIdx] ||
      new Mesh(
        new SphereGeometry(0.005, 32, 16),
        new MeshBasicMaterial({color: 0xff0000})
      );
    this._spheres[personIdx][sphereIdx].userData = {
      ...keyPoints[sphereIdx],
      personIdx
    };
    this._spheres[personIdx][sphereIdx].position.set(
      ...this.getPositions(keyPoints[sphereIdx])
    );
  }
  /**
   * Simulates a "room" for the skeleton move in
   *
   * @returns {Line | Object3D}
   */
  generateRoom() {
    const geometryFrame = new BufferGeometry();
    const materialFrame = new LineDashedMaterial({
      color: 0xff0000,
      linewidth: 0.2,
      scale: 1,
      dashSize: 0.01,
      gapSize: 0.01
    });

    const pointsFrame = [];

    const BOTTOM_LEFT = [
      (this.dataSetModel.extremes.xMin -
        this.dataSetModel.normalization.translateX) /
        this.dataSetModel.normalization.scaleFactor,
      (this.dataSetModel.extremes.yMin -
        this.dataSetModel.normalization.translateY) /
        this.dataSetModel.normalization.scaleFactor,
      this.dataSetModel.extremes.zMin - 0.5
    ];
    const BOTTOM_RIGHT = [
      (this.dataSetModel.extremes.xMax -
        this.dataSetModel.normalization.translateX) /
        this.dataSetModel.normalization.scaleFactor,
      (this.dataSetModel.extremes.yMin -
        this.dataSetModel.normalization.translateY) /
        this.dataSetModel.normalization.scaleFactor,
      this.dataSetModel.extremes.zMin - 0.5
    ];
    const TOP_RIGHT = [
      (this.dataSetModel.extremes.xMax -
        this.dataSetModel.normalization.translateX) /
        this.dataSetModel.normalization.scaleFactor,
      (this.dataSetModel.extremes.yMax -
        this.dataSetModel.normalization.translateY) /
        this.dataSetModel.normalization.scaleFactor,
      this.dataSetModel.extremes.zMin - 0.5
    ];
    const TOP_LEFT = [
      (this.dataSetModel.extremes.xMin -
        this.dataSetModel.normalization.translateX) /
        this.dataSetModel.normalization.scaleFactor,
      (this.dataSetModel.extremes.yMax -
        this.dataSetModel.normalization.translateY) /
        this.dataSetModel.normalization.scaleFactor,
      this.dataSetModel.extremes.zMin - 0.5
    ];

    pointsFrame.push(new Vector3(...BOTTOM_LEFT));
    pointsFrame.push(new Vector3(...BOTTOM_RIGHT));
    pointsFrame.push(new Vector3(...TOP_RIGHT));
    pointsFrame.push(new Vector3(...TOP_LEFT));
    pointsFrame.push(new Vector3(...BOTTOM_LEFT));

    geometryFrame.setFromPoints(pointsFrame);

    const lineFrame = new Line(geometryFrame, materialFrame);
    lineFrame.computeLineDistances();

    return lineFrame;
  }

  calculateFovDistance = ({fov = 45} = {fov: 45}) =>
    (this.dataSetModel.extremes.yMax +
      0.01 -
      (this.dataSetModel.extremes.yMin - 0.01)) /
    this.dataSetModel.normalization.scaleFactor /
    2 /
    Math.tan(ThreeMath.degToRad(fov / 2));

  softReset() {
    this._dataSetModel = undefined;
    return this;
  }

  get dataSetModel() {
    return this._dataSetModel;
  }

  set dataSetModel(value) {
    this._dataSetModel = value;
  }
}

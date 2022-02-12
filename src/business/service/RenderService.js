import {
  LineBasicMaterial,
  PointsMaterial,
  Math as ThreeMath,
  BufferGeometry,
  Line,
  Points,
  Vector3,
  Bone,
  Float32BufferAttribute,
  Skeleton,
  CylinderGeometry,
  Uint16BufferAttribute,
  SkinnedMesh
} from 'three';

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
    return new Vector3(x, y, z);
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
        // lines
        let geometry = new BufferGeometry();
        // const bone1 = new Bone();
        // const bone2 = new Bone();
        //
        //
        // bone1.position.set(person.keyPoints[i].x, person.keyPoints[i].y, person.keyPoints[i].z);
        // bone2.position.set(person.keyPoints[j].x, person.keyPoints[j].y, person.keyPoints[j].z);
        //
        // bone1.add(bone2);
        //
        // const bones = [bone1, bone2];
        //
        // const bodyPartSkeleton = new Skeleton( bones );
        // objects.push(bodyPartSkeleton);

//         const bones = [];
//         const shoulder = new Bone();
//         const elbow = new Bone();
//         const hand = new Bone();
//
//         shoulder.add( elbow );
//         elbow.add( hand );
//
//         bones.push( shoulder );
//         bones.push( elbow );
//         bones.push( hand );
//
//         shoulder.position.y = -5;
//         elbow.position.y = 0;
//         hand.position.y = 5;
//
//         const armSkeleton = new Skeleton( bones );
//
//         geometry = new CylinderGeometry( 1, 1, 1, 5, 15, 5, 30 );
//
// // create the skin indices and skin weights
//
//         const position = geometry.attributes.position;
//
//         const vertex = new Vector3();
//
//         const skinIndices = [];
//         const skinWeights = [];
//
//         const sizing = {
//           segmentHeight: 0.1
//         };
//         for ( let i = 0; i < position.count; i ++ ) {
//
//           vertex.fromBufferAttribute( position, i );
//
//           // compute skinIndex and skinWeight based on some configuration data
//
//           const y = ( vertex.y + sizing.halfHeight );
//
//           const skinIndex = Math.floor( y / sizing.segmentHeight );
//           const skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;
//
//           skinIndices.push( skinIndex, skinIndex + 1, 0, 0 );
//           skinWeights.push( 1 - skinWeight, skinWeight, 0, 0 );
//
//         }
//
//         geometry.setAttribute( 'skinIndex', new Uint16BufferAttribute( skinIndices, 4 ) );
//         geometry.setAttribute( 'skinWeight', new Float32BufferAttribute( skinWeights, 4 ) );
//
// // create skinned mesh and skeleton
//
//         const mesh = new SkinnedMesh( geometry );
//         const skeleton = new Skeleton( bones );
//
// // see example from Skeleton
//
//         const rootBone = skeleton.bones[ 0 ];
//         mesh.add( rootBone );
//
// // bind the skeleton to the mesh
//
//         mesh.bind( skeleton );
//
// // move the bones and manipulate the model
//
//         skeleton.bones[ 0 ].rotation.x = -0.1;
//         skeleton.bones[ 1 ].rotation.x = 0.2;
// objects.push(mesh);
        objects.push(
          new Line(
            geometry.setFromPoints([
              this.getVector(person.keyPoints[i]),
              this.getVector(person.keyPoints[j])
            ]),
            this.lineMaterial
          )
        );

        // points
        geometry = new BufferGeometry();
        objects.push(
          new Points(
            geometry.setAttribute(
              'position',
              this.getPoint(person.keyPoints[i])
            ),
            this.pointsMaterial
          )
        );
      }
    });
    return objects;
  };

  calculateFovDistance = ({fov = 45}) =>
    (this.extremes.yMax +0.01 - (this.extremes.yMin - 0.01)) /
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
}

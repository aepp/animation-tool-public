import {
  LineDashedMaterial,
  BufferGeometry,
  Line,
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  Vector2,
  Bone,
  Skeleton,
  Points,
  Float32BufferAttribute,
  PointsMaterial,
  Vector3,
  Vector4,
  CatmullRomCurve3,
  CylinderGeometry,
  Uint16BufferAttribute,
  SkinnedMesh,
  PointLight,
  Clock,
  SphereGeometry,
  SkeletonHelper,
  MeshPhongMaterial,
  Mesh,
  LatheGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
} from 'three';
import {BACKGROUND_COLOR} from '../../react/theme/constants';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry';
import {Line2} from 'three/examples/jsm/lines/Line2';
import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GPUStatsPanel} from 'three/examples/jsm/utils/GPUStatsPanel';
import Stats from 'three/examples/jsm/libs/stats.module';
import {GUI} from 'three/examples/jsm/libs/dat.gui.module';

export class SimpleTestAnimationController {
  _rootElement;

  // js
  /**
   *
   * @type {number}
   * @private
   */
  _fov = 45;

  _renderer;

  _scene;

  _camera;

  /**
   *
   * @type {[]}
   * @private
   */
  _currentFrameObjects = [];

  // helper classes
  _renderService;

  _keyPoints = [
    {
      y: -0.17079232002806818,
      x: -0.058716062273655695,
      score: 0.9846470355987549,
      name: 'nose',
      z: 0
    },
    {
      y: -0.18035486827754557,
      x: -0.05601380028855555,
      score: 0.9379436373710632,
      name: 'left_eye',
      z: 0
    },
    {
      y: -0.1763582956088482,
      x: -0.05896212818370475,
      score: 0.9581384062767029,
      name: 'right_eye',
      z: 0
    },
    {
      y: -0.16879308446815958,
      x: -0.05453797103298114,
      score: 0.7924033403396606,
      name: 'left_ear',
      z: 0
    },
    {
      y: -0.1712793893118469,
      x: -0.08246841688698853,
      score: 0.9538963437080383,
      name: 'right_ear',
      z: 0
    },
    {
      y: -0.12358183741880549,
      x: -0.042844344789251775,
      score: 0.9978839159011841,
      name: 'left_shoulder',
      z: 0
    },
    {
      y: -0.1228536981489771,
      x: -0.12709710589185588,
      score: 0.9976512789726257,
      name: 'right_shoulder',
      z: 0
    },
    {
      y: -0.05320325685485654,
      x: -0.007827447191415619,
      score: 0.9981918931007385,
      name: 'left_elbow',
      z: 0
    },
    {
      y: -0.056463397019886535,
      x: -0.1612134382295653,
      score: 0.9910481572151184,
      name: 'right_elbow',
      z: 0
    },
    {
      y: 0.013575760467545113,
      x: 0.01817443877419429,
      score: 0.9927351474761963,
      name: 'left_wrist',
      z: 0
    },
    {
      y: 0.009182977719537598,
      x: -0.09287186241096015,
      score: 0.9686403870582581,
      name: 'right_wrist',
      z: 0
    },
    {
      y: 0.009344812350957207,
      x: -0.043076955010662527,
      score: 0.9941717982292175,
      name: 'left_hip',
      z: 0
    },
    {
      y: 0.013661323992574389,
      x: -0.12525827279848714,
      score: 0.995760977268219,
      name: 'right_hip',
      z: 0
    },
    {
      y: 0.11165983708088978,
      x: -0.03305070174864346,
      score: 0.9961483478546143,
      name: 'left_knee',
      z: 0
    },
    {
      y: 0.10789057895416385,
      x: -0.14422256715698212,
      score: 0.997768759727478,
      name: 'right_knee',
      z: 0
    },
    {
      y: 0.22620957992984364,
      x: 0.011261545430103666,
      score: 0.993036687374115,
      name: 'left_ankle',
      z: 0
    },
    {
      y: 0.21581812462347053,
      x: -0.18219628572076643,
      score: 0.9903964400291443,
      name: 'right_ankle',
      z: 0
    }
  ];

  constructor(
    {rootElement = document.body} = {
      rootElement: document.body
    }
  ) {
    this.rootElement = rootElement;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
    this.rootElement.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  init() {
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);

    this.camera = new PerspectiveCamera(
      this.fov,
      this.rootElement.clientWidth / this.rootElement.clientHeight,
      0.01,
      20
    );
    this.camera.position.set(0, 0, 2);

    const geometryFrame = new BufferGeometry();
    const materialFrame = new LineDashedMaterial({
      color: 0xff0000,
      linewidth: 0.2,
      scale: 1,
      dashSize: 0.01,
      gapSize: 0.01
    });

    geometryFrame.setFromPoints([new Vector2(-1, 0), new Vector2(1, 0)]);

    const lineFrame = new Line(geometryFrame, materialFrame);
    lineFrame.computeLineDistances();

    this.scene.add(lineFrame);

    this.renderPrettyLinesExample();
    // this.renderPrettyLines();
    // this.renderModeledSkeleton();

    this.renderer.render(this.scene, this.camera);
    return this;
  }

  renderPrettyLinesExample(){
    const renderer = this.renderer;
    const scene = this.scene;

    let line, camera, camera2, controls;
    let line1;
    let matLine, matLineBasic, matLineDashed;
    let stats, gpuPanel;
    let gui;

    // viewport
    let insetWidth;
    let insetHeight;

    init();
    animate();

    function init() {

      // renderer = new WebGLRenderer( { antialias: true } );
      // renderer.setPixelRatio( window.devicePixelRatio );
      // renderer.setClearColor( 0x000000, 0.0 );
      // renderer.setSize( window.innerWidth, window.innerHeight );
      // document.body.appendChild( renderer.domElement );

      // scene = new Scene();

      camera = new PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.set( - 40, 0, 60 );

      camera2 = new PerspectiveCamera( 40, 1, 1, 1000 );
      camera2.position.copy( camera.position );

      controls = new OrbitControls( camera, renderer.domElement );
      controls.minDistance = 10;
      controls.maxDistance = 500;


      // Position and Color Data

      const positions = [];
      const colors = [];

      const points = GeometryUtils.hilbert3D( new Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );

      const spline = new CatmullRomCurve3( points );
      const divisions = Math.round( 12 * points.length );
      const point = new Vector3();
      const color = new Color();

      for ( let i = 0, l = divisions; i < l; i ++ ) {

        const t = i / l;

        spline.getPoint( t, point );
        positions.push( point.x, point.y, point.z );

        color.setHSL( t, 1.0, 0.5 );
        colors.push( color.r, color.g, color.b );

      }


      // Line2 ( LineGeometry, LineMaterial )

      const geometry = new LineGeometry();
      geometry.setPositions( positions );
      geometry.setColors( colors );

      matLine = new LineMaterial( {

        color: 0xffffff,
        linewidth: 5, // in world units with size attenuation, pixels otherwise
        vertexColors: true,

        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true,

      } );

      line = new Line2( geometry, matLine );
      line.computeLineDistances();
      line.scale.set( 1, 1, 1 );
      scene.add( line );


      // Line ( BufferGeometry, LineBasicMaterial ) - rendered with gl.LINE_STRIP

      const geo = new BufferGeometry();
      geo.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
      geo.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

      matLineBasic = new LineBasicMaterial( { vertexColors: true } );
      matLineDashed = new LineDashedMaterial( { vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 } );

      line1 = new Line( geo, matLineBasic );
      line1.computeLineDistances();
      line1.visible = false;
      scene.add( line1 );

      //

      window.addEventListener( 'resize', onWindowResize );
      onWindowResize();

      stats = new Stats();
      document.body.appendChild( stats.dom );

      gpuPanel = new GPUStatsPanel( renderer.getContext() );
      stats.addPanel( gpuPanel );
      stats.showPanel( 0 );

      initGui();

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

      insetWidth = window.innerHeight / 4; // square
      insetHeight = window.innerHeight / 4;

      camera2.aspect = insetWidth / insetHeight;
      camera2.updateProjectionMatrix();

    }

    function animate() {

      requestAnimationFrame( animate );

      stats.update();

      // main scene

      renderer.setClearColor( 0x000000, 0 );

      renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );

      // renderer will set this eventually
      matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport

      gpuPanel.startQuery();
      renderer.render( scene, camera );
      gpuPanel.endQuery();

      // inset scene

      renderer.setClearColor( 0x222222, 1 );

      renderer.clearDepth(); // important!

      renderer.setScissorTest( true );

      renderer.setScissor( 20, 20, insetWidth, insetHeight );

      renderer.setViewport( 20, 20, insetWidth, insetHeight );

      camera2.position.copy( camera.position );
      camera2.quaternion.copy( camera.quaternion );

      // renderer will set this eventually
      matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport

      renderer.render( scene, camera2 );

      renderer.setScissorTest( false );

    }

    //

    function initGui() {

      gui = new GUI();

      const param = {
        'line type': 0,
        'world units': false,
        'width': 5,
        'alphaToCoverage': true,
        'dashed': false,
        'dash scale': 1,
        'dash / gap': 1
      };

      gui.add( param, 'line type', { 'LineGeometry': 0, 'gl.LINE': 1 } ).onChange( function ( val ) {

        switch ( val ) {

          case '0':
            line.visible = true;

            line1.visible = false;

            break;

          case '1':
            line.visible = false;

            line1.visible = true;

            break;

        }

      } );

      gui.add( param, 'world units' ).onChange( function ( val ) {

        matLine.worldUnits = val;
        matLine.needsUpdate = true;

      } );

      gui.add( param, 'width', 1, 10 ).onChange( function ( val ) {

        matLine.linewidth = val;

      } );

      gui.add( param, 'alphaToCoverage' ).onChange( function ( val ) {

        matLine.alphaToCoverage = val;

      } );

      gui.add( param, 'dashed' ).onChange( function ( val ) {

        matLine.dashed = val;
        line1.material = val ? matLineDashed : matLineBasic;

      } );

      gui.add( param, 'dash scale', 0.5, 2, 0.1 ).onChange( function ( val ) {

        matLine.dashScale = val;
        matLineDashed.scale = val;

      } );

      gui.add( param, 'dash / gap', { '2 : 1': 0, '1 : 1': 1, '1 : 2': 2 } ).onChange( function ( val ) {

        switch ( val ) {

          case '0':
            matLine.dashSize = 2;
            matLine.gapSize = 1;

            matLineDashed.dashSize = 2;
            matLineDashed.gapSize = 1;

            break;

          case '1':
            matLine.dashSize = 1;
            matLine.gapSize = 1;

            matLineDashed.dashSize = 1;
            matLineDashed.gapSize = 1;

            break;

          case '2':
            matLine.dashSize = 1;
            matLine.gapSize = 2;

            matLineDashed.dashSize = 1;
            matLineDashed.gapSize = 2;

            break;

        }

      } );

    }
  }

  renderPrettyLines(){
    const geometry = new BufferGeometry();
    const matLine = new LineMaterial( {

      color: 0x333333,
      linewidth: 2, // in world units with size attenuation, pixels otherwise
      vertexColors: true,

      //resolution:  // to be set by renderer, eventually
      dashed: false,
      alphaToCoverage: true,

    } );
    const objects = [];
    poseDetection.util
      .getAdjacentPairs(poseDetection.SupportedModels.PoseNet)
      .forEach(([i, j]) => {
        objects.push(
          new Line(
            geometry.setFromPoints([
              new Vector3(this._keyPoints[i].x, -this._keyPoints[i].y, 0),
              new Vector3(this._keyPoints[j].x, -this._keyPoints[j].y, 0)
            ]),
            new LineBasicMaterial({
              color: 0x222222,
              linewidth: 2
            })
          )
        );
      });

    objects.forEach(o => this.scene.add(o));
  }

  renderModeledSkeleton() {
    const loader = new GLTFLoader();
    loader.load(
      process.env.PUBLIC_URL + '/resources/Soldier.glb',
      function (gltf) {
        console.log(gltf);
        const model = gltf.scene;
        // scene.add( model );
        //
        // createGUI( model, gltf.animations );

        model.traverse(function (object) {
          if (object.isMesh) {
            console.log('isMesh');
          }
          if (object.isMesh) {
            console.log('isBone');
          }
        });
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
  }
  renderSkeleton() {
    const objects = [];
    poseDetection.util
      .getAdjacentPairs(poseDetection.SupportedModels.PoseNet)
      .forEach(([i, j]) => {
        // lines
        let geometry = new BufferGeometry();
        const x = new LineMaterial();
        const cGeometry = new CylinderGeometry( 0.02, 0.02, 0.15, 12 );
        const cMaterial = new MeshBasicMaterial( {color: 0xffff00, skinning: true} );
        const cCylinder = new Mesh(
          cGeometry,
          cMaterial
        );
        // objects.push(
        //   new Line(
        //     geometry.setFromPoints([
        //       new Vector3(this._keyPoints[i].x, -this._keyPoints[i].y, -1),
        //       new Vector3(this._keyPoints[j].x, -this._keyPoints[j].y, -1)
        //     ]),
        //     new LineBasicMaterial({
        //       color: 0x222222,
        //       linewidth: 2
        //     })
        //   )
        // );
        cCylinder.position.set(this._keyPoints[i].x, -this._keyPoints[i].y, -1);
        objects.push(cCylinder);
        // points
        geometry = new BufferGeometry();
        objects.push(
          new Points(
            geometry.setAttribute(
              'position',
              new Float32BufferAttribute(
                [this._keyPoints[i].x, -this._keyPoints[i].y, -1],
                3
              )
            ),
            new PointsMaterial({size: 0.01, color: 0xff3333})
          )
        );
      });
    objects.forEach(o => this.scene.add(o));
    // const cGeometry = new CylinderGeometry( 0.2, 0.2, 0.05, 12 );
    // const cMaterial = new MeshBasicMaterial( {color: 0xffff00, skinning: true} );
    // let cCylinder = new Mesh( cGeometry, cMaterial );
    //
    // this.scene.add( cCylinder );

    const sizing = {
      halfHeight: 0.5,
      segmentHeight: 1
    };

    // const geometry = new CylinderGeometry(1, 1, 1, 5, 15, 5, 30);
    const geometry = new CylinderGeometry(10, 10, 30, 12, 1);

    // create the skin indices and skin weights

    const position = geometry.attributes.position;

    const vertex = new Vector3();

    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      // compute skinIndex and skinWeight based on some configuration data

      const y = vertex.y + sizing.halfHeight;
      const skinIndex = Math.floor(y / sizing.segmentHeight);
      const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

      skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    geometry.setAttribute(
      'skinIndex',
      new Uint16BufferAttribute(skinIndices, 4)
    );
    geometry.setAttribute(
      'skinWeight',
      new Float32BufferAttribute(skinWeights, 4)
    );

    // create skinned mesh and skeleton

    const material = new MeshBasicMaterial({
      color: 0x156289,
      skinning: true
    });

    const mesh = new SkinnedMesh(geometry, material);
    // const bones = [];

    // const nose = new Bone();
    const left_shoulder = new Bone();
    const right_shoulder = new Bone();
    const left_elbow = new Bone();
    const right_elbow = new Bone();
    const left_wrist = new Bone();
    const right_wrist = new Bone();
    const left_hip = new Bone();
    const right_hip = new Bone();
    const left_knee = new Bone();
    const right_knee = new Bone();
    const left_ankle = new Bone();
    const right_ankle = new Bone();

    // nose.add(left_shoulder);
    left_elbow.add(left_wrist);
    left_shoulder.add(left_elbow);

    // left_shoulder.add(right_shoulder);

    // nose.add(right_shoulder);
    // right_shoulder.add(right_elbow);
    // right_elbow.add(right_wrist);

    // left_shoulder.add(left_hip);
    // right_shoulder.add(right_hip);
    //
    // left_hip.add(left_knee);
    // left_knee.add(left_ankle);
    //
    // // left_hip.add(right_hip);
    //
    // right_hip.add(right_knee);
    // right_knee.add(right_ankle);

    const bones = [
      // nose,
      left_shoulder,
      // right_shoulder,
      left_elbow,
      // right_elbow,
      left_wrist,
      // right_wrist,
      // left_hip,
      // right_hip,
      // left_knee,
      // right_knee,
      // left_ankle,
      // right_ankle
    ];

    // nose.position.x = this._keyPoints.filter(p => p.name === 'nose')[0].x;
    // nose.position.y = -this._keyPoints.filter(p => p.name === 'nose')[0].y;
    left_shoulder.position.x = this._keyPoints.filter(
      p => p.name === 'left_shoulder'
    )[0].x;
    left_shoulder.position.y = -this._keyPoints.filter(
      p => p.name === 'left_shoulder'
    )[0].y;
    right_shoulder.position.x = this._keyPoints.filter(
      p => p.name === 'right_shoulder'
    )[0].x;
    right_shoulder.position.y = -this._keyPoints.filter(
      p => p.name === 'right_shoulder'
    )[0].y;
    left_elbow.position.x = this._keyPoints.filter(
      p => p.name === 'left_elbow'
    )[0].x;
    left_elbow.position.y = -this._keyPoints.filter(
      p => p.name === 'left_elbow'
    )[0].y;
    right_elbow.position.x = this._keyPoints.filter(
      p => p.name === 'right_elbow'
    )[0].x;
    right_elbow.position.y = -this._keyPoints.filter(
      p => p.name === 'right_elbow'
    )[0].y;
    left_wrist.position.x = this._keyPoints.filter(
      p => p.name === 'left_wrist'
    )[0].x;
    left_wrist.position.y = -this._keyPoints.filter(
      p => p.name === 'left_wrist'
    )[0].y;
    right_wrist.position.x = this._keyPoints.filter(
      p => p.name === 'right_wrist'
    )[0].x;
    right_wrist.position.y = -this._keyPoints.filter(
      p => p.name === 'right_wrist'
    )[0].y;
    left_hip.position.x = this._keyPoints.filter(
      p => p.name === 'left_hip'
    )[0].x;
    left_hip.position.y = -this._keyPoints.filter(p => p.name === 'left_hip')[0]
      .y;
    right_hip.position.x = this._keyPoints.filter(
      p => p.name === 'right_hip'
    )[0].x;
    right_hip.position.y = -this._keyPoints.filter(
      p => p.name === 'right_hip'
    )[0].y;
    left_knee.position.x = this._keyPoints.filter(
      p => p.name === 'left_knee'
    )[0].x;
    left_knee.position.y = -this._keyPoints.filter(
      p => p.name === 'left_knee'
    )[0].y;
    right_knee.position.x = this._keyPoints.filter(
      p => p.name === 'right_knee'
    )[0].x;
    right_knee.position.y = -this._keyPoints.filter(
      p => p.name === 'right_knee'
    )[0].y;
    left_ankle.position.x = this._keyPoints.filter(
      p => p.name === 'left_ankle'
    )[0].x;
    left_ankle.position.y = -this._keyPoints.filter(
      p => p.name === 'left_ankle'
    )[0].y;
    right_ankle.position.x = this._keyPoints.filter(
      p => p.name === 'right_ankle'
    )[0].x;
    right_ankle.position.y = -this._keyPoints.filter(
      p => p.name === 'right_ankle'
    )[0].y;

    // const head = new Bone();
    // const shoulder = new Bone();
    // const elbow = new Bone();
    // const hand = new Bone();
    //
    // head.add(shoulder);
    // shoulder.add(elbow);
    // elbow.add(hand);
    //
    // bones.push(head);
    // bones.push(shoulder);
    // bones.push(elbow);
    // bones.push(hand);
    //
    // head.position.y = -3;
    // head.position.x = 0.5;
    // head.position.z = 0;
    //
    // shoulder.position.y = -1.5;
    // shoulder.position.x = 0;
    // shoulder.position.z = 0;
    //
    // elbow.position.y = -0;
    // elbow.position.x = -0.5;
    // elbow.position.z = 0;
    //
    // hand.position.y = --1;
    // hand.position.x = 0;
    // hand.position.z = 0;

    const skeleton = new Skeleton(bones);

    // see example from Skeleton

    const rootBone = skeleton.bones[0];
    mesh.add(rootBone);

    // bind the skeleton to the mesh

    mesh.bind(skeleton);

    // move the bones and manipulate the model

    // skeleton.bones[ 0 ].rotation.x = -0.1;
    // skeleton.bones[ 1 ].rotation.x = 0.2;

    const helper = new SkeletonHelper(mesh);
    this.scene.add(helper);
  }

  async animationLoop() {
    await new Promise(resolve => setTimeout(resolve, this.playbackSpeed));
    requestAnimationFrame(this.animationLoop.bind(this));
    this.playAnimation.call(this);
    return this;
  }

  playAnimation() {
    this.renderCurrentFrame();
    return this;
  }

  renderCurrentFrame() {
    this.currentFrameObjects.forEach(o => this.scene.remove(o));
    this.currentFrameObjects = [];

    // @todo generate objects here
    // ...

    this.currentFrameObjects.forEach(o => this.scene.add(o));

    this.renderer.render(this.scene, this.camera);
    return this;
  }

  reset() {
    this.renderer.resetState();
    return this;
  }

  get scene() {
    return this._scene;
  }

  set scene(value) {
    this._scene = value;
  }

  get camera() {
    return this._camera;
  }

  set camera(value) {
    this._camera = value;
  }

  get rootElement() {
    return this._rootElement;
  }

  set rootElement(value) {
    this._rootElement = value;
  }

  get renderer() {
    return this._renderer;
  }

  set renderer(value) {
    this._renderer = value;
  }

  get currentFrameObjects() {
    return this._currentFrameObjects;
  }

  set currentFrameObjects(value) {
    this._currentFrameObjects = value;
  }

  get fov() {
    return this._fov;
  }

  set fov(value) {
    this._fov = value;
  }
}

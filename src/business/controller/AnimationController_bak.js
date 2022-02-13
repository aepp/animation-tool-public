import {
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Points,
  Float32BufferAttribute,
  PointsMaterial,
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera, Vector3
} from 'three';
import {DatasetHelper} from './DatasetHelper';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {PlaybackController} from './PlaybackController';
import {
  DATA_SOURCE_KINECT,
  DATA_SOURCE_TF,
  PLAYBACK_DIRECTION_DEFAULT
} from '../../constants';
import {BACKGROUND_COLOR} from '../../react/theme/constants';
import {UPDATE_CURRENT_FRAME_IDX_FROM_THREE} from '../../react/views/Visualization/modules/Animation/actions/uiChannel';
import {RenderService3D} from '../service/RenderService3D';
import {RenderService2D} from '../service/RenderService2D';
import {UNKNOWN_DATA_SOURCE} from '../../messages';

export class AnimationController extends PlaybackController {
  _rootElement;

  // three.js
  _renderer;

  _scene;

  _currentFrameObjects = [];

  _camera;

  _controls;

  // data
  _threeModel;

  // helper class
  _renderService;

  // feedback to the ui over redux-saga channel
  _sendToUi = () => {};

  constructor(
    {dataSource, rootElement} = {
      rootElement: document.body
    }
  ) {
    super();
    this.rootElement = rootElement;
    this.threeModel = new DatasetHelper({rootElement});

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.threeModel.width, this.threeModel.height);
    this.rootElement.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    switch (dataSource) {
      case DATA_SOURCE_KINECT:
        this._renderService = new RenderService3D();
        break;
      case DATA_SOURCE_TF:
        this._renderService = new RenderService2D();
        break;
      default:
        throw new Error(UNKNOWN_DATA_SOURCE);
    }
  }

  get renderService() {
    return this._renderService;
  }

  set renderService(value) {
    this._renderService = value;
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

  get controls() {
    return this._controls;
  }

  set controls(value) {
    this._controls = value;
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

  get threeModel() {
    return this._threeModel;
  }

  set threeModel(value) {
    this._threeModel = value;
  }

  get sendToUi() {
    return this._sendToUi;
  }

  set sendToUi(value) {
    this._sendToUi = value;
  }

  init() {
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);

    this.camera = new PerspectiveCamera(
      75,
      this.threeModel.width / this.threeModel.height,
      1,
      500
    );
    this.camera.position.set(20, 0, 100);
    this.camera.lookAt(50, 0, 0);

    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.rotateSpeed = 10;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 500;

    return this;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this.threeModel.initFrames({framesPerPerson, framesCount, personIndices});
    return this;
  }

  asPoints() {
    for (const person of this.threeModel.framesPerPerson[
      this.currentFrameIdx
    ]) {
      const vertices = person['points'].flat;

      const geometry = new BufferGeometry();

      this.renderService.createPoint({geometry, vertices});

      const material = new PointsMaterial({size: 1, color: 0xff3333});

      // const mesh = new Mesh( geometry, material );

      const points = new Points(geometry, material);

      this.scene.add(points);
    }
    return this;
  }
  asLines() {
    const frame = this.threeModel.framesPerPerson[this.currentFrameIdx];
    for (const person of frame) {
      const bodyLines = person['points'].bodyLines;

      const material = new LineBasicMaterial({
        color: this.threeModel.colorsPerPerson[person.personIdx]
      });

      for (const bodyLine of bodyLines) {
        const geometry = new BufferGeometry();
        const points = [];
        for (const point of bodyLine) {
          points.push(new Vector3(point.x, point.y, point.z));
        }
        geometry.setFromPoints(points);
        const line = new Line(geometry, material);
        this.scene.add(line);
      }
    }
    return this;
  }

  async animationLoop() {
    await new Promise(resolve => setTimeout(resolve, this.playbackSpeed));
    requestAnimationFrame(this.animationLoop.bind(this));
    this.controls.update();
    this.playAnimation.call(this);
    return this;
  }

  playAnimation() {
    if (this.isPlaying) {
      if (this.playbackDirection === PLAYBACK_DIRECTION_DEFAULT) {
        if (this.currentFrameIdx === this.threeModel.maxFramesCount - 1) {
          this.currentFrameIdx = -1;
        }
        this.currentFrameIdx += 1;
      } else {
        if (this.currentFrameIdx === 0) {
          this.currentFrameIdx = this.threeModel.maxFramesCount;
        }
        this.currentFrameIdx -= 1;
      }

      this.renderCurrentFrame();
    }
    return this;
  }

  renderCurrentFrame() {
    this.scene.clear();
    this.asLines();
    this.asPoints();

    this.sendToUi({
      type: UPDATE_CURRENT_FRAME_IDX_FROM_THREE,
      payload: {currentFrameIdx: this.currentFrameIdx}
    });
    this.renderer.render(this.scene, this.camera);
    return this;
  }

  reset() {
    this.renderer.resetState();
    this.resetPlayback();
    return this;
  }

  set currentFrameIdx(frameIdx) {
    this.threeModel.currentFrameIdx = frameIdx;
  }

  get currentFrameIdx() {
    return this.threeModel.currentFrameIdx;
  }
}
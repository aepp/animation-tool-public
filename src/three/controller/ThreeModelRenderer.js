import {
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  Points,
  Float32BufferAttribute,
  PointsMaterial,
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera
} from 'three';
import {ThreeModel} from './ThreeModel';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import {PlaybackController} from './PlaybackController';
import {PLAYBACK_DIRECTION_DEFAULT} from '../../constants';
import {BACKGROUND_COLOR} from '../../theme/constants';
import {UPDATE_CURRENT_FRAME_IDX_FROM_THREE} from '../../modules/Animation/actions/uiChannel';

export class ThreeModelRenderer extends PlaybackController {
  _rootElement;

  // three.js
  _renderer;

  _scene;

  _camera;

  _controls;

  // data
  _threeModel;

  // feedback to the ui over redux-saga channel
  _sendToUi = () => {};

  constructor(
    {rootElement} = {
      rootElement: document.body
    }
  ) {
    super();
    this.rootElement = rootElement;
    this.threeModel = new ThreeModel({rootElement});

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.threeModel.width, this.threeModel.height);
    this.rootElement.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);
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

      geometry.setAttribute(
        'position',
        new Float32BufferAttribute(vertices, 3)
      );

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

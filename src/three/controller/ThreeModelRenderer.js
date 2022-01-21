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
import {
  PLAYBACK_SPEED_DEFAULT,
  PLAYBACK_DIRECTION_DEFAULT
} from '../../constants';
import {BACKGROUND_COLOR} from '../../theme/constants';
import {
  UPDATE_CURRENT_FRAME_IDX,
  UPDATE_MAX_FRAMES_COUNT
} from '../../modules/Animation/actions/uiChannel';

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

  get sendToUi() {
    return this._sendToUi;
  }

  set sendToUi(value) {
    this._sendToUi = value;
  }

  constructor(
    {rootElement} = {
      rootElement: document.body
    }
  ) {
    super();
    this._rootElement = rootElement;
    this._threeModel = new ThreeModel({rootElement});

    this._renderer = new WebGLRenderer();
    this._renderer.setSize(this._threeModel._width, this._threeModel._height);
    this._rootElement.appendChild(this._renderer.domElement);
    this._renderer.setPixelRatio(window.devicePixelRatio);
  }

  init() {
    this._scene = new Scene();
    this._scene.background = new Color(BACKGROUND_COLOR);

    this._camera = new PerspectiveCamera(
      75,
      this._threeModel._width / this._threeModel._height,
      1,
      500
    );
    this._camera.position.set(20, 0, 100);
    this._camera.lookAt(50, 0, 0);

    this._controls = new TrackballControls(
      this._camera,
      this._renderer.domElement
    );
    this._controls.rotateSpeed = 10;
    this._controls.minDistance = 100;
    this._controls.maxDistance = 500;

    return this;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this._threeModel.initFrames({framesPerPerson, framesCount, personIndices});
    this.sendToUi({
      type: UPDATE_MAX_FRAMES_COUNT,
      payload: {maxFramesCount: framesCount}
    });

    return this;
  }

  asPoints() {
    for (const person of this._threeModel._framesPerPerson[
      this._threeModel._currentFrameIdx
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

      this._scene.add(points);
    }
    return this;
  }
  asLines() {
    const frame =
      this._threeModel._framesPerPerson[this._threeModel._currentFrameIdx];
    for (const person of frame) {
      const bodyLines = person['points'].bodyLines;

      const material = new LineBasicMaterial({
        color: this._threeModel._colorsPerPerson[person.personIdx]
      });

      for (const bodyLine of bodyLines) {
        const geometry = new BufferGeometry();
        const points = [];
        for (const point of bodyLine) {
          points.push(new Vector3(point.x, point.y, point.z));
        }
        geometry.setFromPoints(points);
        const line = new Line(geometry, material);
        this._scene.add(line);
      }
    }
    return this;
  }

  async animateFrames() {
    await new Promise(resolve => setTimeout(resolve, this.playbackSpeed));
    requestAnimationFrame(this.animateFrames.bind(this));
    this._controls.update();
    this.renderFrame.call(this);
    return this;
  }

  renderFrame() {
    if (this.isPlaying) {
      if (this.playbackDirection === PLAYBACK_DIRECTION_DEFAULT) {
        if (
          this._threeModel._currentFrameIdx ===
          this._threeModel._maxFramesCount - 1
        ) {
          this._threeModel._currentFrameIdx = -1;
        }
        this._threeModel._currentFrameIdx += 1;
      } else {
        if (this._threeModel._currentFrameIdx === 0) {
          this._threeModel._currentFrameIdx = this._threeModel._maxFramesCount;
        }
        this._threeModel._currentFrameIdx -= 1;
      }

      this._scene.clear();
      this.asLines();
      this.asPoints();

      this.sendToUi({
        type: UPDATE_CURRENT_FRAME_IDX,
        payload: {currentFrameIdx: this._threeModel._currentFrameIdx}
      });
    }
    this._renderer.render(this._scene, this._camera);
    return this;
  }

  reset() {
    this._renderer.resetState();
    this.playbackDirection = PLAYBACK_DIRECTION_DEFAULT;
    this.playbackSpeed = PLAYBACK_SPEED_DEFAULT;
  }
}

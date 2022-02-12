import {
  LineDashedMaterial,
  BufferGeometry,
  Line,
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  Vector2,
  Points,
  Float32BufferAttribute, PointsMaterial
} from 'three';
import {
  DATA_SOURCE_KINECT,
  DATA_SOURCE_TF,
  PLAYBACK_DIRECTION_DEFAULT
} from '../../constants';
import {BACKGROUND_COLOR} from '../../react/theme/constants';
import {UPDATE_CURRENT_FRAME_IDX_FROM_THREE} from '../../react/views/Visualization/modules/Animation/actions/uiChannel';
import {UNKNOWN_DATA_SOURCE} from '../../messages';
import {RenderService3D} from '../service/RenderService3D';
import {RenderService2D} from '../service/RenderService2D';
import {DatasetHelper} from './DatasetHelper';
import {PlaybackController} from './PlaybackController';

export class AnimationController extends PlaybackController {
  _rootElement;

  // three.js
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
  _datasetHelper;

  _renderService;

  // feedback to the ui over redux-saga channel
  _sendToUi = () => {};

  constructor(
    {rootElement = document.body} = {
      rootElement: document.body
    }
  ) {
    super();
    this.rootElement = rootElement;
    this.datasetHelper = new DatasetHelper();

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
    this.rootElement.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  init({dataSource, extremes, normalization}) {
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);

    console.log('normalization', normalization);
    console.log('extremes', extremes);
    const serviceParameters = {
      rootElement: this.rootElement,
      extremes,
      normalization
    };
    switch (dataSource) {
      case DATA_SOURCE_KINECT:
        this._renderService = new RenderService3D(serviceParameters);
        break;
      case DATA_SOURCE_TF:
        this._renderService = new RenderService2D(serviceParameters);
        break;
      default:
        throw new Error(UNKNOWN_DATA_SOURCE);
    }

    this.camera = new PerspectiveCamera(
      this.fov,
      this.rootElement.clientWidth / this.rootElement.clientHeight,
      0.01,
      10
    );
        this.camera.position.set(0, 0, this.renderService.calculateFovDistance({fov: this.fov}));
        // this.camera.position.set(0, 0, 3);
    //     this.camera.lookAt(...this.renderService.getDefaultCameraLookAt({fov: this.fov}));

    const geometryFrame = new BufferGeometry();
    const materialFrame = new LineDashedMaterial({
      color: 0xff0000,
      linewidth: 0.2,
      scale: 1,
      dashSize: 0.01,
      gapSize: 0.01
    });

    const pointsFrame = [];

    const BOTTOM_LEFT = [(this.renderService.extremes.xMin - this.renderService.normalization.translateX) / this.renderService.normalization.scaleFactor, (this.renderService.extremes.yMin - this.renderService.normalization.translateY) / this.renderService.normalization.scaleFactor];
    const BOTTOM_RIGHT = [(this.renderService.extremes.xMax - this.renderService.normalization.translateX) / this.renderService.normalization.scaleFactor, (this.renderService.extremes.yMin - this.renderService.normalization.translateY) / this.renderService.normalization.scaleFactor];
    const TOP_RIGHT = [(this.renderService.extremes.xMax - this.renderService.normalization.translateX) / this.renderService.normalization.scaleFactor, (this.renderService.extremes.yMax - this.renderService.normalization.translateY) / this.renderService.normalization.scaleFactor];
    const TOP_LEFT = [(this.renderService.extremes.xMin - this.renderService.normalization.translateX) / this.renderService.normalization.scaleFactor, (this.renderService.extremes.yMax - this.renderService.normalization.translateY) / this.renderService.normalization.scaleFactor];

    pointsFrame.push(new Vector2(...BOTTOM_LEFT));
    pointsFrame.push(new Vector2(...BOTTOM_RIGHT));
    pointsFrame.push(new Vector2(...TOP_RIGHT));
    pointsFrame.push(new Vector2(...TOP_LEFT));
    pointsFrame.push(new Vector2(...BOTTOM_LEFT));

    geometryFrame.setFromPoints(pointsFrame);
    const lineFrame = new Line(geometryFrame, materialFrame);
    lineFrame.computeLineDistances();

    this.scene.add(lineFrame);

    // const pointGeometry = new BufferGeometry();
    //
    // this.scene.add(
    //   new Points(
    //     pointGeometry.setAttribute(
    //       'position',
    //       new Float32BufferAttribute([0, 0, -1], 3)
    //     ),
    //     new PointsMaterial({size: 1, color: 0xff3333})
    //   )
    // );

    return this;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this.datasetHelper.initFrames({
      framesPerPerson,
      framesCount,
      personIndices
    });
    return this;
  }

  generateAnimationObjectsFromCurrentFrame() {
    this.currentFrameObjects =
      this.renderService.generateAnimationObjectsFromFrame({
        frame: this.datasetHelper.framesPerPerson[this.currentFrameIdx]
      });
    return this;
  }

  async animationLoop() {
    await new Promise(resolve => setTimeout(resolve, this.playbackSpeed));
    requestAnimationFrame(this.animationLoop.bind(this));
    this.playAnimation.call(this);
    return this;
  }

  playAnimation() {
    if (this.isPlaying) {
      if (this.playbackDirection === PLAYBACK_DIRECTION_DEFAULT) {
        if (this.currentFrameIdx === this.datasetHelper.maxFramesCount - 1) {
          this.currentFrameIdx = -1;
        }
        this.currentFrameIdx += 1;
      } else {
        if (this.currentFrameIdx === 0) {
          this.currentFrameIdx = this.datasetHelper.maxFramesCount;
        }
        this.currentFrameIdx -= 1;
      }

      this.renderCurrentFrame();
    }
    return this;
  }

  renderCurrentFrame() {
    this.currentFrameObjects.forEach(o => this.scene.remove(o));
    this.currentFrameObjects = [];

    this.generateAnimationObjectsFromCurrentFrame();

    this.currentFrameObjects.forEach(o => this.scene.add(o));

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
    this.datasetHelper.currentFrameIdx = frameIdx;
  }

  get currentFrameIdx() {
    return this.datasetHelper.currentFrameIdx;
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

  get datasetHelper() {
    return this._datasetHelper;
  }

  set datasetHelper(value) {
    this._datasetHelper = value;
  }

  get sendToUi() {
    return this._sendToUi;
  }

  set sendToUi(value) {
    this._sendToUi = value;
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

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  // eslint-disable-next-line no-unused-vars
  Object3D
} from 'three';
import {BACKGROUND_COLOR} from '../../react/theme/constants';

/**
 * @class
 */
export class ThreeRenderService {
  /**
   * @type {HTMLElement}
   * @private
   */
  _rootElement;

  /**
   *
   * @type {number}
   * @private
   */
  _fov = 45;

  /**
   * @type {WebGLRenderer}
   * @private
   */
  _renderer;

  /**
   * @type {Scene}
   * @private
   */
  _scene;

  /**
   * @type {PerspectiveCamera}
   * @private
   */
  _camera;

  /**
   * @type {OrbitControls}
   * @private
   */
  _controls;

  constructor(
    {rootElement = document.body} = {
      rootElement: document.body
    }
  ) {
    this._rootElement = rootElement;
    this._renderer = new WebGLRenderer({antialias: true});
    this._renderer.setSize(rootElement.clientWidth, rootElement.clientHeight);
    this._rootElement.appendChild(this._renderer.domElement);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    this._scene = new Scene();
    this._scene.background = new Color(BACKGROUND_COLOR);

    this._camera = new PerspectiveCamera(
      this._fov,
      rootElement.clientWidth / rootElement.clientHeight,
      0.01,
      10
    );

    this.createCameraControls();
  }

  updateCameraPosition({x, y, z}) {
    this._camera.position.set(x, y, z);
  }

  createCameraControls() {
    this._controls =
      this._controls ||
      new OrbitControls(this._camera, this._renderer.domElement);
  }

  /**
   *
   * @param {number} minDistance
   * @param {number} maxDistance
   */
  updateCameraControls({minDistance = undefined, maxDistance = undefined}) {
    if (!Number.isNaN(minDistance)) {
      this._controls.minDistance = minDistance;
    }
    if (!Number.isNaN(maxDistance)) {
      this._controls.maxDistance = maxDistance;
    }
  }

  /**
   * @param {Object3D} object
   */
  addObject(object) {
    this._scene.add(object);
  }

  /**
   * @param {Object3D} object
   */
  removeObject(object) {
    this._scene.remove(object);
  }

  /**
   * @param {Object3D[]} objects
   */
  addObjects(objects) {
    objects.forEach(this.addObject.bind(this));
  }

  /**
   * @param {Object3D[]} objects
   */
  removeObjects(objects) {
    objects.forEach(this.removeObject.bind(this));
  }

  /**
   * @param {Object3D[]} [objectsToRemove]
   * @param {Object3D[]} [objectsToAdd]
   */
  updateScene(
    {objectsToRemove = undefined, objectsToAdd = undefined} = {
      objectsToRemove: undefined,
      objectsToAdd: undefined
    }
  ) {
    if (Array.isArray(objectsToRemove)) {
      this.removeObjects(objectsToRemove);
    }
    if (Array.isArray(objectsToAdd)) {
      this.addObjects(objectsToAdd);
    }
    this._renderer.clearDepth();
    this._renderer.render(this._scene, this._camera);
  }

  softReset() {
    this._renderer.resetState();
    this._scene.clear();
    this._controls.reset();
    return this;
  }

  get fov() {
    return this._fov;
  }
}

export default ThreeRenderService;

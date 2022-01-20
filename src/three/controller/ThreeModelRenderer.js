import {
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  Points,
  Float32BufferAttribute,
  PointsMaterial, WebGLRenderer, Scene, Color, PerspectiveCamera
} from 'three';
import {ThreeModel} from './ThreeModel';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';

export class ThreeModelRenderer {
  _rootElement;

  // three.js
  _renderer;

  _scene;

  _camera;

  _controls;

  // data
  _threeModel;

  constructor(
    {rootElement} = {
      rootElement: document.body
    }
  ) {
    this._rootElement = rootElement;
    this._threeModel = new ThreeModel({rootElement});
  }

  init() {
    this._scene = new Scene();
    this._scene.background = new Color(0xeeeeee);

    this._camera = new PerspectiveCamera(
      75,
      this._threeModel._width / this._threeModel._height,
      1,
      500
    );
    this._camera.position.set(20, 0, 100);
    this._camera.lookAt(50, 0, 0);

    this._renderer = new WebGLRenderer();
    this._renderer.dispose();
    this._renderer.clear();
    this._renderer.setSize(this._threeModel._width, this._threeModel._height);
    this._rootElement.appendChild(this._renderer.domElement);
    this._renderer.setPixelRatio(window.devicePixelRatio);


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
    return this;
  }

  asPoints() {
    for (const person of this._threeModel._framesPerPerson[this._threeModel._currentFrameIdx]) {
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
    const frame = this._threeModel._framesPerPerson[this._threeModel._currentFrameIdx];
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
    await new Promise(resolve => setTimeout(resolve, 50));
    requestAnimationFrame(this.animateFrames.bind(this));
    this._controls.update();
    this.renderFrame.call(this);
    return this;
  }

  renderFrame() {
    if (this._threeModel._currentFrameIdx === this._threeModel._maxFramesCount - 1) {
      this._threeModel._currentFrameIdx = -1;
    }
    this._threeModel._currentFrameIdx += +1;
    this._scene.clear();
    this.asLines();
    this.asPoints();
    this._renderer.render(this._scene, this._camera);
    return this;
  }
}

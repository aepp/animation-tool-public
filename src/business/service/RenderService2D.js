import {Vector2} from 'three';

export class RenderService2D {
  getVector(point) {
    new Vector2(point.x, point.y);
  }
}

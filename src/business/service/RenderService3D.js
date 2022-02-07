import {Float32BufferAttribute, Vector3} from 'three';

export class RenderService3D {
  getVector = point => {
    new Vector3(point.x, point.y, point.z);
  };

  createPoint = ({geometry, vertices}) =>
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
}

import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  Points,
  Vector3
} from 'three';
import {RenderService} from './RenderService';

export class RenderService3D extends RenderService {
  constructor({extremes, normalization}) {
    super({
      extremes,
      normalization
    });
  }

  generateAnimationObjectsFromFrame = ({frame}) => {
    console.log(frame);
    const objects = [];

    for (const person of frame) {
      const bodyLines = person['points'].bodyLines;

      for (const bodyLine of bodyLines) {
        const geometry = new BufferGeometry();
        const points = [];
        for (const point of bodyLine) {
          points.push(this.getVector(point));

          // points
          const pointGeometry = new BufferGeometry();
          objects.push(
            new Points(
              pointGeometry.setAttribute('position', this.getPoint(point)),
              this.pointsMaterial
            )
          );
        }
        geometry.setFromPoints(points);
        objects.push(new Line(geometry, this.lineMaterial));
      }
    }
    return objects;
  };

  getVector = point => new Vector3(point.x, point.y, point.z);
  getPoint = point =>
    new Float32BufferAttribute([point.x, point.y, point.z], 3);
}

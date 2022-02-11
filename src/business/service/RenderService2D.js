import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  Points,
  Vector2
} from 'three';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {RenderService} from './RenderService';

export class RenderService2D extends RenderService {
  constructor({extremes, normalization}) {
    console.log(normalization);
    super({
      extremes: {
        ...extremes,
        zMin: 0,
        zMax: 1
      },
      normalization
    });
  }

  generateAnimationObjectsFromFrame = ({frame}) => {
    console.log(frame);
    const objects = [];
    poseDetection.util
      .getAdjacentPairs(poseDetection.SupportedModels.PoseNet)
      .forEach(([i, j]) => {
        // lines
        let geometry = new BufferGeometry();
        objects.push(
          new Line(
            geometry.setFromPoints([
              this.getVector(frame.keyPoints[i]),
              this.getVector(frame.keyPoints[j])
            ]),
            this.lineMaterial
          )
        );

        // points
        geometry = new BufferGeometry();
        objects.push(
          new Points(
            geometry.setAttribute(
              'position',
              this.getPoint(frame.keyPoints[i])
            ),
            this.pointsMaterial
          )
        );
      });
    return objects;
  };

  getVector = point => new Vector2(point.xNormal, -point.yNormal);
  getPoint = point =>
    new Float32BufferAttribute([point.xNormal, -point.yNormal, 0], 3);
}

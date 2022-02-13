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

  getAdjacentJointPairs = () => poseDetection.util
    .getAdjacentPairs(poseDetection.SupportedModels.PoseNet);

  getVector = ({x, y, z= 0}) => super.getVector({x, y: -y, z: 0});
  getPoint = ({x, y, z}) => super.getPoint({x, y: -y, z: 0});
  getPositions = ({x, y, z}) => super.getPositions({x, y: -y, z: 0});
}

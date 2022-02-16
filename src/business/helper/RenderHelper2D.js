import * as poseDetection from '@tensorflow-models/pose-detection';
import {RenderHelper} from './RenderHelper';

export class RenderHelper2D extends RenderHelper {
  getAdjacentJointPairs = () =>
    poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.PoseNet);

  getVector = ({x, y}) => super.getVector({x, y: -y, z: 0});
  getPoint = ({x, y}) => super.getPoint({x, y: -y, z: 0});
  getPositions = ({x, y}) => super.getPositions({x, y: -y, z: 0});
}

import * as poseDetection from '@tensorflow-models/pose-detection';
// eslint-disable-next-line no-unused-vars
import {SupportedModels} from '@tensorflow-models/pose-detection';
import {RenderHelper} from './RenderHelper';

/**
 * RenderHelper for the 2D animation
 *
 * @class
 * @extends {RenderHelper}
 */
export class RenderHelper2D extends RenderHelper {
  /**
   * @type {SupportedModels}
   * @private
   */
  _tfModel;

  constructor({dataSetModel, tfModel}) {
    super({dataSetModel});
    this._tfModel = tfModel;
  }

  getAdjacentJointPairs = () =>
    poseDetection.util.getAdjacentPairs(this.tfModel);

  getVector = ({x, y}) => super.getVector({x, y: -y, z: 0});
  getPoint = ({x, y}) => super.getPoint({x, y: -y, z: 0});
  getPositions = ({x, y}) => super.getPositions({x, y: -y, z: 0});

  /**
   * @returns {SupportedModels}
   */
  get tfModel() {
    return this._tfModel;
  }
}

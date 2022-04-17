import {RenderHelper} from './RenderHelper';
import {MLHProcessor} from '../processor/MLHProcessor';

/**
 * RenderHelper for the 3D animation
 *
 * @class
 * @extends {RenderHelper}
 */
export class RenderHelper3D extends RenderHelper {
  getAdjacentJointPairs = () => MLHProcessor.getAdjacentJoints();
}

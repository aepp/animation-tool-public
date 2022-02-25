import {RenderHelper} from './RenderHelper';
import {LHLegacyProcessor} from '../processor/LHLegacyProcessor';

/**
 * RenderHelper for the 3D animation
 *
 * @class
 * @extends {RenderHelper}
 */
export class RenderHelper3D extends RenderHelper {
  getAdjacentJointPairs = () => LHLegacyProcessor.getAdjacentJoints();
}

import {RenderHelper} from './RenderHelper';
import {LHLegacyProcessor} from '../processor/LHLegacyProcessor';

export class RenderHelper3D extends RenderHelper {
  getAdjacentJointPairs = () => LHLegacyProcessor.getAdjacentJoints();
}

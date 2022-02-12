import {RenderService} from './RenderService';
import {LHLegacyProcessor} from '../processor/LHLegacyProcessor';

export class RenderService3D extends RenderService {
  getAdjacentJointPairs = () => LHLegacyProcessor.getAdjacentJoints();

  constructor({extremes, normalization}) {
    super({
      extremes,
      normalization
    });
  }
}

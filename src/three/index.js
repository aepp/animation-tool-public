import * as PropTypes from 'prop-types';
import {preProcess} from './util/preProcess';
import {ThreeModelRenderer} from './controller/ThreeModelRenderer';

async function main({dataSet, rootElement, threeInstance}) {
  const frames = dataSet.Frames || dataSet.frames;
  console.log('dataset loaded, beginning pre-process...');
  return preProcess({frames}).then(({framesPerPerson, personIndices}) => {
    console.log('pre-process finished! rendering...');

    if (threeInstance) {
      threeInstance._renderer.resetState();
    } else {
      threeInstance = new ThreeModelRenderer({rootElement});
    }

    return threeInstance
      .init()
      .initFrames({
        framesPerPerson,
        framesCount: framesPerPerson.length,
        personIndices
      })
      .animateFrames();
  });
}
main.propTypes = {
  dataSet: PropTypes.shape({
    Frames: PropTypes.array
  }).isRequired
};

export const startVisualization = async ({
  rootElement,
  dataSetFileUrl,
  threeInstance = null
}) => {
  const dataSet = await fetch(dataSetFileUrl).then(r => r.json());
  return main({dataSet, rootElement, threeInstance})
    .then(threeInstance => {
      console.log('visualization creation finished!', threeInstance);
      return threeInstance;
    })
    .catch(error => console.error('Visualization failed:', error));
};

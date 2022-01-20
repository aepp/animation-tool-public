import * as PropTypes from 'prop-types';
import dataSet1 from './data/cpr.json';
import dataSet2 from './data/table_tennis.json';
import {preProcess} from './util/preProcess';
import {ThreeModelRenderer} from './controller/ThreeModelRenderer';

async function main({dataSet, rootElement}) {
  const frames = dataSet.Frames || dataSet.frames;
  console.log('dataSet loaded, beginning pre-process...');
  return preProcess({frames}).then(({framesPerPerson, personIndices}) => {
    console.log('pre-process finished! rendering...');
    // console.log(data);
    const threeInstance = new ThreeModelRenderer({rootElement});

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

// main({ dataSet: dataSet1 });
export const startVisualization = async ({rootElement, dataSetFileUrl}) => {
  const dataSet = await fetch(dataSetFileUrl).then(r => r.json());
  console.log(dataSet);
  return main({dataSet, rootElement})
    .then(threeInstance => {
      console.log('visualization finished!', threeInstance);
      return threeInstance._threeModel;
    })
    .catch(error => console.error('Visualization failed:', error));
};

import {fork, takeLatest, select} from 'redux-saga/effects';
import Plotly from 'plotly.js-dist';
import {plotDataSet} from '../actions';
import {selectDataSet} from '../reducers';

function* handlePlotDataSet(action) {
  const {
    payload: {containerElem}
  } = action;
  console.log(action);
  const dataSet = yield select(selectDataSet);
  console.log('dataSet', dataSet);
  const x = [];
  const y = [];
  dataSet.framesPerPerson.forEach(frame =>
    frame.forEach(person =>
      person.keyPoints.forEach(point => {
        x.push(point.x);
        y.push(point.y);
      })
    )
  );
  const trace1 = {
    x,
    y,
    mode: 'markers',
    marker: {
      size: 5,
      line: {
        color: 'rgba(217, 217, 217, 0.14)',
        width: 0.5
      },
      opacity: 0.8
    },
    type: 'scatter'
  };

  const layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    }
  };
  Plotly.newPlot(containerElem, [trace1], layout);
}

function* watchPlotDataSet() {
  yield takeLatest(plotDataSet.type, handlePlotDataSet);
}

function* rootSaga() {
  yield fork(watchPlotDataSet);
}

export default rootSaga;

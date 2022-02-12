import {fork} from 'redux-saga/effects';
import visualizationSaga from './views/Visualization/rootSaga';
import recordingSaga from './views/Recording/sagas';

export default function* rootSaga() {
  yield fork(visualizationSaga);
  yield fork(recordingSaga);
}

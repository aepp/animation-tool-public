import {fork} from 'redux-saga/effects';
import appSaga from './modules/App/sagas';
import visualizationSaga from './views/Visualization/sagas';
import recordingSaga from './views/Estimation/sagas';

export default function* rootSaga() {
  yield fork(appSaga);
  yield fork(visualizationSaga);
  yield fork(recordingSaga);
}

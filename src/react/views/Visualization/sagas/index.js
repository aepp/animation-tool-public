import {fork} from 'redux-saga/effects';
import uploadSaga from '../modules/Upload/sagas';
import animationSaga from '../modules/Animation/sagas';
import playbackControlsSaga from '../modules/AnimationControls/sagas';
import dataSetSaga from '../modules/DataSet/sagas';
import viewSaga from './view';

export function* visualizationSaga() {
  yield fork(uploadSaga);
  yield fork(animationSaga);
  yield fork(playbackControlsSaga);
  yield fork(dataSetSaga);
  yield fork(dataSetSaga);
  yield fork(viewSaga);
}
export default visualizationSaga;

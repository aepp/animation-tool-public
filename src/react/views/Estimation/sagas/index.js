import {fork} from 'redux-saga/effects';

import playbackSagas from './playback';
import detectionSagas from './detection';
import resultsSagas from './results';
import uploadSagas from './upload';
import viewSagas from './view';

function* rootSaga() {
  yield fork(playbackSagas);
  yield fork(detectionSagas);
  yield fork(resultsSagas);
  yield fork(uploadSagas);
  yield fork(viewSagas);
}

export default rootSaga;

import {fork} from 'redux-saga/effects';

import playbackSagas from './playback';
import detectionSagas from './detection';
import resultsSagas from './results';

function* rootSaga() {
  yield fork(playbackSagas);
  yield fork(detectionSagas);
  yield fork(resultsSagas);
}

export default rootSaga;

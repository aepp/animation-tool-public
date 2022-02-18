import {fork} from 'redux-saga/effects';

import playbackSaga from './playback';
import estimationSaga from './estimation';
import resultsSaga from './results';
import uploadSaga from './upload';
import viewSaga from './view';

function* rootSaga() {
  yield fork(playbackSaga);
  yield fork(estimationSaga);
  yield fork(resultsSaga);
  yield fork(uploadSaga);
  yield fork(viewSaga);
}

export default rootSaga;

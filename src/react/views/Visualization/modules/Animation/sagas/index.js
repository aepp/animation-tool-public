import {fork} from 'redux-saga/effects';
import animationSaga from './animation';
import uiChannelSaga from './uiChannel';

function* rootSaga() {
  yield fork(animationSaga);
  yield fork(uiChannelSaga);
}

export default rootSaga;

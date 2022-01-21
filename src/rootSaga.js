import {fork} from 'redux-saga/effects';
import uploadSaga from './modules/Upload/sagas/upload';
import animationSaga from './modules/Animation/sagas/animation';
import playbackControlsSaga from './modules/AnimationControls/sagas/playback';

export default function* rootSaga() {
  yield fork(uploadSaga);
  yield fork(animationSaga);
  yield fork(playbackControlsSaga);
}

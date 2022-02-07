import {fork} from 'redux-saga/effects';
import uploadSaga from './views/Animation/modules/Upload/sagas/upload';
import animationSaga from './views/Animation/modules/Animation/sagas/animation';
import playbackControlsSaga from './views/Animation/modules/AnimationControls/sagas/playback';
import recordingSaga from './views/Recording/sagas';

export default function* rootSaga() {
  yield fork(uploadSaga);
  yield fork(animationSaga);
  yield fork(playbackControlsSaga);
  yield fork(recordingSaga);
}

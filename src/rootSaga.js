import {fork} from 'redux-saga/effects';
import uploadSaga from './modules/Upload/sagas/upload';
import animationSaga from './modules/Visualization/sagas/animation';

export default function* rootSaga() {
  yield fork(uploadSaga);
  yield fork(animationSaga);
}

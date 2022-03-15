import {fork} from 'redux-saga/effects';
import c3Saga from './c3';

export default function* rootSaga() {
  yield fork(c3Saga);
}

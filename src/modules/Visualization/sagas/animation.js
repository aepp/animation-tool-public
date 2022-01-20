import {takeLatest, fork} from 'redux-saga/effects';
import {SET_THREE_INSTANCE} from '../actions';
import {LOCAL_STORAGE_THREE_INSTANCE} from '../../../constants';

function* handleSetThreeInstance(action) {
  const {
    payload: {threeInstance}
  } = action;
  window[LOCAL_STORAGE_THREE_INSTANCE] = threeInstance;
}

function* watchSetThreeInstance() {
  yield takeLatest(SET_THREE_INSTANCE, handleSetThreeInstance);
}

function* rootSaga() {
  yield fork(watchSetThreeInstance);
}

export default rootSaga;

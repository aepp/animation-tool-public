import {fork, takeLatest, put, call} from 'redux-saga/effects';
import {LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE} from '../../../../config/constants';
import {cleanUpAnimationView} from '../actions/view';
import {resetAnimation} from '../modules/Animation/actions/animation';
import {resetAnimationControls} from '../modules/AnimationControls/actions';
import {resetDataSet} from '../modules/DataSet/actions';
import {resetUpload} from '../modules/Upload/actions';

function* handleCleanup() {
  console.log('cleanup animation view');
  yield put(resetAnimation());
  yield put(resetAnimationControls());
  yield put(resetDataSet());
  yield put(resetUpload());

  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  if (animationControllerInstance) {
    yield call({
      context: animationControllerInstance,
      fn: animationControllerInstance.softReset
    });
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE] = undefined;
  }
}

function* watchCleanup() {
  yield takeLatest(cleanUpAnimationView.type, handleCleanup);
}

function* rootSaga() {
  yield fork(watchCleanup);
}
export default rootSaga;

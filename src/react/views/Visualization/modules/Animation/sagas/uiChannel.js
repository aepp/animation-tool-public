import {
  fork,
  put,
  take,
  takeLatest,
  throttle
  // cancel,
  // spawn
} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE} from '../../../../../../config/constants';
import {
  closeUiChannel,
  openUiChannel,
  updateCurrentFrameIndexFromThree
} from '../actions/uiChannel';

function* handleStartUiChannel() {
  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  const uiChannel = eventChannel(emitter => {
    animationControllerInstance.sendToUi = ({type, payload}) => {
      emitter({type, payload});
    };
    // The subscriber must return an unsubscribe function
    return () => {};
  });

  const channelTask = yield fork(function* () {
    while (true) {
      try {
        const action = yield take(uiChannel);
        yield put(action);
      } catch (error) {
        console.error('uiChannel error: ', error);
        uiChannel.close();
      }
    }
  });
  yield take(closeUiChannel.type);
  channelTask.cancel();
}

function* watchStartUiChannel() {
  yield takeLatest(openUiChannel.type, handleStartUiChannel);
}
function* watchUpdateCurrentFrameIdxFromThree() {
  yield throttle(
    window._AnimationToolInstance.frameUpdateCallbackThrottleTimeout,
    updateCurrentFrameIndexFromThree.type,
    // eslint-disable-next-line require-yield
    function* (action) {
      window._AnimationToolInstance.frameUpdateCallback(action.payload);
      // yield spawn(function* () {
      //   window._AnimationToolInstance.frameUpdateCallback(action.payload);
      //   yield cancel();
      // });
    }
  );
  // yield takeLatest(updateCurrentFrameIndexFromThree.type, function*(action){
  //   yield fork(function*(){
  //     window._AnimationToolInstance.frameUpdateCallback(action.payload)
  //     yield cancel();
  //   });
  // });
}

function* rootSaga() {
  yield fork(watchStartUiChannel);
  yield fork(watchUpdateCurrentFrameIdxFromThree);
}

export default rootSaga;

import {fork, put, take, takeLatest} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE} from '../../../../../../config/constants';
import {closeUiChannel, openUiChannel} from '../actions/uiChannel';

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

function* rootSaga() {
  yield fork(watchStartUiChannel);
}

export default rootSaga;

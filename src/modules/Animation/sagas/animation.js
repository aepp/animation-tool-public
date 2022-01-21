import {eventChannel} from 'redux-saga';
import {takeLatest, take, fork, select, call, put} from 'redux-saga/effects';
import {FINISH_ANIMATION_INIT, START_ANIMATION_INIT} from '../actions';
import {LOCAL_STORAGE_THREE_INSTANCE} from '../../../constants';
import {startVisualization} from '../../../three';
import {selectDataSetFileUrl} from '../../Upload/reducers';
import {UPDATE_CURRENT_FRAME_IDX, UPDATE_MAX_FRAMES_COUNT} from '../actions/uiChannel';

const START_UI_CHANNEL = 'START_UI_CHANNEL';

function* handleStartUiChannel() {
  const threeInstance = window[LOCAL_STORAGE_THREE_INSTANCE];

  const uiChannel = eventChannel(emitter => {
    threeInstance.sendToUi = ({type, payload}) => {
      emitter({type, payload});
    };
    // The subscriber must return an unsubscribe function
    return () => {
      threeInstance.reset();
    };
  });

  while (true) {
    try {
      const action = yield take(uiChannel);
      yield put(action);
    } catch (error) {
      console.error('uiChannel error: ', error);
      uiChannel.close();
    }
  }
}

function* handleStartAnimationInit(action) {
  const dataSetFileUrl = yield select(selectDataSetFileUrl);
  const {
    payload: {rootElement}
  } = action;
  const threeInstance = yield call(startVisualization, {
    rootElement,
    dataSetFileUrl,
    threeInstance: window[LOCAL_STORAGE_THREE_INSTANCE]
  });
  window[LOCAL_STORAGE_THREE_INSTANCE] = threeInstance;

  yield put({type: START_UI_CHANNEL});

  threeInstance.animateFrames();

  yield put({type: FINISH_ANIMATION_INIT});
}

function* handleX(action){
  console.log(action);
}
function* watchStartAnimationInit() {
  yield takeLatest(START_ANIMATION_INIT, handleStartAnimationInit);
}
function* watchX() {
  yield takeLatest(UPDATE_MAX_FRAMES_COUNT, handleX);
}
function* watchStartUiChannel() {
  yield takeLatest(START_UI_CHANNEL, handleStartUiChannel);
}

function* rootSaga() {
  yield fork(watchStartAnimationInit);
  yield fork(watchStartUiChannel);
  yield fork(watchX);
}

export default rootSaga;

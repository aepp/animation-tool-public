import {eventChannel} from 'redux-saga';
import {takeLatest, take, fork, select, call, put} from 'redux-saga/effects';
import {FINISH_ANIMATION_INIT, START_ANIMATION_INIT} from '../actions';
import {LOCAL_STORAGE_THREE_INSTANCE} from '../../../../../constants';
import {selectDataSetFileUrl} from '../../Upload/reducers';
import {UPDATE_FRAMES_COUNT} from '../actions/uiChannel';
import {preProcess} from '../../../../../three/util/preProcess';
import {ThreeModelRenderer} from '../../../../../three/controller/ThreeModelRenderer';

const START_UI_CHANNEL = 'START_UI_CHANNEL';

const fetchDataSet = async url => fetch(url).then(r => r.json());

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

  console.log('begin loading dataset...');
  const dataSet = yield call(fetchDataSet, dataSetFileUrl);

  const frames = dataSet.Frames || dataSet.frames;
  console.log('dataset loaded, beginning pre-process...');

  const {framesPerPerson, personIndices} = yield call(preProcess, {frames});
  console.log('pre-process finished! rendering...');

  yield put({
    type: UPDATE_FRAMES_COUNT,
    payload: {framesCount: framesPerPerson.length}
  });

  const threeInstance =
    window[LOCAL_STORAGE_THREE_INSTANCE] ||
    new ThreeModelRenderer({rootElement});

  threeInstance
    .reset()
    .init()
    .initFrames({
      framesPerPerson,
      framesCount: framesPerPerson.length,
      personIndices
    })
    .animationLoop();

  window[LOCAL_STORAGE_THREE_INSTANCE] = threeInstance;

  yield put({type: START_UI_CHANNEL});
  yield put({type: FINISH_ANIMATION_INIT});
}
function* watchStartAnimationInit() {
  yield takeLatest(START_ANIMATION_INIT, handleStartAnimationInit);
}
function* watchStartUiChannel() {
  yield takeLatest(START_UI_CHANNEL, handleStartUiChannel);
}

function* rootSaga() {
  yield fork(watchStartAnimationInit);
  yield fork(watchStartUiChannel);
}

export default rootSaga;

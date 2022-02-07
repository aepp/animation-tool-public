import {eventChannel} from 'redux-saga';
import {takeLatest, take, fork, select, call, put} from 'redux-saga/effects';
import {FINISH_ANIMATION_INIT, START_ANIMATION_INIT} from '../actions';
import {
  DATA_SOURCE_KINECT,
  DATA_SOURCE_TF,
  LOCAL_STORAGE_THREE_INSTANCE
} from '../../../../../../constants';
import {selectDataSetFileUrl} from '../../Upload/reducers';
import {UPDATE_FRAMES_COUNT} from '../actions/uiChannel';
import {preProcess} from '../../../../../../business/util/preProcess';
import {AnimationController} from '../../../../../../business/controller/AnimationController';
import {UNKNOWN_DATA_SOURCE} from '../../../../../../messages';
import {RenderService3D} from '../../../../../../business/service/RenderService3D';
import {RenderService2D} from '../../../../../../business/service/RenderService2D';
import {LHLegacyProcessor} from '../../../../../../business/processor/LHLegacyProcessor';
import {TFProcessor} from '../../../../../../business/processor/TFProcessor';

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
  const dataSource =
    dataSet.ApplicationName ||
    dataSet.applicationName ||
    (dataSet.source ? dataSet.source.id : null);

  if (!dataSource || dataSource === '') throw new Error(UNKNOWN_DATA_SOURCE);

  const frames = dataSet.Frames || dataSet.frames;
  console.log('dataset loaded, beginning pre-process...');

  let ProcessorInstance;
  switch (dataSource) {
    case DATA_SOURCE_KINECT:
      ProcessorInstance = new LHLegacyProcessor({frames});
      break;
    case DATA_SOURCE_TF:
      ProcessorInstance = new TFProcessor({frames});
      break;
    default:
      throw new Error(UNKNOWN_DATA_SOURCE);
  }
  const {framesPerPerson, personIndices} = yield call({
    context: ProcessorInstance,
    fn: ProcessorInstance.preProcess
  });

  console.log('pre-process finished! rendering...');

  yield put({
    type: UPDATE_FRAMES_COUNT,
    payload: {framesCount: framesPerPerson.length}
  });

  const AnimationControllerInstance =
    window[LOCAL_STORAGE_THREE_INSTANCE] ||
    new AnimationController({rootElement, dataSource});

  AnimationControllerInstance.reset()
    .init()
    .initFrames({
      framesPerPerson,
      framesCount: framesPerPerson.length,
      personIndices
    })
    .animationLoop();

  window[LOCAL_STORAGE_THREE_INSTANCE] = AnimationControllerInstance;

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

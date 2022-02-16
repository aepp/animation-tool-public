import {eventChannel} from 'redux-saga';
import {takeLatest, take, fork, select, call, put} from 'redux-saga/effects';
import {
  DataSourceType,
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE
} from '../../../../../../constants';
import {AnimationController} from '../../../../../../business/controller/AnimationController';
import {UNKNOWN_DATA_SOURCE} from '../../../../../../i18n/messages';
import {LHLegacyProcessor} from '../../../../../../business/processor/LHLegacyProcessor';
import {TFProcessor} from '../../../../../../business/processor/TFProcessor';
import {selectDataSetFileUrl} from '../../Upload/reducers';
import {
  finishAnimationInit,
  skeletonTest,
  startAnimation
} from '../actions/animation';
import {updateFramesCount} from '../actions/uiChannel';
import {setDataSet} from '../../DataSet/actions';
import {SimpleTestAnimationController} from '../../../../../../business/controller/SimpleTestAnimationController';
import {resetAnimationControls} from '../../AnimationControls/actions';

const START_UI_CHANNEL = 'START_UI_CHANNEL';

const fetchDataSet = async url => fetch(url).then(r => r.json());

function* handleStartUiChannel() {
  const animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];

  const uiChannel = eventChannel(emitter => {
    animationControllerInstance.sendToUi = ({type, payload}) => {
      emitter({type, payload});
    };
    // The subscriber must return an unsubscribe function
    return () => {
      animationControllerInstance.reset();
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
    case DataSourceType.DATA_SOURCE_KINECT:
      ProcessorInstance = new LHLegacyProcessor({frames});
      break;
    case DataSourceType.DATA_SOURCE_TF:
      ProcessorInstance = new TFProcessor({frames});
      break;
    default:
      throw new Error(UNKNOWN_DATA_SOURCE);
  }
  const {framesPerPerson, personIndices, extremes, normalization} = yield call({
    context: ProcessorInstance,
    fn: ProcessorInstance.preProcess
  });

  yield put(
    setDataSet({
      framesPerPerson,
      personIndices,
      extremes,
      normalization,
      dataSource
    })
  );

  console.log('pre-process finished! rendering...');

  yield put(updateFramesCount(framesPerPerson.length));

  let AnimationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  if (AnimationControllerInstance) {
    console.log('replacing dataset...');
    AnimationControllerInstance.handleDataSetReplacement();
    yield put(resetAnimationControls);
  } else {
    AnimationControllerInstance = new AnimationController({rootElement});
  }

  yield call(
    {
      context: AnimationControllerInstance,
      fn: AnimationControllerInstance.setup
    },
    {
      dataSource,
      extremes,
      normalization,
      framesPerPerson,
      framesCount: framesPerPerson.length,
      personIndices
    }
  );

  yield call({
    context: AnimationControllerInstance,
    fn: AnimationControllerInstance.animationLoop
  });

  window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE] =
    AnimationControllerInstance;

  yield put({type: START_UI_CHANNEL});
  yield put(finishAnimationInit());
}

function* handleSkeletonTest(action) {
  const {
    payload: {rootElement}
  } = action;

  const controller = new SimpleTestAnimationController({rootElement});
  yield call({context: controller, fn: controller.init});
}

function* watchStartAnimationInit() {
  yield takeLatest(startAnimation.type, handleStartAnimationInit);
}
function* watchSkeletonTest() {
  yield takeLatest(skeletonTest.type, handleSkeletonTest);
}
function* watchStartUiChannel() {
  yield takeLatest(START_UI_CHANNEL, handleStartUiChannel);
}

function* rootSaga() {
  yield fork(watchStartAnimationInit);
  yield fork(watchStartUiChannel);

  yield fork(watchSkeletonTest);
}

export default rootSaga;

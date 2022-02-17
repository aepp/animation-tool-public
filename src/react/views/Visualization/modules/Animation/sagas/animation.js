import {takeLatest, fork, select, call, put} from 'redux-saga/effects';
import {
  DataSourceType,
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE
} from '../../../../../../config/constants';
import {AnimationController} from '../../../../../../business/controller/AnimationController';
import {UNKNOWN_DATA_SOURCE} from '../../../../../../i18n/messages';
import {LHLegacyProcessor} from '../../../../../../business/processor/LHLegacyProcessor';
import {TFProcessor} from '../../../../../../business/processor/TFProcessor';
import {selectDataSetFileUrl} from '../../Upload/reducers';
import {setDataSet} from '../../DataSet/actions';
import {resetAnimationControls} from '../../AnimationControls/actions';
import {finishAnimationInit, startAnimation} from '../actions/animation';
import {updateFramesCount} from '../actions/animation';
import {closeUiChannel, openUiChannel} from '../actions/uiChannel';

const fetchDataSet = async url => fetch(url).then(r => r.json());

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
      ProcessorInstance = new TFProcessor({
        frames,
        model: dataSet.source.details.model
      });
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
    yield put(resetAnimationControls());
    yield put(closeUiChannel());
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

  yield put(openUiChannel());
  yield put(finishAnimationInit());
}

function* watchStartAnimationInit() {
  yield takeLatest(startAnimation.type, handleStartAnimationInit);
}

function* rootSaga() {
  yield fork(watchStartAnimationInit);
}

export default rootSaga;

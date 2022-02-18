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
import {validateSelectedDataSet} from '../../../util/dataSetUtil';

const fetchDataSet = async url => fetch(url).then(r => r.json());

function* handleStartAnimationInit(action) {
  const dataSetFileUrl = yield select(selectDataSetFileUrl);
  const {
    payload: {rootElement}
  } = action;

  console.log('begin loading dataset...');
  const dataSet = yield call(fetchDataSet, dataSetFileUrl);

  const {dataSource, frames, model, isValid, message} = yield call(
    validateSelectedDataSet,
    dataSet
  );

  if (!isValid) {
    alert(message || UNKNOWN_DATA_SOURCE);
    return;
  }

  console.log(
    'dataset loaded and format is supported, beginning pre-process...'
  );

  let ProcessorInstance;
  switch (dataSource) {
    case DataSourceType.DATA_SOURCE_KINECT:
      ProcessorInstance = new LHLegacyProcessor({frames});
      break;
    case DataSourceType.DATA_SOURCE_TF:
      ProcessorInstance = new TFProcessor({
        frames,
        model
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

  let animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  if (animationControllerInstance) {
    console.log('replacing dataset...');
    yield call({
      context: animationControllerInstance,
      fn: animationControllerInstance.softReset
    });
    yield put(resetAnimationControls());
    yield put(closeUiChannel());
  } else {
    animationControllerInstance = new AnimationController({rootElement});
  }

  yield call(
    {
      context: animationControllerInstance,
      fn: animationControllerInstance.setup
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
    context: animationControllerInstance,
    fn: animationControllerInstance.animationLoop
  });

  window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE] =
    animationControllerInstance;

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

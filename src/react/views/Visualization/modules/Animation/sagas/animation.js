import {takeLatest, fork, select, call, put} from 'redux-saga/effects';
import {
  DataSourceType,
  LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE
} from '../../../../../../config/constants';
import {AnimationController} from '../../../../../../business/controller/AnimationController';
import {
  UNABLE_TO_LOAD_JSON_FILE,
  UNKNOWN_DATA_SOURCE
} from '../../../../../../i18n/messages';
import {showErrorMessage} from '../../../../../modules/App/actions';
import {MLHProcessor} from '../../../../../../business/processor/MLHProcessor';
import {ATProcessor} from '../../../../../../business/processor/ATProcessor';
import {validateSelectedDataSet} from '../../../util/dataSetUtil';
import {finishVisualizationViewInit} from '../../../actions/view';
import {selectDataFileUrl} from '../../Upload/reducers';
import {setDataSet} from '../../CoordinatesChart/actions';
import {resetAnimationControls} from '../../AnimationControls/actions';
import {resetCoordinatesChartControls} from '../../CoordinatesChartControls/actions';
import {
  beginAnimationInit,
  cancelAnimationInit,
  finishAnimationInit,
  setOriginalFps,
  startAnimation
} from '../actions/animation';
import {updateFramesCount} from '../actions/animation';
import {closeUiChannel, openUiChannel} from '../actions/uiChannel';

const fetchDataSet = async url => fetch(url).then(r => r.json());

function* handleStartAnimationInit(action) {
  console.log('begin loading dataset...');
  yield put(beginAnimationInit());

  const dataSetFileUrl = yield select(selectDataFileUrl);
  const {
    payload: {rootElement}
  } = action;

  let dataSet;
  try {
    dataSet = yield call(fetchDataSet, dataSetFileUrl);
  } catch (error) {
    yield put(showErrorMessage(UNABLE_TO_LOAD_JSON_FILE));
    yield put(cancelAnimationInit());
    return;
  }

  const {dataSource, frames, tfModel, frameStamps, isValid, message} =
    yield call(validateSelectedDataSet, dataSet);

  if (!isValid) {
    yield put(showErrorMessage(message || UNKNOWN_DATA_SOURCE));
    yield put(cancelAnimationInit());
    return;
  }

  let ProcessorInstance;
  switch (dataSource) {
    case DataSourceType.DATA_SOURCE_KINECT:
    case DataSourceType.DATA_SOURCE_KINECT_READER:
    case DataSourceType.DATA_SOURCE_TF_MOCK_LH:
      ProcessorInstance = new MLHProcessor({frames, dataSource});
      break;
    case DataSourceType.DATA_SOURCE_TF:
      ProcessorInstance = new ATProcessor({
        frames,
        dataSource,
        tfModel
      });
      break;
    default:
      yield put(cancelAnimationInit());
      yield put(showErrorMessage(UNKNOWN_DATA_SOURCE));
      return;
  }

  const preProcessedDataSet = yield call({
    context: ProcessorInstance,
    fn: ProcessorInstance.preProcess
  });

  const {
    framesPerPerson,
    personIndices,
    extremes,
    normalization,
    jointNames,
    detectionFps
  } = preProcessedDataSet;

  yield put(
    setDataSet({
      framesPerPerson,
      personIndices,
      extremes,
      normalization,
      dataSource,
      original: dataSet,
      jointNames,
      frameStamps
    })
  );

  console.log('pre-process finished! rendering...');

  yield put(updateFramesCount(framesPerPerson.length));

  let animationControllerInstance =
    window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE];
  let shouldStartAnimationLoop = true;
  if (animationControllerInstance) {
    // loop already initiated, don't need to start it again
    shouldStartAnimationLoop = false;
    console.log('replacing dataset...');
    yield call({
      context: animationControllerInstance,
      fn: animationControllerInstance.softReset
    });
    yield put(resetAnimationControls());
    yield put(resetCoordinatesChartControls());
    yield put(closeUiChannel());
  } else {
    animationControllerInstance = new AnimationController({
      rootElement
    });
  }
  yield put(setOriginalFps(detectionFps));

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
      personIndices,
      tfModel,
      detectionFps
    }
  );

  if (shouldStartAnimationLoop)
    yield call({
      context: animationControllerInstance,
      fn: animationControllerInstance.animationLoop
    });

  window[LOCAL_STORAGE_ANIMATION_CONTROLLER_INSTANCE] =
    animationControllerInstance;

  yield put(openUiChannel());
  yield put(finishAnimationInit());
  yield put(finishVisualizationViewInit());
}

function* watchStartAnimationInit() {
  yield takeLatest(startAnimation.type, handleStartAnimationInit);
}

function* rootSaga() {
  yield fork(watchStartAnimationInit);
}

export default rootSaga;

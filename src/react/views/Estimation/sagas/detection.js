import {
  call,
  fork,
  put,
  select,
  takeLatest,
  delay,
  cancel
} from 'redux-saga/effects';
import {createDetector} from '@tensorflow-models/pose-detection';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
import {fill} from '@tensorflow/tfjs-core';
import {LOCAL_STORAGE_POSE_DETECTOR_INSTANCE} from '../../../../config/constants';
import {DetectorConfigs} from '../../../../config/tensorFlow';
import {
  selectDetectionModel,
  selectEstimationConfig,
  selectEstimationVideoOriginalDimensions,
  selectIsDetecting
} from '../reducers';
import {
  addDetectedPose,
  beginWarmUpModel,
  endDetection,
  finishWarmUpModel,
  pauseDetection,
  setDetectionStatus,
  startDetection
} from '../actions/estimation';
import {
  endEstimationVideo,
  stopEstimationVideo
} from '../actions/estimationPlayback';

function* handleWarmUpModel() {
  const dimensions = yield select(selectEstimationVideoOriginalDimensions);

  let detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];

  if (!detector) {
    const model = yield select(selectDetectionModel);
    const estimationConfig = yield select(selectEstimationConfig);

    detector = yield call(createDetector, model, DetectorConfigs[model]);

    window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE] = detector;
    const warmUpTensor = fill(
      [dimensions.height, dimensions.width, 3],
      0,
      'float32'
    );
    yield call(
      {
        context: detector,
        fn: detector.estimatePoses
      },
      warmUpTensor,
      estimationConfig
    );
    yield call({
      context: warmUpTensor,
      fn: warmUpTensor.dispose
    });
  }

  yield put(finishWarmUpModel());
}

// const estimate = async (videoElementOriginal, estimationConfig) => {
//   const poses = await window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE].estimatePoses(videoElementOriginal, estimationConfig);
//   console.log(poses);
//   return poses;
// };
// let rafId;
// const runFrame = async (videoElementOriginal, estimationConfig) => {
//   await estimate(videoElementOriginal, estimationConfig);
//   rafId = requestAnimationFrame(() => runFrame(videoElementOriginal, estimationConfig))
// }
// const detect = async (videoElementOriginal, estimationConfig) => {
//   await runFrame(videoElementOriginal, estimationConfig);
// };

function* handleStartDetection(action) {
  const isDetecting = yield select(selectIsDetecting);

  if (isDetecting) return;

  const estimationConfig = yield select(selectEstimationConfig);

  yield put(
    setDetectionStatus({
      hasDetectionStarted: true,
      isDetecting: true
    })
  );

  const detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];
  const detectionLoop = yield fork(function* () {
    // yield call(detect, videoElementOriginal, estimationConfig);
    while (true) {
      const poses = yield call(
        {
          context: detector,
          fn: detector.estimatePoses
        },
        action.payload,
        estimationConfig
      );
      yield put(addDetectedPose(poses));
      yield delay(16);
    }
  });

  console.log('waiting for finish or cancel...');
  yield takeLatest(
    [
      endEstimationVideo.type,
      stopEstimationVideo.type,
      endDetection.type,
      pauseDetection.type
    ],
    function* () {
      console.log('detection stopped');
      yield cancel(detectionLoop);
    }
  );
}

function* handlePauseDetection() {
  yield put(
    setDetectionStatus({
      isDetecting: false
    })
  );
}

function* handleEndDetection() {
  yield put(
    setDetectionStatus({
      hasDetectionFinished: true,
      isDetecting: false
    })
  );

  const detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];

  if (detector) {
    yield call({
      context: detector,
      fn: detector.dispose
    });
    yield call({
      context: detector,
      fn: detector.reset
    });
  }
}

function* watchWarmUpModel() {
  yield takeLatest(beginWarmUpModel.type, handleWarmUpModel);
}
function* watchStartDetection() {
  yield takeLatest(startDetection.type, handleStartDetection);
}
function* watchPauseDetection() {
  yield takeLatest(pauseDetection.type, handlePauseDetection);
}
function* watchEndDetection() {
  yield takeLatest(endDetection.type, handleEndDetection);
}

function* rootSaga() {
  yield fork(watchStartDetection);
  yield fork(watchPauseDetection);
  yield fork(watchEndDetection);
  yield fork(watchWarmUpModel);
}

export default rootSaga;

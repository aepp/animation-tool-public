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
  selectDetectionFps,
  selectDetectionModel,
  selectEstimationConfig,
  selectEstimationVideoOriginalDimensions,
  selectIsDetecting
} from '../reducers';
import {
  addEstimatedPose,
  addEstimationFrameStamp,
  beginWarmUpModel,
  endEstimation,
  finishWarmUpModel,
  pauseEstimation,
  setEstimationStatus,
  startEstimation
} from '../actions/estimation';
import {
  endEstimationVideo,
  stopEstimationVideo
} from '../actions/estimationPlayback';
import {cleanupEstimationView} from '../actions/view';
import {VIDEO_ELEMENT_ID_ORIGINAL} from '../components/EstimationVideo';

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

window.poses = [];
window.frameStamps = [];
const estimate = async (videoElementOriginal, estimationConfig) => {
  const poses = await window[
    LOCAL_STORAGE_POSE_DETECTOR_INSTANCE
  ].estimatePoses(videoElementOriginal, estimationConfig);
  window.poses.push(poses);
  window.frameStamps.push(videoElementOriginal.currentTime);
  return poses;
};
let rafId;
const runFrame = async (videoElementOriginal, estimationConfig) => {
  await estimate(videoElementOriginal, estimationConfig);
  rafId = requestAnimationFrame(() =>
    runFrame(videoElementOriginal, estimationConfig)
  );
};
const detect = async (videoElementOriginal, estimationConfig) => {
  await runFrame(videoElementOriginal, estimationConfig);
};

function* handleStartDetection(action) {
  const isDetecting = yield select(selectIsDetecting);

  if (isDetecting) return;

  const estimationConfig = yield select(selectEstimationConfig);

  yield put(
    setEstimationStatus({
      hasDetectionStarted: true,
      isDetecting: true
    })
  );

  const detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];
  // const videoElementOriginal = document.getElementById(VIDEO_ELEMENT_ID_ORIGINAL);
  const detectionLoop = yield fork(function* () {
    // yield call(detect, videoElementOriginal, estimationConfig);
    const detectionFps = yield select(selectDetectionFps);
    const detectionDelay = 1000 / detectionFps; // ~11-16 FPS is max for MBP 2020
    const videoElement = document.getElementById(VIDEO_ELEMENT_ID_ORIGINAL);
    console.log('estimation started');
    while (true) {
      yield put(addEstimationFrameStamp(videoElement.currentTime));

      const poses = yield call(
        {
          context: detector,
          fn: detector.estimatePoses
        },
        videoElement, // -> video element
        estimationConfig
      );
      yield put(
        addEstimatedPose({poses})
        // addEstimatedPose({
        //   poses,
        //   frameStamp: videoElement.currentTime
        // })
      );
      yield delay(detectionDelay);
    }
  });

  yield takeLatest(
    [
      endEstimationVideo.type,
      stopEstimationVideo.type,
      endEstimation.type,
      pauseEstimation.type
    ],
    function* () {
      console.log('estimation stopped');
      yield cancel(detectionLoop);
    }
  );
  yield takeLatest(cleanupEstimationView.type, function* () {
    yield cancel(detectionLoop);
  });
}

function* handlePauseDetection() {
  // cancelAnimationFrame(rafId);
  yield put(
    setEstimationStatus({
      isDetecting: false
    })
  );
}

function* handleEndDetection() {
  // cancelAnimationFrame(rafId);
  yield put(
    setEstimationStatus({
      hasDetectionFinished: true,
      isDetecting: false
    })
  );

  const detector = window[LOCAL_STORAGE_POSE_DETECTOR_INSTANCE];

  if (detector) {
    // yield call({
    //   context: detector,
    //   fn: detector.reset
    // });
    yield call({
      context: detector,
      fn: detector.dispose
    });
  }
}

function* watchWarmUpModel() {
  yield takeLatest(beginWarmUpModel.type, handleWarmUpModel);
}
function* watchStartDetection() {
  yield takeLatest(startEstimation.type, handleStartDetection);
}
function* watchPauseDetection() {
  yield takeLatest(pauseEstimation.type, handlePauseDetection);
}
function* watchEndDetection() {
  yield takeLatest(endEstimation.type, handleEndDetection);
}

function* rootSaga() {
  yield fork(watchStartDetection);
  yield fork(watchPauseDetection);
  yield fork(watchEndDetection);
  yield fork(watchWarmUpModel);
}

export default rootSaga;

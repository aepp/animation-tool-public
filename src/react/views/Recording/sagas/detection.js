import {
  call,
  fork,
  put,
  select,
  takeLatest,
  delay,
  cancel
} from 'redux-saga/effects';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import {selectDetectionModel, selectDetectionStatus} from '../reducers';
import {
  detectorConfig,
  estimationConfig,
  getDetector,
  setDetector
} from '../poseDetectionConfig';
import {
  ADD_DETECTED_POSE,
  BEGIN_WARM_UP_MODEL,
  END_DETECTION,
  FINISH_WARM_UP_MODEL,
  PAUSE_DETECTION,
  SET_DETECTION_STATUS,
  START_DETECTION,
  VIDEO_PLAYBACK_END,
  VIDEO_PLAYBACK_PAUSE
} from '../actions';

function* handleWarmUpModel(action) {
  const {
    payload: {videoElementOriginal}
  } = action;

  if (!videoElementOriginal) return;

  let detector = yield call(getDetector);

  if (!detector) {
    const model = yield select(selectDetectionModel);
    detector = yield call(
      {
        context: poseDetection,
        fn: poseDetection.createDetector
      },
      model,
      detectorConfig
    );
    yield call(setDetector, detector);

    const warmUpTensor = tf.fill(
      [videoElementOriginal.height, videoElementOriginal.width, 3],
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

  yield put({type: FINISH_WARM_UP_MODEL});
}

function* handleStartDetection(action) {
  const {isDetecting} = yield select(selectDetectionStatus);
  if (isDetecting) return;

  yield put({
    type: SET_DETECTION_STATUS,
    payload: {
      hasDetectionStarted: true,
      isDetecting: true
    }
  });

  const {
    payload: {videoElementOriginal}
  } = action;

  const detectionLoop = yield fork(function* () {
    while (true) {
      const poses = yield call(
        {
          context: getDetector(),
          fn: getDetector().estimatePoses
        },
        videoElementOriginal,
        estimationConfig
      );
      yield put({type: ADD_DETECTED_POSE, payload: {pose: poses[0]}});
      console.log(videoElementOriginal.currentTime, poses[0].score);

      yield delay(16);
    }
  });

  yield takeLatest(
    [VIDEO_PLAYBACK_END, VIDEO_PLAYBACK_PAUSE, END_DETECTION, PAUSE_DETECTION],
    function* () {
      yield cancel(detectionLoop);
    }
  );
}

function* handlePauseDetection() {
  yield put({
    type: SET_DETECTION_STATUS,
    payload: {
      isDetecting: false
    }
  });
}

function* handleEndDetection() {
  yield put({
    type: SET_DETECTION_STATUS,
    payload: {
      hasDetectionFinished: true,
      isDetecting: false
    }
  });

  const detector = yield call(getDetector);
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
  yield takeLatest(BEGIN_WARM_UP_MODEL, handleWarmUpModel);
}
function* watchStartDetection() {
  yield takeLatest(START_DETECTION, handleStartDetection);
}
function* watchPauseDetection() {
  yield takeLatest(PAUSE_DETECTION, handlePauseDetection);
}
function* watchEndDetection() {
  yield takeLatest(END_DETECTION, handleEndDetection);
}

function* rootSaga() {
  yield fork(watchStartDetection);
  yield fork(watchPauseDetection);
  yield fork(watchEndDetection);
  yield fork(watchWarmUpModel);
}

export default rootSaga;

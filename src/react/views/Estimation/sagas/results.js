import {fork, takeLatest, select} from 'redux-saga/effects';
import {intersect} from 'mathjs';
import {DataSourceType} from '../../../../config/constants';
import {LHLegacyProcessor} from '../../../../business/processor/LHLegacyProcessor';
import {downloadEstimationResult} from '../actions/estimationResult';
import {
  selectDetectedPoses,
  selectDetectionModel,
  selectEstimationFrameStamps
} from '../reducers';
import {VIDEO_ELEMENT_ID_ORIGINAL} from '../components/EstimationVideo';

const tfToLhMap = {
  right_ankle: LHLegacyProcessor._jointNames.AnkleRight,
  left_ankle: LHLegacyProcessor._jointNames.AnkleLeft,
  right_elbow: LHLegacyProcessor._jointNames.ElbowRight,
  left_elbow: LHLegacyProcessor._jointNames.ElbowLeft,
  right_wrist: LHLegacyProcessor._jointNames.HandRight,
  left_wrist: LHLegacyProcessor._jointNames.HandLeft,
  nose: LHLegacyProcessor._jointNames.Head,
  right_hip: LHLegacyProcessor._jointNames.HipRight,
  left_hip: LHLegacyProcessor._jointNames.HipLeft,
  right_shoulder: LHLegacyProcessor._jointNames.ShoulderRight,
  left_shoulder: LHLegacyProcessor._jointNames.ShoulderLeft
  // right_wrist: LHLegacyProcessor._jointNames.HandRightTip,
  // left_wrist: LHLegacyProcessor._jointNames.HandLeftTip,
  // ['']: LHLegacyProcessor._jointNames.SpineMid,
  // ['']: LHLegacyProcessor._jointNames.SpineShoulder,
};

function* handleDownloadResults(action) {
  const dataSource = action.payload;

  const poses = yield select(selectDetectedPoses);
  const model = yield select(selectDetectionModel);
  const frameStamps = yield select(selectEstimationFrameStamps);

  let json;

  if (dataSource === DataSourceType.DATA_SOURCE_TF) {
    json = JSON.stringify({
      source: {
        id: DataSourceType.DATA_SOURCE_TF,
        detectionFps: Math.floor(
          poses.length /
            document.getElementById(VIDEO_ELEMENT_ID_ORIGINAL).totalTime
        ),
        details: {
          model
        }
      },
      frames: poses
    });
  } else {
    json = JSON.stringify({
      RecordingID: new Date(Date.now()).toLocaleString(),
      ApplicationName: DataSourceType.DATA_SOURCE_TF_MOCK_LH,
      OenName: null,
      frames: [
        ...poses.map((pose, i) => {
          const personIds = [];
          const frameAttributes = {
            ...pose.poses.reduce((allAttributes, personsPose) => {
              if (!personsPose) return allAttributes;
              personIds[personsPose.id] = personsPose.id;
              allAttributes = {
                ...allAttributes,
                ...personsPose.keypoints.reduce((lhAttributes, keypoint) => {
                  if (!tfToLhMap[keypoint.name]) return lhAttributes;
                  lhAttributes[
                    `${personsPose.id}_${tfToLhMap[keypoint.name]}_X`
                  ] = keypoint.x;
                  lhAttributes[
                    `${personsPose.id}_${tfToLhMap[keypoint.name]}_Y`
                  ] = -keypoint.y;
                  lhAttributes[
                    `${personsPose.id}_${tfToLhMap[keypoint.name]}_Z`
                  ] = 0;
                  return lhAttributes;
                }, {})
              };
              return allAttributes;
            }, [])
          };

          if (!Object.keys(frameAttributes).length) return false;
          // calculate/mock skeleton points which "should" be present in LH but are missing in TF models
          for (let personId of personIds) {
            if (isNaN(personId)) continue;
            // set hand tips equal hands positions
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandRightTip}_X`
            ] =
              frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.HandRight}_X`
              ];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandRightTip}_Y`
            ] =
              frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.HandRight}_Y`
              ];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandRightTip}_Z`
            ] = 0;
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandLeftTip}_X`
            ] =
              frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.HandLeft}_X`
              ];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandLeftTip}_Y`
            ] =
              frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.HandLeft}_Y`
              ];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.HandLeftTip}_Z`
            ] = 0;

            // calculate shoulders center point
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineShoulder}_X`
            ] =
              (frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.ShoulderLeft}_X`
              ] +
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderRight}_X`
                ]) /
              2;
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineShoulder}_Y`
            ] =
              (frameAttributes[
                `${personId}_${LHLegacyProcessor._jointNames.ShoulderLeft}_Y`
              ] +
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderRight}_Y`
                ]) /
              2;
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineShoulder}_Z`
            ] = 0;

            // calculate spine mid
            const spineMidVector = intersect(
              [
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderLeft}_X`
                ],
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderLeft}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.HipRight}_X`
                ],
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.HipRight}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderRight}_X`
                ],
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.ShoulderRight}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.HipLeft}_X`
                ],
                frameAttributes[
                  `${personId}_${LHLegacyProcessor._jointNames.HipLeft}_Y`
                ]
              ]
            );

            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineMid}_X`
            ] = spineMidVector[0];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineMid}_Y`
            ] = spineMidVector[1];
            frameAttributes[
              `${personId}_${LHLegacyProcessor._jointNames.SpineMid}_Z`
            ] = 0;
          }

          return {
            frameStamp: frameStamps[i],
            Volume: pose.score,
            frameAttributes
          };
        })
      ].filter(f => f !== false)
    });
  }

  // const blob = new Blob([jsonTF], {type: 'application/json'});
  const blob = new Blob([json], {type: 'application/json'});

  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `poses_${dataSource}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

function* watchDownloadResults() {
  yield takeLatest(downloadEstimationResult.type, handleDownloadResults);
}

function* rootSaga() {
  yield fork(watchDownloadResults);
}

export default rootSaga;

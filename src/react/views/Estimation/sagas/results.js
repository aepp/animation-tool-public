import {fork, takeLatest, select} from 'redux-saga/effects';
import {intersect} from 'mathjs';
import {DataSourceType} from '../../../../config/constants';
import {MLHProcessor} from '../../../../business/processor/MLHProcessor';
import {downloadEstimationResult} from '../actions/estimationResult';
import {
  selectEstimationFrames,
  selectDetectionModel,
  selectEstimationFrameStamps
} from '../reducers';
import {VIDEO_ELEMENT_ID_ORIGINAL} from '../components/EstimationVideo';
import {millisecondsToTime} from '../../Visualization/util/time';

const frameDiffSpineMidX = 250;
const frameDiffSpineMidY = 250;
const jMap = MLHProcessor._jointNames;
const tfToLhMap = {
  right_ankle: Object.keys(jMap).find(key => jMap[key] === jMap.AnkleRight),
  left_ankle: Object.keys(jMap).find(key => jMap[key] === jMap.AnkleLeft),
  right_elbow: Object.keys(jMap).find(key => jMap[key] === jMap.ElbowRight),
  left_elbow: Object.keys(jMap).find(key => jMap[key] === jMap.ElbowLeft),
  right_wrist: Object.keys(jMap).find(key => jMap[key] === jMap.HandRight),
  left_wrist: Object.keys(jMap).find(key => jMap[key] === jMap.HandLeft),
  nose: Object.keys(jMap).find(key => jMap[key] === jMap.Head),
  right_hip: Object.keys(jMap).find(key => jMap[key] === jMap.HipRight),
  left_hip: Object.keys(jMap).find(key => jMap[key] === jMap.HipLeft),
  right_shoulder: Object.keys(jMap).find(
    key => jMap[key] === jMap.ShoulderRight
  ),
  left_shoulder: Object.keys(jMap).find(key => jMap[key] === jMap.ShoulderLeft)
  // right_wrist: Object.keys(jMap).find(key => jMap[key] === jMap.HandRightTip),
  // left_wrist: Object.keys(jMap).find(key => jMap[key] === jMap.HandLeftTip),
  // ['']: Object.keys(jMap).find(key => jMap[key] === jMap.SpineMid),
  // ['']: Object.keys(jMap).find(key => jMap[key] === jMap.SpineShoulder),
};

function* handleDownloadResults(action) {
  const dataSource = action.payload;

  const frames = yield select(selectEstimationFrames);
  const model = yield select(selectDetectionModel);
  const frameStamps = yield select(selectEstimationFrameStamps);

  let json;

  if (dataSource === DataSourceType.DATA_SOURCE_TF) {
    json = JSON.stringify({
      source: {
        id: DataSourceType.DATA_SOURCE_TF,
        detectionFps: Math.floor(
          frames.length /
            document.getElementById(VIDEO_ELEMENT_ID_ORIGINAL).totalTime
        ),
        details: {
          model
        }
      },
      frames: frames.map((frame, i) => {
        return {
          ...frame,
          frameStamp: millisecondsToTime(frameStamps[i] * 1000)
        };
      })
    });
  } else {
    let prevSpineMidX = [];
    let prevSpineMidY = [];

    json = JSON.stringify({
      RecordingID: new Date(Date.now()).toLocaleString(),
      ApplicationName: DataSourceType.DATA_SOURCE_TF_MOCK_LH,
      OenName: null,
      frames: [
        ...frames.map((frame, i) => {
          const personIds = [];
          const frameAttributes = {
            ...frame.poses.reduce((allAttributes, personsPose) => {
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
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandRightTip
              )}_X`
            ] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.HandRight
                )}_X`
              ];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandRightTip
              )}_Y`
            ] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.HandRight
                )}_Y`
              ];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandRightTip
              )}_Z`
            ] = 0;
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandLeftTip
              )}_X`
            ] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.HandLeft
                )}_X`
              ];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandLeftTip
              )}_Y`
            ] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.HandLeft
                )}_Y`
              ];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.HandLeftTip
              )}_Z`
            ] = 0;

            // calculate shoulders center point
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineShoulder
              )}_X`
            ] =
              (frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.ShoulderLeft
                )}_X`
              ] +
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderRight
                  )}_X`
                ]) /
              2;
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineShoulder
              )}_Y`
            ] =
              (frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.ShoulderLeft
                )}_Y`
              ] +
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderRight
                  )}_Y`
                ]) /
              2;
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineShoulder
              )}_Z`
            ] = 0;

            // calculate spine mid
            const spineMidVector = intersect(
              [
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderLeft
                  )}_X`
                ],
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderLeft
                  )}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.HipRight
                  )}_X`
                ],
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.HipRight
                  )}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderRight
                  )}_X`
                ],
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.ShoulderRight
                  )}_Y`
                ]
              ],
              [
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.HipLeft
                  )}_X`
                ],
                frameAttributes[
                  `${personId}_${Object.keys(jMap).find(
                    key => jMap[key] === jMap.HipLeft
                  )}_Y`
                ]
              ]
            );

            prevSpineMidX[personId] =
              prevSpineMidX[personId] || spineMidVector[0];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineMid
              )}_X`
            ] =
              Math.abs(spineMidVector[0] - prevSpineMidX[personId]) <
              frameDiffSpineMidX
                ? spineMidVector[0]
                : frameAttributes[
                    `${personId}_${Object.keys(jMap).find(
                      key => jMap[key] === jMap.HipLeft
                    )}_X`
                  ];
            prevSpineMidX[personId] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.SpineMid
                )}_X`
              ];

            prevSpineMidY[personId] =
              prevSpineMidY[personId] || spineMidVector[1];
            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineMid
              )}_Y`
            ] =
              Math.abs(spineMidVector[1] - prevSpineMidY[personId]) <
              frameDiffSpineMidY
                ? spineMidVector[1]
                : frameAttributes[
                    `${personId}_${Object.keys(jMap).find(
                      key => jMap[key] === jMap.HipLeft
                    )}_Y`
                  ];
            prevSpineMidY[personId] =
              frameAttributes[
                `${personId}_${Object.keys(jMap).find(
                  key => jMap[key] === jMap.SpineMid
                )}_Y`
              ];

            frameAttributes[
              `${personId}_${Object.keys(jMap).find(
                key => jMap[key] === jMap.SpineMid
              )}_Z`
            ] = 0;
          }

          return {
            frameStamp: millisecondsToTime(frameStamps[i] * 1000),
            Volume: frame.score,
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

// eslint-disable-next-line no-unused-vars
import {
  // eslint-disable-next-line no-unused-vars
  DataSourceType,
  MAX_JOINT_COORDINATE_DEVIATION,
  MIN_SECS_PRESENCE_AMOUNT
} from '../../config/constants';
import {CommonDataSetProcessor} from './CommonDataSetProcessor';

/**
 * @typedef RawLHLegacyFrame
 * @type {object}
 * @property {string} frameStamp
 * @property {object} frameAttributes
 */

/**
 * @typedef RawLHLegacyDataSet
 * @type {object}
 * @property {string} [recordingID]
 * @property {string} [RecordingID]
 * @property {RawLHLegacyFrame[]} [frames]
 * @property {RawLHLegacyFrame[]} [Frames]
 * @property {DataSourceType} [applicationName]
 * @property {DataSourceType} [ApplicationName]
 */

/**
 * A pre-processor for the data sets resulting from Multimodal Learning Hub.
 *
 * @class
 * @extends {CommonDataSetProcessor}
 */
export class MLHProcessor extends CommonDataSetProcessor {
  _personIndices = [];

  _vectorComponents = {
    x: 'X',
    y: 'Y',
    z: 'Z'
  };

  static _jointNames = {
    AnkleRight: 'Ankle_Right',
    AnkleLeft: 'Ankle_Left',
    ElbowRight: 'Elbow_Right',
    ElbowLeft: 'Elbow_Left',
    HandRight: 'Hand_Right',
    HandLeft: 'Hand_Left',
    HandRightTip: 'Hand_Right_Tip',
    HandLeftTip: 'Hand_Left_Tip',
    Head: 'Head',
    HipRight: 'Hip_Right',
    HipLeft: 'Hip_Left',
    ShoulderRight: 'Shoulder_Right',
    ShoulderLeft: 'Shoulder_Left',
    SpineMid: 'Spine_Mid',
    SpineShoulder: 'Spine_Shoulder',
    HipMid: 'Hip_Mid'
  };

  static _jointNamesArray = [
    MLHProcessor._jointNames.AnkleRight,
    MLHProcessor._jointNames.AnkleLeft,
    MLHProcessor._jointNames.ElbowRight,
    MLHProcessor._jointNames.ElbowLeft,
    MLHProcessor._jointNames.HandRight,
    MLHProcessor._jointNames.HandLeft,
    MLHProcessor._jointNames.HandRightTip,
    MLHProcessor._jointNames.HandLeftTip,
    MLHProcessor._jointNames.Head,
    MLHProcessor._jointNames.HipRight,
    MLHProcessor._jointNames.HipLeft,
    MLHProcessor._jointNames.ShoulderRight,
    MLHProcessor._jointNames.ShoulderLeft,
    MLHProcessor._jointNames.SpineMid,
    MLHProcessor._jointNames.SpineShoulder,
    MLHProcessor._jointNames.HipMid
  ];

  static getAdjacentJoints() {
    return [
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.AnkleLeft
        ),
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.HipLeft)
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.HipLeft),
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.HipRight)
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HipRight
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.AnkleRight
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.HipMid),
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.SpineMid)
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.SpineMid
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.SpineShoulder
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.SpineShoulder
        ),
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.Head)
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HandLeftTip
        ),
        MLHProcessor._jointNamesArray.indexOf(MLHProcessor._jointNames.HandLeft)
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HandLeft
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ElbowLeft
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ElbowLeft
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ShoulderLeft
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ShoulderLeft
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.SpineShoulder
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.SpineShoulder
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ShoulderRight
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ShoulderRight
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ElbowRight
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.ElbowRight
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HandRight
        )
      ],
      [
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HandRight
        ),
        MLHProcessor._jointNamesArray.indexOf(
          MLHProcessor._jointNames.HandRightTip
        )
      ]
    ];
  }

  /**
   * @type {object[]}
   * @private
   */
  _framesPerPerson = [];

  notEmptyFrame = allPersonsPoints => {
    // e.g. allPersonsPoints = [{...points of person 1}, {...points of person 2}, ...]
    return (
      allPersonsPoints.length > 0 &&
      allPersonsPoints.reduce(
        (notEmpty, singlePersonPoints) =>
          Boolean(singlePersonPoints) || notEmpty,
        false
      )
    );
  };

  preProcess = () => {
    this.determinePersonIndices();

    const personsEmptyIndex = [];
    const personsPresenceIndex = [];
    for (let pId of this.personIndices) {
      personsEmptyIndex[pId] = 0;
      personsPresenceIndex[pId] = 0;
    }
    let framesPerPerson = this.frames
      .map(this.processFrame)
      .map(personsFrames => {
        return personsFrames.filter(frame => {
          const zeros = frame.keyPoints.reduce((zeroCounter, keyPoint) => {
            if (keyPoint.x === 0) zeroCounter++;
            return zeroCounter;
          }, 0);
          // if more than a third of joints has zero x coordinate, consider that pose/person
          // as miss-detected in current frame
          if (zeros > Object.keys(this.jointNames).length / 3) {
            personsEmptyIndex[frame.personIdx]++;
            return false;
          }
          personsPresenceIndex[frame.personIdx]++;
          return true;
        });
      });

    const detectionFps = this.getDetectionFps();

    // if a person was not present but is still in the dataset with zero values (like in Kinect datasets)
    // - remove it from dataset (not the data, but don't list its index so UI doesn't render it
    // since it iterates through person indices in the render loop)
    /** also, if a pearson appears in less than configured time interval in seconds, remove it from the dataset */
    const redundantPersons = [];
    for (let pId of this.personIndices) {
      if (
        personsPresenceIndex[pId] <= MIN_SECS_PRESENCE_AMOUNT * detectionFps ||
        personsEmptyIndex[pId] === framesPerPerson.length
      ) {
        delete this.personIndices[pId];
        redundantPersons.push(pId);
      }
    }

    this.calculateNormalScaleFactor3D();
    this.calculateTranslations();

    framesPerPerson = framesPerPerson.map(personsFrames =>
      personsFrames
        .filter(person => !redundantPersons.includes(person.personIdx))
        .map(person => {
          return {
            ...person,
            keyPoints: person.keyPoints
              .map(this.getNormalizedCenteredPoint)
              .sort(
                (k1, k2) =>
                  MLHProcessor._jointNamesArray.indexOf(k1.name) -
                  MLHProcessor._jointNamesArray.indexOf(k2.name)
              )
          };
        })
    );

    return new Promise(resolve =>
      resolve({
        framesPerPerson,
        personIndices: this.personIndices.filter(
          idx => typeof idx === 'number'
        ),
        extremes: this.extremes,
        normalization: {
          scaleFactor: this.normalScaleFactor,
          translateX: this.translateX,
          translateY: this.translateY,
          translateZ: this.translateZ
        },
        dataSource: this._dataSource,
        jointNames: MLHProcessor._jointNamesArray,
        detectionFps
      })
    );
  };

  determinePersonIndices() {
    this.frames.map(f =>
      Object.keys(f.frameAttributes).forEach(attributeKey => {
        const idx = Number((attributeKey.match(/^[\d]/) || [])[0] || 0);
        this.personIndices[idx] = idx;
      })
    );
  }

  filterAttributes = l => l.toLowerCase().localeCompare('Volume'.toLowerCase());

  processFrame = (frame, frameIdx) => {
    const frameJoints = frame.frameAttributes;
    this.setHipMidPoint({frameJoints});

    const jointNames = Object.keys(frameJoints)
      .map(l =>
        l
          .replace(this.endsWithSingleCharacterAndUnderscoreRegex, '')
          .replace(this.startsWithNumberAndOptUnderscoreRegex, '')
      )
      .filter(this.filterAttributes)
      .reduce((uniqueLabels, l) => {
        if (!uniqueLabels.includes(l)) {
          uniqueLabels.push(l);
        }
        return uniqueLabels;
      }, []);

    const pointsPerPerson = [];
    const correctedPointsPerPerson = [];
    for (const personIdx of this.personIndices) {
      if (isNaN(personIdx)) continue;
      const {keyPoints, correctedKeyPoints} =
        this.getSingleFramePointsForPerson({
          frameJoints,
          jointNames,
          personIdx,
          frameIdx
        });
      if (
        !keyPoints ||
        (Array.isArray(keyPoints) &&
          keyPoints.length < Object.keys(this.jointNames).length)
      ) {
        continue;
      }

      pointsPerPerson.push({
        personIdx,
        keyPoints
      });
      correctedPointsPerPerson.push({
        personIdx,
        keyPoints: correctedKeyPoints
      });
    }

    this._framesPerPerson.push(pointsPerPerson);
    return correctedPointsPerPerson;
  };

  setHipMidPoint = ({frameJoints}) => {
    for (const personIdx of this.personIndices) {
      if (isNaN(personIdx)) continue;
      // set hip_mid x coordinate by determining the distance between hip_left and hip_right vectors
      frameJoints[
        `${personIdx}_${this.jointNames.HipMid}_${this.vectorComponents.x}`
      ] =
        (this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName: this.jointNames.HipLeft,
          vectorComponent: this.vectorComponents.x
        }) +
          this.getJointVectorComponent({
            frameJoints,
            personIdx,
            jointName: this.jointNames.HipRight,
            vectorComponent: this.vectorComponents.x
          })) /
        2;
      // set hip_mid y coordinate by determining the distance between hip_left and hip_right vectors
      frameJoints[
        `${personIdx}_${this.jointNames.HipMid}_${this.vectorComponents.y}`
      ] =
        (this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName: this.jointNames.HipLeft,
          vectorComponent: this.vectorComponents.y
        }) +
          this.getJointVectorComponent({
            frameJoints,
            personIdx,
            jointName: this.jointNames.HipRight,
            vectorComponent: this.vectorComponents.y
          })) /
        2;
      // set hip_mid z coordinate by determining the distance between hip_left and hip_right vectors
      frameJoints[
        `${personIdx}_${this.jointNames.HipMid}_${this.vectorComponents.z}`
      ] =
        (this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName: this.jointNames.HipLeft,
          vectorComponent: this.vectorComponents.z
        }) +
          this.getJointVectorComponent({
            frameJoints,
            personIdx,
            jointName: this.jointNames.HipRight,
            vectorComponent: this.vectorComponents.z
          })) /
          2 || 0;
    }

    return frameJoints;
  };

  /**
   * To support multiple input formats, this method tries CameCase and underscore-separated joint name styles.
   * Furthermore, "person index"-prefixed names and those index-less are considered as well.
   * Therefore, the supported formats are:
   *    - {personIdx: Number}_BodyPart{vectorComponent: X | Y | Z} (e.g. 0_Hand_Right_X)
   *    - {personIdx: Number}_Body_Part{vectorComponent: _X | _Y | _Z} (e.g. 0_HandRightX)
   *    - BodyPart{vectorComponent: X | Y | Z} (e.g.Hand_Right_X)
   *    - Body_Part{vectorComponent: _X | _Y | _Z} (e.g. HandRightX)
   *
   * @param {object} frameJoints all joint points of the current frame
   *        (e.g. {Ankle_Left_X: ..., Left_Arm_Y: ... etc.} or prefixed with person index {0_Ankle_Left_X: ..., _3_Left_Arm_Y: ... etc.})
   * @param {number} personIdx index of a person the point is required from
   *        (e.g. 0, 1, 2, 3 etc.)
   * @param {string} jointName name of the joint the coordinate is required from
   *        (one of this._keyPoints, e.g. "Ankle_Left", "Hand_Right" etc.)
   * @param {string} vectorComponent represents the required vector component of the point
   *        (one of this._suffix, e.g. {"x" | "y" | "z"})
   * @returns {number} single vector component of the joint as a number if joint exists or NaN otherwise
   */
  getJointVectorComponent = ({
    frameJoints,
    jointName,
    vectorComponent,
    personIdx
  }) => {
    return [jointName, jointName.replaceAll('_', '')].reduce((v, label) => {
      if (!isNaN(frameJoints[`${personIdx}_${label}_${vectorComponent}`]))
        return Number(frameJoints[`${personIdx}_${label}_${vectorComponent}`]);
      if (!isNaN(frameJoints[`${personIdx}${label}${vectorComponent}`]))
        return Number(frameJoints[`${personIdx}${label}${vectorComponent}`]);
      if (!isNaN(frameJoints[`${personIdx}${label}_${vectorComponent}`]))
        return Number(frameJoints[`${personIdx}${label}_${vectorComponent}`]);
      if (!isNaN(frameJoints[`${label}_${vectorComponent}`]))
        return Number(frameJoints[`${label}_${vectorComponent}`]);
      if (!isNaN(frameJoints[`${label}${vectorComponent}`]))
        return Number(frameJoints[`${label}${vectorComponent}`]);
      return v;
    }, NaN);
  };

  getSingleFramePointsForPerson = ({
    frameJoints,
    jointNames,
    personIdx,
    frameIdx
  }) => {
    const keyPoints = [];
    const correctedKeyPoints = [];
    // let zeroPointsCounter = 0;

    for (const jointName of jointNames) {
      const values = [
        this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName,
          vectorComponent: this.vectorComponents.x
        }),
        this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName,
          vectorComponent: this.vectorComponents.y
        }),
        this.getJointVectorComponent({
          frameJoints,
          personIdx,
          jointName,
          vectorComponent: this.vectorComponents.z
        })
      ];
      if (values.reduce((flag, v) => isNaN(v), false)) continue;
      // const l = Object.keys(this.jointNames).length;
      // zeroPointsCounter += values.reduce(
      //   (sum, v) => sum + (v === 0 && 1 / l),
      //   0
      // );
      // id 2D case (record with tensorflow but save it LH format) all z's are zero
      // so a "person" is considered empty if it has more zeros than body part count
      // if (zeroPointsCounter > l) break;

      if (values[0] < this.extremes.xMin) this.extremes.xMin = values[0];
      if (values[1] < this.extremes.yMin) this.extremes.yMin = values[1];
      if (values[2] < this.extremes.zMin) this.extremes.zMin = values[2];

      if (values[0] > this.extremes.xMax) this.extremes.xMax = values[0];
      if (values[1] > this.extremes.yMax) this.extremes.yMax = values[1];
      if (values[2] > this.extremes.zMax) this.extremes.zMax = values[2];

      // correct gross detection mistakes by detecting too large "jumps" in joint coordinates of consecutive frames
      // if (frameIdx > 0) {
      let correctedValues = [...values];
      if (frameIdx > 0) {
        // if (frameIdx > 100 && frameIdx < 105 && personIdx === 0) {
        const prevFrame = this._framesPerPerson[frameIdx - 1].filter(
          person => person.personIdx === personIdx
        )[0];
        if (prevFrame) {
          const joint = prevFrame.keyPoints.filter(
            valueObject =>
              valueObject.name === (this.jointNames[jointName] || jointName)
          )[0];
          if (joint) {
            Object.keys(this.vectorComponents).forEach((key, i) => {
              const prevValue = joint[key];

              const deviation = Math.abs(
                ((values[i] - prevValue) / prevValue) * 100
              );
              if (
                deviation > MAX_JOINT_COORDINATE_DEVIATION &&
                values[i] !== 0
              ) {
                // correctedValues[i] = prevValue;
              }
            });
          }
        }
      }

      const labeledCorrectedValues = {
        name: this.jointNames[jointName] || jointName,
        [this.vectorComponents.x.toLowerCase()]: correctedValues[0],
        [this.vectorComponents.y.toLowerCase()]: correctedValues[1],
        [this.vectorComponents.z.toLowerCase()]: correctedValues[2]
      };

      const labeledOriginalValues = {
        name: this.jointNames[jointName] || jointName,
        [this.vectorComponents.x.toLowerCase()]: values[0],
        [this.vectorComponents.y.toLowerCase()]: values[1],
        [this.vectorComponents.z.toLowerCase()]: values[2]
      };

      keyPoints.push(labeledOriginalValues);
      correctedKeyPoints.push(labeledCorrectedValues);
    }

    // if (zeroPointsCounter > 3) return null;

    return {keyPoints, correctedKeyPoints};
  };

  get jointNames() {
    return MLHProcessor._jointNames;
  }

  get vectorComponents() {
    return this._vectorComponents;
  }

  get personIndices() {
    return this._personIndices;
  }

  set personIndices(value) {
    this._personIndices = value;
  }

  get jointNamesArray() {
    return MLHProcessor._jointNamesArray;
  }
}

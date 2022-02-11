import {IDataSetProcessor} from './IDataSetProcessor';

export class LHLegacyProcessor extends IDataSetProcessor {
  _personIndices = [];

  _vectorComponents = {
    x: 'X',
    y: 'Y',
    z: 'Z'
  };

  _jointNames = {
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
    HipMid: 'Hip_Mid',
    HipLeft: 'Hip_Left',
    ShoulderRight: 'Shoulder_Right',
    ShoulderLeft: 'Shoulder_Left',
    SpineMid: 'Spine_Mid',
    SpineShoulder: 'Spine_Shoulder'
  };

  _bodyLinesScheme = [
    [
      this.jointNames.AnkleLeft,
      this.jointNames.AnkleLeft.replaceAll('_', ''),
      this.jointNames.HipLeft,
      this.jointNames.HipLeft.replaceAll('_', ''),
      this.jointNames.HipRight,
      this.jointNames.HipRight.replaceAll('_', ''),
      this.jointNames.AnkleRight,
      this.jointNames.AnkleRight.replaceAll('_', '')
    ],
    [
      this.jointNames.HandLeftTip,
      this.jointNames.HandLeftTip.replaceAll('_', ''),
      this.jointNames.HandLeft,
      this.jointNames.HandLeft.replaceAll('_', ''),
      this.jointNames.ElbowLeft,
      this.jointNames.ElbowLeft.replaceAll('_', ''),
      this.jointNames.ShoulderLeft,
      this.jointNames.ShoulderLeft.replaceAll('_', ''),
      this.jointNames.SpineShoulder,
      this.jointNames.SpineShoulder.replaceAll('_', ''),
      this.jointNames.ShoulderRight,
      this.jointNames.ShoulderRight.replaceAll('_', ''),
      this.jointNames.ElbowRight,
      this.jointNames.ElbowRight.replaceAll('_', ''),
      this.jointNames.HandRight,
      this.jointNames.HandRight.replaceAll('_', ''),
      this.jointNames.HandRightTip,
      this.jointNames.HandRightTip.replaceAll('_', '')
    ],
    [
      this.jointNames.Head,
      this.jointNames.SpineShoulder,
      this.jointNames.SpineShoulder.replaceAll('_', ''),
      this.jointNames.SpineMid,
      this.jointNames.SpineMid.replaceAll('_', ''),
      this.jointNames.HipMid,
      this.jointNames.HipMid.replaceAll('_', '')
    ]
  ];

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
    let framesPerPerson = this.frames
      .map(this.processFrame)
      .filter(this.notEmptyFrame);

    this.calculateNormalScaleFactor3D();
    this.calculateTranslations();

    framesPerPerson = framesPerPerson.map(personsFrames =>
      personsFrames.map(frame => {
        return {
          ...frame,
          points: {
            ...frame.points,
            bodyLines: frame.points.bodyLines.map(bodyLine =>
              bodyLine.map(point => {
                return {
                  ...point,
                  x: (point.x - this.translateX) / this.normalScaleFactor - 0.5,
                  y: (point.y - this.translateY) / this.normalScaleFactor - 0.5,
                  z: (point.z - this.translateZ) / this.normalScaleFactor
                };
              })
            )
          }
        };
      })
    );
    return new Promise(resolve =>
      resolve({
        framesPerPerson,
        personIndices: this.personIndices,
        extremes: this.extremes,
        normalization: {
          scaleFactor: this.normalScaleFactor,
          translateX: this.translateX,
          translateY: this.translateY,
          translateZ: this.translateZ
        }
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

  processFrame = frame => {
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
    for (const personIdx of this.personIndices) {
      const points = this.getSingleFramePointsForPerson({
        frameJoints,
        jointNames,
        personIdx
      });

      if (!points) continue;
      pointsPerPerson.push({
        personIdx,
        points
      });
    }

    return pointsPerPerson;
  };

  setHipMidPoint = ({frameJoints}) => {
    for (const personIdx of this.personIndices) {
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
        2;
    }

    return frameJoints;
  };

  /**
   * To support multiple input formats, this method tries CameCase and underscore-separated joint name styles.
   * Furthermore "person index"-prefixed names and those index-less are considered as well.
   * Therefore the supported formats are:
   *    - {personIdx: Number}_BodyPart{vectorComponent: X | Y | Z} (e.g. 0_Hand_Right_X)
   *    - {personIdx: Number}_Body_Part{vectorComponent: _X | _Y | _Z} (e.g. 0_HandRightX)
   *    - BodyPart{vectorComponent: X | Y | Z} (e.g.Hand_Right_X)
   *    - Body_Part{vectorComponent: _X | _Y | _Z} (e.g. HandRightX)
   *
   * @param {object} frameJoints all joint points of teh current frame
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
    return [jointName, jointName.replaceAll('_', '')].reduce(
      (v, label) =>
        v ||
        Number(
          frameJoints[`${personIdx}_${label}_${vectorComponent}`] ||
            frameJoints[`${personIdx}${label}${vectorComponent}`] ||
            frameJoints[`${label}_${vectorComponent}`] ||
            frameJoints[`${label}${vectorComponent}`]
        ),
      NaN
    );
  };

  getSingleFramePointsForPerson = ({frameJoints, jointNames, personIdx}) => {
    const points = {
      asObjects: [],
      asArrays: [],
      flat: [],
      bodyLines: this.bodyLinesScheme.map(_ => [])
    };

    let zeroPointsCounter = 0;
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
      zeroPointsCounter += values.reduce(
        (sum, v) => sum + (v === 0 && 1 / 3),
        0
      );
      if (zeroPointsCounter > 3) break;

      if (values[0] < this.extremes.xMin) this.extremes.xMin = values[0];
      if (values[1] < this.extremes.yMin) this.extremes.yMin = values[1];
      if (values[2] < this.extremes.zMin) this.extremes.zMin = values[2];

      if (values[0] > this.extremes.xMax) this.extremes.xMax = values[0];
      if (values[1] > this.extremes.yMax) this.extremes.yMax = values[1];
      if (values[2] > this.extremes.zMax) this.extremes.zMax = values[2];

      const labeledValues = {
        label: jointName,
        [this.vectorComponents.x.toLowerCase()]: values[0],
        [this.vectorComponents.y.toLowerCase()]: values[1],
        [this.vectorComponents.z.toLowerCase()]: values[2]
      };
      points.asObjects.push(labeledValues);
      this.bodyLinesScheme.forEach((bodyLineScheme, i) => {
        if (bodyLineScheme.includes(jointName)) {
          points.bodyLines[i].push(labeledValues);
        }
      });

      points.asArrays.push(values);
      points.flat.push(...values);
    }

    if (zeroPointsCounter > 3) return null;

    points.bodyLines.forEach((bodyLine, i) => {
      return bodyLine.sort((a, b) => {
        return (
          this.bodyLinesScheme[i].indexOf(a.label) -
          this.bodyLinesScheme[i].indexOf(b.label)
        );
      });
    });
    return points;
  };

  get jointNames() {
    return this._jointNames;
  }

  get bodyLinesScheme() {
    return this._bodyLinesScheme;
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
}

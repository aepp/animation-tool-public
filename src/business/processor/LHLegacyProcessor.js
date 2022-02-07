import {IDataSetProcessor} from './IDataSetProcessor';

export class LHLegacyProcessor extends IDataSetProcessor {
  _frames;

  _suffixes = {
    x: '_X',
    y: '_Y',
    z: '_Z'
  };

  _keyPoints = {
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
      this.keyPoints.AnkleLeft,
      this.keyPoints.AnkleLeft.replaceAll('_', ''),
      this.keyPoints.HipLeft,
      this.keyPoints.HipLeft.replaceAll('_', ''),
      this.keyPoints.HipRight,
      this.keyPoints.HipRight.replaceAll('_', ''),
      this.keyPoints.AnkleRight,
      this.keyPoints.AnkleRight.replaceAll('_', '')
    ],
    [
      this.keyPoints.HandLeftTip,
      this.keyPoints.HandLeftTip.replaceAll('_', ''),
      this.keyPoints.HandLeft,
      this.keyPoints.HandLeft.replaceAll('_', ''),
      this.keyPoints.ElbowLeft,
      this.keyPoints.ElbowLeft.replaceAll('_', ''),
      this.keyPoints.ShoulderLeft,
      this.keyPoints.ShoulderLeft.replaceAll('_', ''),
      this.keyPoints.SpineShoulder,
      this.keyPoints.SpineShoulder.replaceAll('_', ''),
      this.keyPoints.ShoulderRight,
      this.keyPoints.ShoulderRight.replaceAll('_', ''),
      this.keyPoints.ElbowRight,
      this.keyPoints.ElbowRight.replaceAll('_', ''),
      this.keyPoints.HandRight,
      this.keyPoints.HandRight.replaceAll('_', ''),
      this.keyPoints.HandRightTip,
      this.keyPoints.HandRightTip.replaceAll('_', '')
    ],
    [
      this.keyPoints.Head,
      this.keyPoints.SpineShoulder,
      this.keyPoints.SpineShoulder.replaceAll('_', ''),
      this.keyPoints.SpineMid,
      this.keyPoints.SpineMid.replaceAll('_', ''),
      this.keyPoints.HipMid,
      this.keyPoints.HipMid.replaceAll('_', '')
    ]
  ];


  constructor({frames}) {
    super();
    this._frames = frames;
  }

  get keyPoints() {
    return this._keyPoints;
  }

  get bodyLinesScheme() {
    return this._bodyLinesScheme;
  }

  get suffixes() {
    return this._suffixes;
  }

  get frames() {
    return this._frames;
  }

  set frames(value) {
    this._frames = value;
  }

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
  }

  preProcess = () => {
    console.log('personIndices');
    const personIndices = this.getPersonIndices();
    // return frames.slice(1000, 1005).map((frame) => {
    return new Promise(resolve => resolve({
      framesPerPerson: this.frames
        // .slice(4127, 4129)
        .map(frame => this.processFrame({frame, personIndices}))
        .filter(this.notEmptyFrame),
      personIndices
    }));
  }

  getPersonIndices() {
    const personIndices = [];
    this.frames.map(f =>
      Object.keys(f.frameAttributes).forEach(attributeKey => {
        const idx = Number((attributeKey.match(/^[\d]/) || [])[0] || 0);
        personIndices[idx] = idx;
      })
    );
    return personIndices;
  }

  filterAttributes(l) {
    l.toLowerCase().localeCompare('Volume'.toLowerCase());
  }

  scale = n => n * 30;

  processFrame({frame, personIndices}) {
    const attributes = frame.frameAttributes;
    this.setHipMidPoint({attributes, personIndices});

    const pointLabels = Object.keys(attributes)
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
    for (const personIdx of personIndices) {
      const points = this.getSingleFramePointsForPerson({
        attributes,
        pointLabels,
        personIdx
      });

      if (!points) continue;
      pointsPerPerson.push({
        personIdx,
        points
      });
    }
    // console.log(attributes);
    return pointsPerPerson;
  }

  setHipMidPoint({attributes, personIndices}) {
    for (const personIdx of personIndices) {
      attributes[`${personIdx}_${this.keyPoints.HipMid}${this.suffixes.x}`] =
        (this.getUnsureAttributeValue({
          attributes,
          personIdx,
          pointLabel: this.keyPoints.HipLeft,
          suffix: this.suffixes.x
        }) +
          this.getUnsureAttributeValue({
            attributes,
            personIdx,
            pointLabel: this.keyPoints.HipRight,
            suffix: this.suffixes.x
          })) /
        2;
      attributes[`${personIdx}_${this.keyPoints.HipMid}${this.suffixes.y}`] =
        (this.getUnsureAttributeValue({
          attributes,
          personIdx,
          pointLabel: this.keyPoints.HipLeft,
          suffix: this.suffixes.y
        }) +
          this.getUnsureAttributeValue({
            attributes,
            personIdx,
            pointLabel: this.keyPoints.HipRight,
            suffix: this.suffixes.y
          })) /
        2;
      attributes[`${personIdx}_${this.keyPoints.HipMid}${this.suffixes.z}`] =
        (this.getUnsureAttributeValue({
          attributes,
          personIdx,
          pointLabel: this.keyPoints.HipLeft,
          suffix: this.suffixes.z
        }) +
          this.getUnsureAttributeValue({
            attributes,
            personIdx,
            pointLabel: this.keyPoints.HipRight,
            suffix: this.suffixes.z
          })) /
        2;
    }

    return attributes;
  }

  getUnsureAttributeValue({attributes, personIdx, pointLabel, suffix}) {
    return [pointLabel, pointLabel.replaceAll('_', '')].reduce(
      (v, label) =>
        this.getKnownAttributeValue({
          attributes,
          personIdx,
          pointLabel: label,
          suffix
        }),
      NaN
    );
  }

  getKnownAttributeValue({attributes, personIdx, pointLabel, suffix}) {
    return Number(
      attributes[`${personIdx}_${pointLabel}${suffix}`] ||
        attributes[`${personIdx}${pointLabel}${suffix}`] ||
        attributes[`${pointLabel}${suffix}`]
    );
  }

  getSingleFramePointsForPerson({attributes, pointLabels, personIdx}) {
    const points = {
      asObjects: [],
      asArrays: [],
      flat: [],
      bodyLines: this.bodyLinesScheme.map(_ => [])
    };

    let zeroPointsCounter = 0;
    for (const pointLabel of pointLabels) {
      const values = [
        this.scale(
          this.getKnownAttributeValue({
            attributes,
            personIdx,
            pointLabel,
            suffix: this.suffixes.x
          })
        ),
        this.scale(
          this.getKnownAttributeValue({
            attributes,
            personIdx,
            pointLabel,
            suffix: this.suffixes.y
          })
        ),
        this.scale(
          this.getKnownAttributeValue({
            attributes,
            personIdx,
            pointLabel,
            suffix: this.suffixes.z
          })
        )
      ];
      if (values.reduce((flag, v) => isNaN(v), false)) continue;
      zeroPointsCounter += values.reduce(
        (sum, v) => sum + (v === 0 && 1 / 3),
        0
      );
      if (zeroPointsCounter > 3) break;

      const labeledValues = {
        label: pointLabel,
        x: values[0],
        y: values[1],
        z: values[2]
      };
      points.asObjects.push({
        label: pointLabel,
        x: values[0],
        y: values[1],
        z: values[2]
      });
      this.bodyLinesScheme.forEach((bodyLineScheme, i) => {
        if (bodyLineScheme.includes(pointLabel)) {
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
  }
}

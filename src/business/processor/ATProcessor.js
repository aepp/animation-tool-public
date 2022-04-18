// eslint-disable-next-line no-unused-vars
import {SupportedModels} from '@tensorflow-models/pose-detection';
import {ScoreThreshHold} from '../../config/tensorFlow';
import {MIN_SECS_PRESENCE_AMOUNT} from '../../config/constants';
import {CommonDataSetProcessor} from './CommonDataSetProcessor';

/**
 * @class
 * @extends {CommonDataSetProcessor}
 */
export class ATProcessor extends CommonDataSetProcessor {
  /**
   * @type {SupportedModels}
   * @private
   */
  _model;

  /**
   * For a good performance save joints in a jointName => jointName map and return the keys of that
   * map when joints array is needed. This way we avoid the check whether a jointName is already in the
   * joints list or not when iterating through dataset.
   *
   * @type {object}
   * @private
   */
  _joints = {};

  constructor({frames, tfModel}) {
    super({frames});
    this._model = tfModel;
  }

  /**
   * @returns {Promise<PreProcessedDataSet>}
   */
  preProcess = () => {
    const detectionFps = this.getDetectionFps();

    const scoreThreshold = ScoreThreshHold[this._model] || 0.5;

    this.frames.forEach(persons =>
      persons.poses.forEach(({keypoints}) =>
        keypoints.forEach(({x, y, score}) => {
          this.extremes.xMax =
            this.extremes.xMax < x && score > scoreThreshold
              ? x
              : this.extremes.xMax;
          this.extremes.yMax =
            this.extremes.yMax < y && score > scoreThreshold
              ? y
              : this.extremes.yMax;

          this.extremes.xMin =
            this.extremes.xMin > x && score > scoreThreshold
              ? x
              : this.extremes.xMin;
          this.extremes.yMin =
            this.extremes.yMin > y && score > scoreThreshold
              ? y
              : this.extremes.yMin;
        })
      )
    );

    this.calculateNormalScaleFactor2D();
    this.calculateTranslations();

    let personIndices = [];
    const personsPresenceCount = [];
    let framesPerPerson = this.frames
      // .map(frame =>
      //   frame.reduce((framesPerPersonReduced, personsFrame) => {
      //     if (personsFrame.score >= ScoreThreshHold[this._model]) {
      //       framesPerPersonReduced.push(personsFrame);
      //     }
      //     return framesPerPersonReduced;
      //   }, [])
      // )
      // .filter(frame => frame.length)
      .map(frame =>
        frame.poses.map(({keypoints, score, id = 0}) => {
          if (!personIndices.includes(id)) {
            personIndices.push(id);
            personsPresenceCount[id] = 1;
          } else {
            personsPresenceCount[id]++;
          }
          return {
            keyPoints: keypoints.map(point => {
              this._addJoint(point.name);
              return {
                ...this.getNormalizedCenteredPoint(point),
                z: 0
              };
            }),
            score,
            personIdx: id
          };
        })
      );

    /** if a pearson appears in less than configured time interval in seconds, remove it from the dataset */
    const redundantPersons = [];
    personsPresenceCount.forEach((value, key) => {
      if (value <= MIN_SECS_PRESENCE_AMOUNT * detectionFps) {
        personIndices = personIndices.filter(id => id !== key);
        redundantPersons.push(key);
      }
    });

    framesPerPerson = framesPerPerson.map(persons => {
      return persons.filter(
        person => !redundantPersons.includes(person.personIdx)
      );
    });

    return new Promise(resolve => {
      /**
       * @type {PreProcessedDataSet}
       */
      const processedDataSet = {
        framesPerPerson,
        personIndices,
        extremes: this.extremes,
        normalization: {
          translateX: this.translateX,
          translateY: this.translateY,
          scaleFactor: this.normalScaleFactor
        },
        dataSource: this._dataSource,
        jointNames: this._getJointNames(),
        detectionFps
      };
      return resolve(processedDataSet);
    });
  };

  /**
   * @private
   * @returns {string[]}
   */
  _getJointNames() {
    return Object.keys(this._joints);
  }

  /**
   * @private
   * @param {string} joint
   */
  _addJoint(joint) {
    this._joints[joint] = joint;
  }

  get model() {
    return this._model;
  }
}

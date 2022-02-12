import {IDataSetProcessor} from './IDataSetProcessor';

export class TFProcessor extends IDataSetProcessor {
  _model;

  _jointNames = {
    nose: 'nose',
    left_eye: 'left_eye',
    right_eye: 'right_eye',
    left_ear: 'left_ear',
    right_ear: 'right_ear',
    left_shoulder: 'left_shoulder',
    right_shoulder: 'right_shoulder',
    left_elbow: 'left_elbow',
    right_elbow: 'right_elbow',
    left_wrist: 'left_wrist',
    right_wrist: 'right_wrist',
    left_hip: 'left_hip',
    right_hip: 'right_hip',
    left_knee: 'left_knee',
    right_knee: 'right_knee',
    left_ankle: 'left_ankle',
    right_ankle: 'right_ankle'
  };

  constructor({frames, model}) {
    super({frames});
    this._model = model;
  }
  preProcess = () => {
    const scoreThreshold = 0.95;
    this.frames.forEach(({keypoints}) =>
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
    );

    this.calculateNormalScaleFactor2D();
    this.calculateTranslations();

    const framesPerPerson = this.frames.map(({keypoints, score}) => ({
      keyPoints: keypoints.map(point => ({
        ...this.getNormalizedCenteredPoint(point),
        z: 0
      })),
      score
    }));
    return new Promise(resolve => {
      return resolve({
        // @todo consider "real" multi-person datasets
        framesPerPerson: framesPerPerson.map(frame => [frame]),
        personIndices: [0],
        extremes: this.extremes,
        normalization: {
          translateX: this.translateX,
          translateY: this.translateY,
          scaleFactor: this.normalScaleFactor
        }
      });
    });
  };

  get model() {
    return this._model;
  }
}

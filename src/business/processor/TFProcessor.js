import {IDataSetProcessor} from './IDataSetProcessor';
import {DataSourceType} from '../../config/constants';
// import {ScoreThreshHold} from '../../config/tensorFlow';

export class TFProcessor extends IDataSetProcessor {
  _model;

  constructor({frames, model}) {
    super({frames});
    this._model = model;
  }

  /**
   * @returns {Promise<PreProcessedDataSet>}
   */
  preProcess = () => {
    const scoreThreshold = 0; //ScoreThreshHold[this._model];

    this.frames.forEach(persons =>
      persons.forEach(({keypoints}) =>
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

    const framesPerPerson = this.frames.map(persons =>
      persons.map(({keypoints, score}) => ({
        keyPoints: keypoints.map(point => ({
          ...this.getNormalizedCenteredPoint(point),
          z: 0
        })),
        score
      }))
    );
    return new Promise(resolve => {
      /**
       * @type {PreProcessedDataSet}
       */
      const processedDataSet = {
        framesPerPerson,
        personIndices: [0],
        extremes: this.extremes,
        normalization: {
          translateX: this.translateX,
          translateY: this.translateY,
          scaleFactor: this.normalScaleFactor
        },
        dataSource: DataSourceType.DATA_SOURCE_TF
      };
      return resolve(processedDataSet);
    });
  };

  get model() {
    return this._model;
  }
}

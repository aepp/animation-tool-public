import {
  // eslint-disable-next-line no-unused-vars
  Object3D
} from 'three';
import {
  DataSourceType,
  ORBIT_CONTROLS_Z_LIMIT_ADDITION,
  PlayBackDirectionType
} from '../../config/constants';
import {updateCurrentFrameIndexFromThree} from '../../react/views/Visualization/modules/Animation/actions/uiChannel';
import {UNKNOWN_DATA_SOURCE} from '../../i18n/messages';
import {RenderHelper3D} from '../helper/RenderHelper3D';
import {RenderHelper2D} from '../helper/RenderHelper2D';
import ThreeRenderService from '../service/ThreeRenderService';
import {DataSetModel} from '../model/DataSetModel';
import {PlaybackController} from './PlaybackController';

export class AnimationController extends PlaybackController {
  /**
   *
   * @type {Object3D[]}
   * @private
   */
  _currentFrameObjects = [];

  /**
   *
   * @type {Object3D}
   * @private
   */
  _room;

  // services
  /**
   * @type {RenderHelper}
   * @private
   */
  _renderHelper;

  /**
   * @type {ThreeRenderService}
   * @private
   */
  _threeRenderService;

  /**
   * Has to set on sagas setup to be able to send feedback to the ui over redux-saga channel
   * @type {Function}
   * @param {String} type
   * @param {Object} payload
   * @private
   */
  _sendToUi = ({type, payload}) => {
    console.log(
      `trying to send message ${type} with payload ${payload}, but sendToUi not ready yet...`
    );
  };

  /**
   * @param {HTMLElement} rootElement
   */
  constructor(
    {rootElement = document.body} = {
      rootElement: document.body
    }
  ) {
    super();
    this._threeRenderService = new ThreeRenderService({rootElement});
  }

  /**
   *
   * @public
   * @param {DataSourceType} dataSource
   * @param {Extremes} extremes
   * @param {Normalization} normalization
   * @param {Array.<>} framesPerPerson
   * @param {number} framesCount
   * @param {number[]} personIndices
   * @returns {AnimationController}
   */
  setup({
    dataSource,
    extremes,
    normalization,
    framesPerPerson,
    framesCount,
    personIndices
  }) {
    const dataSetModel = new DataSetModel({
      extremes,
      normalization,
      framesPerPerson,
      framesCount,
      personIndices
    });

    switch (dataSource) {
      case DataSourceType.DATA_SOURCE_KINECT:
        this._renderHelper = new RenderHelper3D({dataSetModel});
        break;
      case DataSourceType.DATA_SOURCE_TF:
        this._renderHelper = new RenderHelper2D({dataSetModel});
        break;
      default:
        throw new Error(UNKNOWN_DATA_SOURCE);
    }

    this._threeRenderService.updateCameraPosition({
      x: 0,
      y: 0,
      z: this._renderHelper.calculateFovDistance({
        fov: this._threeRenderService.fov
      })
    });

    this._threeRenderService.updateCameraControls({
      minDistance: extremes.zMin - ORBIT_CONTROLS_Z_LIMIT_ADDITION,
      maxDistance: extremes.zMax + ORBIT_CONTROLS_Z_LIMIT_ADDITION
    });

    this._room = this._renderHelper.generateRoom();
    this._threeRenderService.addObject(this._room);

    this._currentFrameIdx = 0;
    return this;
  }

  _requestId = 1;
  /**
   * @async
   * @public
   * @returns {Promise<AnimationController>}
   */
  async animationLoop() {
    cancelAnimationFrame(this._requestId);
    // @todo dynamic fps adjustment
    // await new Promise(resolve => setTimeout(resolve, this.playbackSpeed));
    await new Promise(resolve => setTimeout(resolve, 16)); // i.e. 1000 / 16 = 60 fps
    this._requestId = requestAnimationFrame(this.animationLoop.bind(this));
    this._playAnimation();
    return this;
  }

  /**
   * @private
   * @returns {AnimationController}
   */
  _playAnimation() {
    if (this.isPlaying) {
      this._renderCurrentFrame();

      if (this.playbackDirection === PlayBackDirectionType.DEFAULT) {
        if (
          this.currentFrameIdx ===
          this._renderHelper.dataSetModel.maxFramesCount - 1
        ) {
          this.currentFrameIdx = 0;
        }
        this.currentFrameIdx += 1;
      } else {
        if (this.currentFrameIdx === 0) {
          this.currentFrameIdx = this._renderHelper.dataSetModel.maxFramesCount;
        }
        this.currentFrameIdx -= 1;
      }
      this._sendFrameIdxToUi();
    } else {
      this._threeRenderService.updateScene();
    }
    return this;
  }

  /**
   * @private
   * @returns {AnimationController}
   */
  _renderCurrentFrame() {
    const newSceneObjects =
      this._renderHelper.generateAnimationObjectsFromFrame({
        frameIdx: this._currentFrameIdx
      });

    this._threeRenderService.updateScene({
      objectsToAdd: newSceneObjects
    });

    return this;
  }

  /**
   * @public
   * @returns {AnimationController}
   */
  softReset() {
    this._threeRenderService.softReset();
    this._room = undefined;
    this._currentFrameObjects = [];
    this.currentFrameIdx = 0;
    this._sendFrameIdxToUi();
    this.resetPlayback();
    this._threeRenderService.updateScene();

    return this;
  }

  /**
   * @public
   * @param {number} frameIdx
   */
  set currentFrameIdx(frameIdx) {
    this._currentFrameIdx = frameIdx;
  }

  get currentFrameIdx() {
    return this._currentFrameIdx;
  }

  /**
   * @public
   * @param {Function} value
   */
  set sendToUi(value) {
    this._sendToUi = value;
  }

  /**
   * @private
   * @param {number} [frameIdx]
   */
  _sendFrameIdxToUi(frameIdx = undefined) {
    this._sendToUi({
      type: updateCurrentFrameIndexFromThree.type,
      payload: frameIdx === undefined ? this.currentFrameIdx : frameIdx
    });
  }

  /**
   * @public
   * @param {number} frameIdx
   */
  updateFrameIdxFromUi(frameIdx = undefined) {
    this._currentFrameIdx = frameIdx;
    this._renderCurrentFrame();
  }
}

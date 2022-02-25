import {
  BASE_FPS,
  DEFAULT_FPS_MULTIPLIER,
  FPS_SPEED_UPS,
  PlayBackDirectionType
} from '../../config/constants';

/**
 * @class
 */
export class PlaybackController {
  /**
   *
   * @type {boolean}
   * @private
   */
  _isPlaying = false;

  /**
   *
   * @type {PlayBackDirectionType}
   * @private
   */
  _playbackDirection = PlayBackDirectionType.DEFAULT;

  /**
   *
   * @type {number}
   * @private
   */
  _fpsMultiplier = DEFAULT_FPS_MULTIPLIER;

  /**
   *
   * @type {number}
   * @private
   */
  _frameIdxIncrement = DEFAULT_FPS_MULTIPLIER;

  constructor(
    {
      isPlaying = undefined,
      playbackDirection = undefined,
      fpsMultiplier = undefined
    } = {
      isPlaying: undefined,
      playbackDirection: undefined,
      fpsMultiplier: undefined
    }
  ) {
    this._isPlaying = isPlaying || this._isPlaying;
    this._playbackDirection = playbackDirection || this._playbackDirection;
    this.fpsMultiplier = fpsMultiplier || this._fpsMultiplier;
  }

  incrementFrameRate() {
    const currentFpsMultiplierIdx = FPS_SPEED_UPS.indexOf(this._fpsMultiplier);
    let nextFpsIdx =
      currentFpsMultiplierIdx + 1 < FPS_SPEED_UPS.length
        ? currentFpsMultiplierIdx + 1
        : 0;
    this.fpsMultiplier = FPS_SPEED_UPS[nextFpsIdx];
    return this._fpsMultiplier;
  }
  /**
   * e.g. 1000ms / 60 fps = 16ms - i.e. render next frame every 16 to achieve a frame rate of 60
   * @returns {number}
   */
  getTimeoutByCurrentFps() {
    return 1000 / (this._fpsMultiplier * BASE_FPS);
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(value) {
    this._isPlaying = value;
  }

  get playbackDirection() {
    return this._playbackDirection;
  }

  set playbackDirection(value) {
    this._playbackDirection = value;
  }

  get fpsMultiplier() {
    return this._fpsMultiplier;
  }

  set fpsMultiplier(value) {
    this._fpsMultiplier = value;
    this._frameIdxIncrement = Math.ceil(value);
  }

  get frameIdxIncrement() {
    return this._frameIdxIncrement;
  }

  resetPlayback() {
    this._playbackDirection = PlayBackDirectionType.DEFAULT;
    this.fpsMultiplier = DEFAULT_FPS_MULTIPLIER;
  }
}

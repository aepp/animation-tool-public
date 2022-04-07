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

  /**
   *
   * @type {number}
   * @private
   */
  _baseFps = BASE_FPS;

  constructor(
    {
      isPlaying = undefined,
      playbackDirection = undefined,
      fpsMultiplier = undefined,
      baseFps = BASE_FPS
    } = {
      isPlaying: undefined,
      playbackDirection: undefined,
      fpsMultiplier: undefined,
      baseFps: BASE_FPS
    }
  ) {
    this._isPlaying = isPlaying || this._isPlaying;
    this._playbackDirection = playbackDirection || this._playbackDirection;
    this._baseFps = baseFps;
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
    return 1000 / ((this.fpsMultiplier * 1000) / this.baseFps);
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

  get baseFps() {
    return this._baseFps;
  }

  set baseFps(value) {
    this._baseFps = value;
  }

  /**
   * @param {number} baseFps
   */
  resetPlayback({baseFps = BASE_FPS} = {baseFps: BASE_FPS}) {
    this._playbackDirection = PlayBackDirectionType.DEFAULT;
    this.fpsMultiplier = DEFAULT_FPS_MULTIPLIER;
    this.baseFps = baseFps;
  }
}

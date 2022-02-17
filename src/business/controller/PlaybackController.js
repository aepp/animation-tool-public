import {PlaybackService} from '../service/PlaybackService';
import {
  PLAYBACK_SPEED_DEFAULT,
  PlayBackDirectionType
} from '../../config/constants';

export class PlaybackController {
  _isPlaying;

  _playbackSpeed;

  _playbackDirection;

  _framesAmountToSkip;

  _playbackService;

  constructor(
    {
      isPlaying = true,
      playbackSpeed = PLAYBACK_SPEED_DEFAULT,
      playbackDirection = PlayBackDirectionType.DEFAULT,
      framesAmountToSkip = 0
    } = {
      isPlaying: true,
      playbackSpeed: PLAYBACK_SPEED_DEFAULT,
      playbackDirection: PlayBackDirectionType.DEFAULT,
      framesAmountToSkip: 0
    }
  ) {
    this._playbackService = new PlaybackService();
    this._isPlaying = isPlaying;
    this._playbackSpeed = playbackSpeed;
    this._playbackDirection = playbackDirection;
    this._framesAmountToSkip = framesAmountToSkip;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(value) {
    this._isPlaying = value;
  }

  get playbackSpeed() {
    return this._playbackService.calculatePlaybackSpeed({
      factor: this._playbackSpeed
    });
  }

  set playbackSpeed(value) {
    this._playbackSpeed = value;
  }

  get playbackDirection() {
    return this._playbackDirection;
  }

  set playbackDirection(value) {
    this._playbackDirection = value;
  }

  get framesAmountToSkip() {
    return this._framesAmountToSkip;
  }

  set framesAmountToSkip(value) {
    this._framesAmountToSkip = value;
  }

  resetPlayback() {
    this.playbackDirection = PlayBackDirectionType.DEFAULT;
    this.playbackSpeed = PLAYBACK_SPEED_DEFAULT;
  }
}

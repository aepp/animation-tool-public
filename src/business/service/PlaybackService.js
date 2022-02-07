export class PlaybackService {
  _timeout;

  get timeout() {
    return this._timeout;
  }

  set timeout(value) {
    this._timeout = value;
  }

  constructor({timeout = 60} = {timeout: 60}) {
    this._timeout = timeout;
  }

  calculatePlaybackSpeed({factor = 1}) {
    return this._timeout / factor;
  }
}

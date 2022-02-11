export class DatasetHelper {
  // data
  _framesPerPerson = [];

  _personIndices = [];

  _maxFramesCount;

  _currentFrameIdx;

  get framesPerPerson() {
    return this._framesPerPerson;
  }

  set framesPerPerson(value) {
    this._framesPerPerson = value;
  }

  get maxFramesCount() {
    return this._maxFramesCount;
  }

  set maxFramesCount(value) {
    this._maxFramesCount = value;
  }

  get currentFrameIdx() {
    return this._currentFrameIdx;
  }

  set currentFrameIdx(value) {
    this._currentFrameIdx = value;
  }

  get personIndices() {
    return this._personIndices;
  }

  set personIndices(value) {
    this._personIndices = value;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this.framesPerPerson = framesPerPerson;
    this.currentFrameIdx = -1;
    this.maxFramesCount = framesCount;
    this.personIndices = personIndices;
    return this;
  }
}

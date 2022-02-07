const colors = [0x33ff33, 0x0000ff, 0xff00ff, 0x00ffff, 0x222222];
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};
export class ThreeModel {
  // basic
  _width;

  _height;

  // data
  _framesPerPerson = [];

  _colorsPerPerson = {};

  _personIndices = [];

  _maxFramesCount;

  _currentFrameIdx;

  constructor(
    {rootElement} = {
      rootElement: document.body
    }
  ) {
    this.width = rootElement.clientWidth;
    this.height = rootElement.clientHeight;
  }

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

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
  }

  set personsLineColor({personIdx, lineColor}) {
    this._colorsPerPerson[personIdx] = lineColor;
  }

  get personIndices() {
    return this._personIndices;
  }

  set personIndices(value) {
    this._personIndices = value;
  }

  get colorsPerPerson() {
    return this._colorsPerPerson;
  }

  set colorsPerPerson(value) {
    this._colorsPerPerson = value;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this.framesPerPerson = framesPerPerson;
    this.currentFrameIdx = -1;
    this.maxFramesCount = framesCount;
    this.personIndices = personIndices;
    this.colorsPerPerson = personIndices.reduce(
      (colors, personIdx) => ({...colors, [personIdx]: getRandomColor()}),
      {}
    );
    return this;
  }
}

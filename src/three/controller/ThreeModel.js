
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

  set personsLineColor({personIdx, lineColor}) {
    this._colorsPerPerson[personIdx] = lineColor;
  }

  get personIndices() {
    return this._personIndices;
  }

  constructor(
    {rootElement} = {
      rootElement: document.body
    }
  ) {
    this._width = rootElement.clientWidth;
    this._height = rootElement.clientHeight;
  }

  initFrames({framesPerPerson, framesCount, personIndices}) {
    this._framesPerPerson = framesPerPerson;
    this._currentFrameIdx = -1;
    this._maxFramesCount = framesCount;
    this._personIndices = personIndices;
    this._colorsPerPerson = personIndices.reduce(
      (colors, personIdx) => ({...colors, [personIdx]: getRandomColor()}),
      {}
    );

    return this;
  }
}

import {IDataSetProcessor} from './IDataSetProcessor';

export class TFProcessor extends IDataSetProcessor {
  _frames;

  constructor({frames}) {
    super();
    this._frames = frames;
  }

  preProcess = () => {};

  get frames() {
    return this._frames;
  }

  set frames(value) {
    this._frames = value;
  }
}

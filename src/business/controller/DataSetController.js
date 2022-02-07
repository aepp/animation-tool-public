import {DataSetService} from '../service/DataSetService';

export class DataSetController {
  _dataSet;

  _descriptor;

  _service = new DataSetService();

  constructor({dataSet, descriptor}) {
    if (!dataSet) throw new Error('You need to provide a json dataset.');
    this.dataSet = dataSet;
    if (!descriptor) {
      descriptor = this.service.identifyDataSet(dataSet);
    }
    this.descriptor = descriptor;
  }

  get service() {
    return this._service;
  }

  get descriptor() {
    return this._descriptor;
  }

  set descriptor(value) {
    this._descriptor = value;
  }

  get dataSet() {
    return this._dataSet;
  }

  set dataSet(value) {
    this._dataSet = value;
  }
}

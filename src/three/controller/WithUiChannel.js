export class WithUiChannel {
  // feedback to the ui over redux-saga channel
  _sendToUi = () => {};

  get sendToUi() {
    return this._sendToUi;
  }

  set sendToUi(value) {
    this._sendToUi = value;
  }
}

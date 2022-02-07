export class IDataSetProcessor {
  preProcess = () => {};

  _startsWithNumberAndOptUnderscoreRegex = new RegExp(/^[\d]+_*/);

  _endsWithSingleCharacterAndUnderscoreRegex = new RegExp(/_[XYZ]$/);

  get startsWithNumberAndOptUnderscoreRegex() {
    return this._startsWithNumberAndOptUnderscoreRegex;
  }

  get endsWithSingleCharacterAndUnderscoreRegex() {
    return this._endsWithSingleCharacterAndUnderscoreRegex;
  }
}

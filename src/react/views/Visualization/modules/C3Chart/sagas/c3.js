import {fork, takeLatest, call, put, select, take} from 'redux-saga/effects';
import {
  finishC3ChartInit,
  initC3Chart,
  setC3AttributeDictionary,
  setC3ChartArgs
} from '../actions/c3';
import {addToAttrDict} from '../helper/legacy_initAttributeDictionary';
import {treeOnChange} from '../helper/legacy_selectC3Data';
import {selectOriginalDataSet} from '../../DataSet/reducers';
import {setDataSet} from '../../DataSet/actions';

function* handleInitC3Chart() {
  yield take(setDataSet.type);

  const dataSetOriginal = yield select(selectOriginalDataSet);
  console.log(dataSetOriginal);
  const attributeDictionary = yield call(addToAttrDict, dataSetOriginal);
  yield put(setC3AttributeDictionary(attributeDictionary));

  const c3Args = yield call(treeOnChange, {attrDict: attributeDictionary});
  yield put(setC3ChartArgs(c3Args));
  yield put(finishC3ChartInit());
}

function* watchInitC3Chart() {
  yield takeLatest(initC3Chart.type, handleInitC3Chart);
}
export default function* rootSaga() {
  yield fork(watchInitC3Chart);
}

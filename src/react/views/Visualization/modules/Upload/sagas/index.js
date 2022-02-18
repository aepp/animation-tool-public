import {put, takeLatest, fork, select, call} from 'redux-saga/effects';
import {loadAsync} from 'jszip';
import {
  DataSetFileFormat,
  DataSourceType,
  IgnoredFileNamesPatterns
} from '../../../../../../config/constants';
import {
  showErrorMessage,
  showWarnMessage
} from '../../../../../modules/App/actions';
import {
  ARCHIVE_IS_EMPTY,
  FILE_FORMAT_NOT_SUPPORTED,
  MULTIPLE_DATASET_FILES,
  NO_SUPPORTED_DATASET_FILES_FOUND
} from '../../../../../../i18n/messages';
import {setDataSetFile, setDataSetFileUrl} from '../actions';
import {selectDataSetFileUrl} from '../reducers';

const getFileFromZip = async ({zipFile, fileName}) => {
  const file = await zipFile.async('blob');
  return new File([file], fileName);
};

function* handleSelectDataSetFile(action) {
  const file = action.payload;
  if (!file) return;

  const currentUrl = yield select(selectDataSetFileUrl);
  if (currentUrl) URL.revokeObjectURL(currentUrl);

  let dataSetFile;
  // dealing with a zip file
  if (file.type.indexOf(DataSetFileFormat.ZIP.replace('.', '')) > 1) {
    const zip = yield call(loadAsync, file);
    // don't proceed if the zip is empty
    if (!zip.files) {
      yield put(showErrorMessage(ARCHIVE_IS_EMPTY));
      return;
    }

    let fileNames = Object.keys(zip.files).filter(
      fileName =>
        !new RegExp(
          IgnoredFileNamesPatterns.map(ds => ds.toLowerCase()).join('|')
        ).test(fileName.toLowerCase())
    );

    // don't proceed if zip contains only ignored files
    if (!fileNames.length) {
      yield put(showErrorMessage(FILE_FORMAT_NOT_SUPPORTED));
      return;
    }

    let zipFile = zip.files[fileNames[0]];
    let fileName = fileNames[0];

    // if zip contains multiple files
    if (fileNames.length > 1) {
      // find all files, which names contain datasource specification and have the supported file format
      fileNames = fileNames.filter(
        fileName =>
          new RegExp(
            Object.values(DataSourceType)
              .map(ds => ds.toLowerCase())
              .join('|')
          ).test(fileName.toLowerCase()) &&
          new RegExp(
            Object.values(DataSetFileFormat)
              .map(dsf => dsf.toLowerCase())
              .join('|')
          ).test(fileName.toLowerCase())
      );
      if (!fileNames.length) {
        // don't proceed if no supported dataset files found in the archive
        yield put(showErrorMessage(NO_SUPPORTED_DATASET_FILES_FOUND));
        return;
      }
      // if more than one file seem to be a supported dataset file, show a warning and simply use the first one
      if (fileNames.length > 1) {
        yield put(showWarnMessage(MULTIPLE_DATASET_FILES(fileNames[0])));
      }

      zipFile = zip.files[fileNames[0]];
      fileName = fileNames[0];
    }
    // get file object from the compressed dataset file
    dataSetFile = yield call(getFileFromZip, {
      zipFile,
      fileName
    });
  } else if (file.type.indexOf(DataSetFileFormat.JSON.replace('.', ''))) {
    // dealing with json file
    dataSetFile = file;
  } else {
    // provided file format is not supported
    yield put(showErrorMessage(FILE_FORMAT_NOT_SUPPORTED));
    return;
  }
  // create objectUrl to the dataset file
  yield put(setDataSetFileUrl(window.URL.createObjectURL(dataSetFile)));
}

function* watchSelectDataSetSaga() {
  yield takeLatest(setDataSetFile.type, handleSelectDataSetFile);
}

function* rootSaga() {
  yield fork(watchSelectDataSetSaga);
}

export default rootSaga;

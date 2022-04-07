import {put, takeLatest, fork, select, call} from 'redux-saga/effects';
import {loadAsync} from 'jszip';
import {
  SupportedInputFileFormat,
  DataSourceType,
  IgnoredFileNamesPatterns,
  SupportedDataSetFileFormats
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
import {
  beginUpload,
  finishUpload,
  setDataFile,
  setDataFileType,
  setDataFileUrl,
  setInputFileType
} from '../actions';
import {selectDataFileUrl} from '../reducers';
import {getMimeTypeByFileName} from '../helper';

const getFileFromZip = async ({zipFile, fileName}) => {
  const file = await zipFile.async('blob');
  return new File([file], fileName, {type: getMimeTypeByFileName(fileName)});
};

function* handleSelectDataSetFile(action) {
  let file = action.payload;
  if (!file) return;

  yield put(beginUpload());

  yield put(setInputFileType(file.type));

  const currentUrl = yield select(selectDataFileUrl);
  if (currentUrl) URL.revokeObjectURL(currentUrl);

  let dataFile;
  let dataFileType;
  // dealing with a zip file
  if (file.type.indexOf(SupportedInputFileFormat.ZIP.replace('.', '')) > 1) {
    const zip = yield call(loadAsync, file);
    // don't proceed if the zip is empty
    if (!zip.files) {
      yield put(showErrorMessage(ARCHIVE_IS_EMPTY));
      yield put(finishUpload());
      return;
    }

    const allFileNames = Object.keys(zip.files).filter(
      fileName =>
        !new RegExp(
          IgnoredFileNamesPatterns.map(ds => ds.toLowerCase()).join('|')
        ).test(fileName.toLowerCase())
    );

    // don't proceed if zip contains only ignored files
    if (!allFileNames.length) {
      yield put(showErrorMessage(FILE_FORMAT_NOT_SUPPORTED));
      yield put(finishUpload());
      return;
    }

    let zipFile = zip.files[allFileNames[0]];
    let fileName = allFileNames[0];

    // if zip contains multiple files
    if (allFileNames.length > 1) {
      // find all files, which names contain datasource specification and have the supported file format
      let supportedFileNames = allFileNames.filter(fileName =>
        new RegExp(SupportedInputFileFormat.MP4.toLowerCase()).test(
          fileName.toLowerCase()
        )
      );
      if (!supportedFileNames.length) {
        // if no supported dataset files found in the archive, check if there's a video file provided as fallback
        supportedFileNames = allFileNames.filter(
          fileName =>
            new RegExp(
              Object.values(DataSourceType)
                .map(ds => ds.toLowerCase())
                .join('|')
            ).test(fileName.toLowerCase()) &&
            new RegExp(
              SupportedDataSetFileFormats.map(dsf => dsf.toLowerCase()).join(
                '|'
              )
            ).test(fileName.toLowerCase())
        );
        if (!supportedFileNames.length) {
          yield put(showErrorMessage(NO_SUPPORTED_DATASET_FILES_FOUND));
          yield put(finishUpload());
          return;
        }
      }
      // if more than one file seem to be a supported dataset file, show a warning and simply use the first one
      if (supportedFileNames.length > 1) {
        yield put(
          showWarnMessage(MULTIPLE_DATASET_FILES(supportedFileNames[0]))
        );
      }

      zipFile = zip.files[supportedFileNames[0]];
      fileName = supportedFileNames[0];
    }

    // get file object from the compressed dataset file
    file = yield call(getFileFromZip, {
      zipFile,
      fileName
    });
  }

  if (file.type.indexOf(SupportedInputFileFormat.MP4.replace('.', '')) >= 0) {
    // dealing with a video file
    dataFileType = SupportedInputFileFormat.MP4;
    dataFile = file;
  } else if (
    file.type.indexOf(SupportedInputFileFormat.JSON.replace('.', '')) >= 0
  ) {
    // dealing with json file
    dataFileType = SupportedInputFileFormat.JSON;
    dataFile = file;
  } else {
    // provided file format is not supported
    yield put(showErrorMessage(FILE_FORMAT_NOT_SUPPORTED));
    yield put(finishUpload());
    return;
  }

  // set input file type (if a mp4 is provided then a video player will be displayed,
  // if a json dataset file is provided, the animation will be displayed
  yield put(setDataFileType(dataFileType));
  // create objectUrl to the dataset (or video) file
  yield put(setDataFileUrl(window.URL.createObjectURL(dataFile)));
  yield put(finishUpload());
}

function* watchSelectDataSetSaga() {
  yield takeLatest(setDataFile.type, handleSelectDataSetFile);
}

function* rootSaga() {
  yield fork(watchSelectDataSetSaga);
}

export default rootSaga;

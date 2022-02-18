export const UNKNOWN_DATA_SOURCE =
  'Unknown data source. See readme for supported dataset formats.';
export const ARCHIVE_IS_EMPTY =
  "Provided zip archive doesn't contain any files.";
export const NO_SUPPORTED_DATASET_FILES_FOUND =
  'Provided zip archive doesn\'t contain any supported dataset files. This check is based on file name - data source name (e.g. "kinect", "tensorflow") has to be part of the file name.';
export const FILE_FORMAT_NOT_SUPPORTED =
  'Dataset file format not supported. Please provide dataset in a .json file.';
export const MULTIPLE_DATASET_FILES = fileName =>
  `Archive contains multiple files with supported file name pattern, we'll use the first one: ${fileName}`;

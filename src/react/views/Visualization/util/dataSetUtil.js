import {SupportedModels} from '@tensorflow-models/pose-detection';
import {DataSourceType} from '../../../../config/constants';

export const validateSelectedDataSet = (dataSet = {}) => {
  const source = dataSet.source;

  // read datasource id from dataset
  const dataSource =
    dataSet.ApplicationName ||
    dataSet.applicationName ||
    (source ? source.id : null);

  // if datasource id not found stop further checks, dataset format is not supported
  if (!dataSource || dataSource === '')
    return generateBadFormatCheckResult("can't identify data source");

  let tfModel = null;
  let checkFramesIsArrayOfArrays = false;
  // if dealing with datasource from tensor flow estimation, determine the tensor flow model used for estimation
  if (source && dataSource === DataSourceType.DATA_SOURCE_TF) {
    checkFramesIsArrayOfArrays = true;
    const details = source.details;
    const modelFromDataSet =
      details && details.model ? details.model : undefined;
    // if model is defined in dataset file and is supported - we're fine
    if (
      modelFromDataSet &&
      Object.keys(SupportedModels).includes(modelFromDataSet)
    ) {
      tfModel = modelFromDataSet;
    } else {
      return generateBadFormatCheckResult("can't read tensorflow model");
    }
  }

  const frames = dataSet.Frames || dataSet.frames;

  // check frames format
  if (!frames) return generateBadFormatCheckResult("can't read frames");
  if (!Array.isArray(frames))
    return generateBadFormatCheckResult('frames should be in an array');
  if (!frames.length)
    return generateBadFormatCheckResult('frames array is empty');
  if (checkFramesIsArrayOfArrays && !Array.isArray(frames[0]))
    return generateBadFormatCheckResult(
      'frames array should be an array of arrays with frames per person'
    );

  // format seems to be fine
  return {
    dataSource,
    frames,
    frameStamps: frames.map(frame => frame.frameStamp),
    tfModel,
    isValid: true
  };
};

const generateBadFormatCheckResult = message => ({
  isValid: false,
  message: `Bad dataset format: ${message}.`
});

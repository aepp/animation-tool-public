import {SupportedModels} from '@tensorflow-models/pose-detection';
import {
  BASE_FPS,
  BASE_FPS_TF,
  DataSourceType
} from '../../../../config/constants';

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
  let baseFps = BASE_FPS;
  if (
    [
      DataSourceType.DATA_SOURCE_TF,
      DataSourceType.DATA_SOURCE_TF_MOCK_LH
    ].includes(dataSource)
  ) {
    baseFps = BASE_FPS_TF;
  }
  // if dealing with datasource from tensor flow estimation, determine the tensor flow model used for estimation
  if (source && dataSource === DataSourceType.DATA_SOURCE_TF) {
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

  // format seems to be fine
  const frameStamps = frames.map(frame => frame.frameStamp);

  return {
    dataSource,
    frames,
    frameStamps,
    tfModel,
    baseFps,
    isValid: true
  };
};

const generateBadFormatCheckResult = message => ({
  isValid: false,
  message: `Bad dataset format: ${message}.`
});

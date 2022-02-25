import {
  MimeType,
  SupportedInputFileFormat
} from '../../../../../config/constants';

export const getMimeTypeByFileName = (fileName = '') => {
  if (fileName.indexOf(SupportedInputFileFormat.JSON) > -1)
    return MimeType.JSON;
  if (fileName.indexOf(SupportedInputFileFormat.MP4) > -1) return MimeType.MP4;
  return '';
};

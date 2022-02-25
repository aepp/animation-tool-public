import React from 'react';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SupportedInputFileFormat} from '../../../../../config/constants';
import InputFile from '../../../../components/InputFile';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {setDataFile} from './actions';
import {selectIsFileUploading} from './reducers';

const ID = 'upload-file__button';

export const UploadButton = () => {
  const isLoading = useSelector(selectIsFileUploading);
  const isInitialized = useSelector(selectIsAnimationInitialized);

  const dispatch = useDispatch();

  return (
    <label htmlFor={ID}>
      <InputFile
        accept={Object.values(SupportedInputFileFormat).join(',')}
        id={ID}
        onChange={e => dispatch(setDataFile(e.target.files[0]))}
      />
      <Button
        variant={'outlined'}
        component='span'
        color={'inherit'}
        disabled={isLoading}>
        {isInitialized ? 'Replace' : 'Open'}&nbsp;dataSet
      </Button>
    </label>
  );
};

export default UploadButton;

import React from 'react';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {DataSetFileFormat} from '../../../../../config/constants';
import InputFile from '../../../../components/InputFile';
import {
  selectIsAnimationInitialized,
  selectIsAnimationLoading
} from '../Animation/reducers';
import {setDataSetFile} from './actions';

const ID = 'upload-file__button';

export const UploadButton = () => {
  const isLoading = useSelector(selectIsAnimationLoading);
  const isInitialized = useSelector(selectIsAnimationInitialized);

  const dispatch = useDispatch();

  return (
    <label htmlFor={ID}>
      <InputFile
        accept={Object.values(DataSetFileFormat).join(',')}
        id={ID}
        onChange={e => dispatch(setDataSetFile(e.target.files[0]))}
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

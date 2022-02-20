import React from 'react';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {DataSetFileFormat} from '../../../../../config/constants';
import InputFile from '../../../../components/InputFile';
import {setDataSetFile} from './actions';
import {selectDataSetFileUrl} from './reducers';

const ID = 'upload-file__button';

export const UploadButton = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);

  const dispatch = useDispatch();

  return (
    <label htmlFor={ID}>
      <InputFile
        accept={Object.values(DataSetFileFormat).join(',')}
        id={ID}
        onChange={e => dispatch(setDataSetFile(e.target.files[0]))}
      />
      <Button variant={'outlined'} component='span' color={'inherit'}>
        {dataSetFileUrl ? 'Replace' : 'Open'}&nbsp;dataSet
      </Button>
    </label>
  );
};

export default UploadButton;

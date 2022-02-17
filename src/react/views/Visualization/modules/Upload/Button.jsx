import React from 'react';
import {Button} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import InputFile from '../../../../components/InputFile';
import {SET_DATASET_FILE} from './actions';
import {selectDataSetFileUrl} from './reducers';

const ID = 'upload-file__button';

export const UploadButton = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);

  const dispatch = useDispatch();

  return (
    <label htmlFor={ID}>
      <InputFile
        accept='application/json'
        id={ID}
        onChange={e =>
          dispatch({type: SET_DATASET_FILE, payload: {file: e.target.files[0]}})
        }
      />
      <Button variant={'outlined'} component='span' color={'inherit'}>
        {dataSetFileUrl ? 'Replace' : 'Open'}&nbsp;dataSet
      </Button>
    </label>
  );
};

export default UploadButton;

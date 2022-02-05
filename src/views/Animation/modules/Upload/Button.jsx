import React from 'react';
import {Button, styled} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {SET_DATASET_FILE} from './actions';
import {selectDataSetFileUrl} from './reducers';

const ID = 'upload-file__button';

const Input = styled('input')({
  display: 'none'
});

export const UploadButton = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);

  const dispatch = useDispatch();

  return (
    <label htmlFor={ID}>
      <Input
        accept='application/json'
        id={ID}
        type='file'
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

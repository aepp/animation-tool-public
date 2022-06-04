import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {selectSelectedAnnotationParameter} from '../../reducers';
import {setAnnotationParameter} from '../../actions';
import {annotationParameters} from '../../constants';

export const StatsAppBar = () => {
  const dispatch = useDispatch();
  const annotationParameter = useSelector(selectSelectedAnnotationParameter);

  return (
    <React.Fragment>
      <FormControl sx={{ml: 'auto'}} size={'small'} color={'secondary'}>
        <InputLabel id='annotation-parameter-select-label'>
          Annotation parameter
        </InputLabel>
        <Select
          labelId='annotation-parameter-select-label'
          id='annotation-parameter-select'
          value={annotationParameter}
          label='Annotation parameter'
          onChange={e => dispatch(setAnnotationParameter(e.target.value))}>
          {Object.keys(annotationParameters).map(p => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
};

export default StatsAppBar;

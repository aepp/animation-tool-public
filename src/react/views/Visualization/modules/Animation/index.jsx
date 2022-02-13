import React, {useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@mui/material';
import {selectDataSetFileUrl} from '../Upload/reducers';
import {selectIsAnimationInitialized} from './reducers';
import {startAnimation} from './actions/animation';

export const Animation = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  useEffect(() => {
    if (ref.current && dataSetFileUrl) {
      dispatch(startAnimation({rootElement: ref.current}));
    }
  }, [dispatch, dataSetFileUrl]);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
      {!isInitialized && (
        <Typography sx={{position: 'absolute'}}>Upload dataset...</Typography>
      )}
    </Box>
  );
};

export default Animation;

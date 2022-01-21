import React, {useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@mui/material';
import {selectDataSetFileUrl} from '../Upload/reducers';
import {selectIsAnimationInitialized} from './reducers';
import {START_ANIMATION_INIT} from './actions';

export const Visualization = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  useEffect(() => {
    if (ref.current && dataSetFileUrl) {
      dispatch({
        type: START_ANIMATION_INIT,
        payload: {rootElement: ref.current}
      });
    }
  }, [dispatch, dataSetFileUrl]);

  return (
    <Box
      ref={ref}
      sx={{
        height: 'calc(100% - 64px)',
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& canvas': {height: 'calc(100% - 64px)'}
      }}>
      {!isInitialized && (
        <Typography sx={{position: 'absolute'}}>Upload dataset...</Typography>
      )}
    </Box>
  );
};

export default Visualization;

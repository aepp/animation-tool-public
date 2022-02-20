import React, {useRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@mui/material';
import {selectDataSetFileUrl} from '../Upload/reducers';
import AnimationControls from '../AnimationControls';
import {
  selectIsAnimationInitialized,
  selectIsAnimationLoading
} from './reducers';
import {startAnimation} from './actions/animation';
import {toggleInlineAnimationControlsVisibility} from '../AnimationControls/actions';

export const Animation = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const isLoading = useSelector(selectIsAnimationLoading);
  const [isDrag, setIsDrag] = useState(false);

  useEffect(() => {
    if (ref.current && dataSetFileUrl) {
      dispatch(startAnimation({rootElement: ref.current}));
    }
  }, [dispatch, dataSetFileUrl]);

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
      }}>
      <Box
        ref={ref}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}
        onMouseDown={() => setIsDrag(false)}
        onMouseMove={() => setIsDrag(true)}
        onMouseUp={() => {
          if (!isDrag) dispatch(toggleInlineAnimationControlsVisibility());
        }}>
        {!isInitialized && (
          <Typography sx={{position: 'absolute'}}>
            {!isLoading ? 'Upload dataset' : 'Processing dataset'}...
          </Typography>
        )}
      </Box>
      {/*{isInitialized && <AnimationControls />}*/}
      <AnimationControls />
    </Box>
  );
};

export default Animation;

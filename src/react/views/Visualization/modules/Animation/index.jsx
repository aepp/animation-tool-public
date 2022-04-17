import React, {useRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@mui/material';
import {selectDataFileUrl} from '../Upload/reducers';
import AnimationControls from '../AnimationControls';
import {
  toggleInlineAnimationControlsVisibility,
  togglePlay
} from '../AnimationControls/actions';
import {selectIsAnimationInitialized} from './reducers';
import {startAnimation} from './actions/animation';
import {selectIsSpaceTogglingRegistered} from '../../../../modules/App/reducers';
import {registerSpaceToggling} from '../../../../modules/App/actions';

export const Animation = () => {
  const dataFileUrl = useSelector(selectDataFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const isSpaceTogglingRegistered = useSelector(
    selectIsSpaceTogglingRegistered
  );
  const [isDrag, setIsDrag] = useState(false);

  useEffect(() => {
    if (ref.current && dataFileUrl) {
      dispatch(startAnimation({rootElement: ref.current}));
    }
  }, [dispatch, dataFileUrl]);

  useEffect(() => {
    if (!isSpaceTogglingRegistered && isInitialized) {
      window.addEventListener('keyup', e => {
        if (e.key === ' ' || e.code === 'Space') {
          dispatch(togglePlay());
        }
      });
      dispatch(registerSpaceToggling());
    }
  }, [isInitialized, isSpaceTogglingRegistered, dispatch]);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
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
            Processing dataset...
          </Typography>
        )}
      </Box>
      {isInitialized && <AnimationControls />}
    </Box>
  );
};

export default Animation;

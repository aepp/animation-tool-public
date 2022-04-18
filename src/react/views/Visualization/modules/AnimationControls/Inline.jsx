import React, {useRef} from 'react';
import {useSelector} from 'react-redux';
import {
  alpha,
  Box,
  Divider,
  Fade,
  FormHelperText,
  Paper,
  useTheme
} from '@mui/material';
import {
  selectIsAnimationInitialized,
  selectOriginalFps
} from '../Animation/reducers';
import {
  selectAreInlineAnimationControlsVisible,
  selectFpsMultiplier
} from './reducers';
import PaceControl from './components/PaceControl';
import Progress from './components/Progress';
import FramesCounter from './components/FramesCounter';

export const InlineAnimationControls = () => {
  const theme = useTheme();
  const ref = useRef();
  const visible = useSelector(selectAreInlineAnimationControlsVisible);
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const fpsMultiplier = useSelector(selectFpsMultiplier);
  const originalFps = useSelector(selectOriginalFps);

  return (
    <>
      <Fade in={isInitialized}>
        <FormHelperText sx={{position: 'absolute', left: 0, top: 0}}>
          Controls hint: click anywhere to toggle visibility.
        </FormHelperText>
      </Fade>
      <Fade in={visible}>
        <Box ref={ref}>
          <Paper
            elevation={1}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%'
            }}>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}>
              <PaceControl size={'small'} />
              <Divider orientation={'vertical'} sx={{ml: 1, mr: 2}} flexItem />
              <Progress sx={{width: '100%'}} />
              <Divider orientation={'vertical'} sx={{mx: 1}} flexItem />
              <FramesCounter sx={{textAlign: 'center'}} compact />
              <Divider orientation={'vertical'} sx={{mx: 1}} flexItem />
              <FormHelperText sx={{margin: 0, mr: 1, textAlign: 'center'}}>
                {Math.floor(originalFps * fpsMultiplier)} FPS
              </FormHelperText>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </>
  );
};

export default InlineAnimationControls;

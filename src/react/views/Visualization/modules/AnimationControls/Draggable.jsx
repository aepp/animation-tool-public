import React, {useRef} from 'react';
import {useSelector} from 'react-redux';
import Draggable from 'react-draggable';
import {alpha, Box, Fade, FormHelperText, Paper, useTheme} from '@mui/material';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {DraggablePlaybackControls} from './components/Playback/Draggable';
import {selectAreInlineAnimationControlsVisible} from './reducers';

export const DraggableAnimationControls = () => {
  const theme = useTheme();
  const ref = useRef();
  const visible = useSelector(selectAreInlineAnimationControlsVisible);
  const isInitialized = useSelector(selectIsAnimationInitialized);

  return (
    <>
      <Fade in={isInitialized}>
        <FormHelperText sx={{position: 'absolute', left: 0, top: 0}}>
          Controls hint: drag to relocate, click anywhere to toggle visibility.
        </FormHelperText>
      </Fade>
      <Draggable nodeRef={ref} bounds={'parent'} cancel={'.MuiSlider-thumb'}>
        <Fade in={visible}>
          <Box ref={ref}>
            <Paper
              elevation={2}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                px: 2,
                py: 1
              }}>
              <DraggablePlaybackControls />
            </Paper>
          </Box>
        </Fade>
      </Draggable>
    </>
  );
};

export default DraggableAnimationControls;

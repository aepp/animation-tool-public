import React, {useRef} from 'react';
import Draggable from 'react-draggable';
import {alpha, Box, Fade, Paper, useTheme} from '@mui/material';
import {PlaybackControlsInline} from './components/Playback/Inline';
import {useSelector} from 'react-redux';
import {selectAreInlineAnimationControlsVisible} from './reducers';

export const AnimationControls = () => {
  const theme = useTheme();
  const ref = useRef();
  const visible = useSelector(selectAreInlineAnimationControlsVisible);

  return (
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
            <PlaybackControlsInline />
          </Paper>
        </Box>
      </Fade>
    </Draggable>
  );
};

export default AnimationControls;

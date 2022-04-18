import React from 'react';
import {useSelector} from 'react-redux';
import {Box, FormHelperText, Stack} from '@mui/material';
import {selectOriginalFps} from '../../../Animation/reducers';
import {selectFpsMultiplier} from '../../reducers';
import Progress from '../Progress';
import PaceControl from '../PaceControl';
import FramesCounter from '../FramesCounter';

export const DraggablePlaybackControls = () => {
  const fpsMultiplier = useSelector(selectFpsMultiplier);
  const originalFps = useSelector(selectOriginalFps);

  return (
    <Stack direction={'column'} position={'relative'}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        mx={'auto'}
        width={'100%'}>
        <PaceControl sx={{mr: 'auto'}} />
        <FramesCounter />
      </Box>
      <Progress />
      <Box width={'100%'} position={'relative'} mt={0.5}>
        <Box position={'absolute'} bottom={0}>
          <FormHelperText sx={{margin: 0, width: '100%', textAlign: 'center'}}>
            {Math.floor(originalFps * fpsMultiplier)} FPS
          </FormHelperText>
        </Box>
      </Box>
    </Stack>
  );
};

export default DraggablePlaybackControls;

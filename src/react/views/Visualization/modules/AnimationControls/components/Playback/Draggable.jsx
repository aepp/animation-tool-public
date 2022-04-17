import React from 'react';
import {useSelector} from 'react-redux';
import {Box, FormHelperText, Stack} from '@mui/material';
import {selectBaseFps} from '../../../CoordinatesChart/reducers';
import Progress from '../Progress';
import PaceControl from '../PaceControl';
import FramesCounter from '../FramesCounter';
import {selectFpsMultiplier} from '../../reducers';

export const DraggablePlaybackControls = () => {
  const baseFps = useSelector(selectBaseFps);
  const fpsMultiplier = useSelector(selectFpsMultiplier);

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
            {baseFps * fpsMultiplier} FPS
          </FormHelperText>
        </Box>
      </Box>
    </Stack>
  );
};

export default DraggablePlaybackControls;

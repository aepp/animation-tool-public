import React from 'react';
import {Box, Stack} from '@mui/material';
import Progress from '../Progress';
import PaceControl from '../PaceControl';
import FramesCounter from '../FramesCounter';

export const PlaybackControlsInline = () => {
  return (
    <Stack direction={'column'}>
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
    </Stack>
  );
};

export default PlaybackControlsInline;

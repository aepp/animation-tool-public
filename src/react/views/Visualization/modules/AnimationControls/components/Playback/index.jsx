import React from 'react';
import {Box, Divider, Stack} from '@mui/material';
import Progress from '../Progress';
import PaceControl from '../PaceControl';
import {FramesCounter} from '../FramesCounter';

export const PlaybackControls = () => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      mx={'auto'}>
      <PaceControl />
      <Divider orientation={'vertical'} sx={{mr: 2}} flexItem />
      <Stack direction={'column'} alignItems={'flex-end'}>
        <FramesCounter />
        <Progress />
      </Stack>
    </Box>
  );
};

export default PlaybackControls;

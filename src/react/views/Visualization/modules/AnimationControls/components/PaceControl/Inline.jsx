import React from 'react';
import {Box, Divider, Stack} from '@mui/material';
import {PlayBackDirectionType} from '../../../../../../../config/constants';
import DirectionButton from '../DirectionButton';
import Progress from '../Progress';
import PlayButton from '../PlayButton';

export const PlaybackControls = ({direction}) => {
  return (
    <Stack direction={direction}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        mx={'auto'}>
        <DirectionButton playbackDirection={PlayBackDirectionType.REVERSE} />
        <PlayButton />
        <DirectionButton playbackDirection={PlayBackDirectionType.DEFAULT} />
      </Box>
      <Divider
        orientation={direction === 'column' ? 'horizontal' : 'vertical'}
        sx={{mr: 2}}
        flexItem
      />
      <Progress />
    </Stack>
  );
};

export default PlaybackControls;

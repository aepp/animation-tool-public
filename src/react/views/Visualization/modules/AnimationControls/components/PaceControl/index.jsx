import React from 'react';
import {Box} from '@mui/material';
import {PlayBackDirectionType} from '../../../../../../../config/constants';
import DirectionButton from '../DirectionButton';
import PlayButton from '../PlayButton';

export const PaceControl = ({sx = {}}) => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={sx}>
      <DirectionButton playbackDirection={PlayBackDirectionType.REVERSE} />
      <PlayButton />
      <DirectionButton playbackDirection={PlayBackDirectionType.DEFAULT} />
    </Box>
  );
};

export default PaceControl;

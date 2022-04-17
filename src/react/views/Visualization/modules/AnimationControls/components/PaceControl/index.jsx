import React from 'react';
import {Box} from '@mui/material';
import {PlayBackDirectionType} from '../../../../../../../config/constants';
import DirectionButton from '../DirectionButton';
import PlayButton from '../PlayButton';
import SkipFrameButton from '../SingleFrameDirectionButton';

export const PaceControl = ({sx = {}, size = 'medium'}) => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={sx}>
      <SkipFrameButton
        playbackDirection={PlayBackDirectionType.REVERSE}
        size={size}
      />
      <DirectionButton
        playbackDirection={PlayBackDirectionType.REVERSE}
        size={size}
      />
      <PlayButton size={size} />
      <DirectionButton
        playbackDirection={PlayBackDirectionType.DEFAULT}
        size={size}
      />
      <SkipFrameButton
        playbackDirection={PlayBackDirectionType.DEFAULT}
        size={size}
      />
    </Box>
  );
};

export default PaceControl;

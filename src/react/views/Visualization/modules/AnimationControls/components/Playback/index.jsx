import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton, Box} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import {PlayBackDirectionType} from '../../../../../../../config/constants';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';
import {togglePlay} from '../../actions';
import {selectIsPlaying} from '../../reducers';
import DirectionButton from '../DirectionButton';
import Progress from '../Progress';

export const PlaybackControls = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      mx={'auto'}>
      <DirectionButton playbackDirection={PlayBackDirectionType.REVERSE} />
      <IconButton
        onClick={() => dispatch(togglePlay())}
        disabled={!isInitialized}
        sx={{mx: 1}}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <DirectionButton playbackDirection={PlayBackDirectionType.DEFAULT} />
      {isInitialized && <Progress />}
    </Box>
  );
};

export default PlaybackControls;

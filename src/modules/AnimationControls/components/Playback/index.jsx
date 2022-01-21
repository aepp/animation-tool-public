import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton, Box, Typography} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import {selectCurrentFrameIdx, selectIsAnimationInitialized} from '../../../Animation/reducers';
import {TOGGLE_PLAY} from '../../actions';
import {selectIsPlaying} from '../../reducers';
import {
  PLAYBACK_DIRECTION_DEFAULT,
  PLAYBACK_DIRECTION_REVERSE
} from '../../../../constants';
import DirectionButton from '../DirectionButton';

export const PlaybackControls = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);

  return (
    <Box
      alignItems={'center'}
      justifyContent={'center'}
      sx={{marginLeft: 'auto', marginRight: 'auto'}}>
      <DirectionButton playbackDirection={PLAYBACK_DIRECTION_REVERSE} />
      <IconButton
        onClick={() => dispatch({type: TOGGLE_PLAY})}
        disabled={!isInitialized}
        sx={{mx: 1}}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <DirectionButton playbackDirection={PLAYBACK_DIRECTION_DEFAULT} />
      <Typography variant={'caption'}>{currentFrameIdx}</Typography>
    </Box>
  );
};

export default PlaybackControls;

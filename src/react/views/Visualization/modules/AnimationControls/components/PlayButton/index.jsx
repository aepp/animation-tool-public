import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';
import {togglePlay} from '../../actions';
import {selectIsPlaying} from '../../reducers';

export const PlayButton = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);

  return (
    <IconButton
      onClick={() => dispatch(togglePlay())}
      disabled={!isInitialized}
      sx={{mx: 1}}>
      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );
};

export default PlayButton;

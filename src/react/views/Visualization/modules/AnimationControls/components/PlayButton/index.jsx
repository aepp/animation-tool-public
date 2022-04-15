import React, {useEffect, useState} from 'react';
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
  const [spaceTogglingRegistered, registerSpaceToggling] = useState(false);

  useEffect(() => {
    if (!spaceTogglingRegistered) {
      window.addEventListener('keyup', e => {
        if (e.key === ' ' || e.code === 'Space') {
          dispatch(togglePlay());
        }
      });
      registerSpaceToggling(true);
    }
  }, [spaceTogglingRegistered, registerSpaceToggling, dispatch]);

  return (
    <IconButton
      onClick={() => dispatch(togglePlay())}
      disabled={!isInitialized}>
      {isPlaying ? (
        <PauseIcon fontSize={'large'} />
      ) : (
        <PlayArrowIcon fontSize={'large'} />
      )}
    </IconButton>
  );
};

export default PlayButton;

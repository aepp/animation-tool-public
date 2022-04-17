import React from 'react';
import * as PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton, Badge} from '@mui/material';
import {
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon
} from '@mui/icons-material';
import {
  DEFAULT_FPS_MULTIPLIER,
  PlayBackDirectionType
} from '../../../../../../../config/constants';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';
import {increaseFps} from '../../actions';
import {
  selectIsPlaying,
  selectPlaybackDirection,
  selectFpsMultiplier
} from '../../reducers';

export const DirectionButton = ({playbackDirection, size = 'medium'}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const currentPlaybackDirection = useSelector(selectPlaybackDirection);
  const fpsMultiplier = useSelector(selectFpsMultiplier);

  const button = (
    <IconButton
      size={size}
      onClick={() => dispatch(increaseFps(playbackDirection))}
      disabled={!isPlaying || !isInitialized}>
      {playbackDirection === PlayBackDirectionType.DEFAULT ? (
        <FastForwardIcon />
      ) : (
        <FastRewindIcon />
      )}
    </IconButton>
  );

  if (
    fpsMultiplier > DEFAULT_FPS_MULTIPLIER &&
    currentPlaybackDirection === playbackDirection
  ) {
    return (
      <Badge
        color={'secondary'}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal:
            playbackDirection === PlayBackDirectionType.DEFAULT
              ? 'right'
              : 'left'
        }}
        badgeContent={`x${fpsMultiplier}`}>
        {button}
      </Badge>
    );
  }
  return button;
};
DirectionButton.propTypes = {
  playbackDirection: PropTypes.oneOf(Object.keys(PlayBackDirectionType))
};
export default DirectionButton;

import React from 'react';
import * as PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton, Badge} from '@mui/material';
import {
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon
} from '@mui/icons-material';
import {
  PlayBackDirectionType,
  PLAYBACK_SPEEDS
} from '../../../../../../../config/constants';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';
import {changePlaybackSpeed} from '../../actions';
import {
  selectIsPlaying,
  selectPlaybackDirection,
  selectPlaybackSpeedMultiplierIdx
} from '../../reducers';

export const DirectionButton = ({playbackDirection}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const currentPlaybackDirection = useSelector(selectPlaybackDirection);
  const playbackSpeedMultiplierIdx = useSelector(
    selectPlaybackSpeedMultiplierIdx
  );

  const button = (
    <IconButton
      onClick={() => dispatch(changePlaybackSpeed(playbackDirection))}
      disabled={!isPlaying || !isInitialized}>
      {playbackDirection === PlayBackDirectionType.DEFAULT ? (
        <FastForwardIcon />
      ) : (
        <FastRewindIcon />
      )}
    </IconButton>
  );

  if (
    playbackSpeedMultiplierIdx !== null &&
    playbackSpeedMultiplierIdx >= 0 &&
    playbackSpeedMultiplierIdx < PLAYBACK_SPEEDS.length &&
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
        badgeContent={`x${PLAYBACK_SPEEDS[playbackSpeedMultiplierIdx]}`}>
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

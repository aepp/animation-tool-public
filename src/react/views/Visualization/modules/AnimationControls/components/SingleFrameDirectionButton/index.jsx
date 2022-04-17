import React from 'react';
import * as PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {IconButton} from '@mui/material';
import {
  SkipPrevious as PrevFrameIcon,
  SkipNext as NextFrameIcon
} from '@mui/icons-material';
import {PlayBackDirectionType} from '../../../../../../../config/constants';
import {
  selectCurrentFrameIdx,
  selectFramesCount,
  selectIsAnimationInitialized
} from '../../../Animation/reducers';
import {
  updateCurrentFrameIdx,
  updateCurrentFrameIdxToThree
} from '../../actions';
import {selectIsPlaying} from '../../reducers';

export const SkipFrameButton = ({playbackDirection, size = 'medium'}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);

  return (
    <IconButton
      size={size}
      onClick={() => {
        let nextFrameIdx;
        if (PlayBackDirectionType.DEFAULT === playbackDirection) {
          if (currentFrameIdx < framesCount) {
            nextFrameIdx = currentFrameIdx + 1;
          } else {
            nextFrameIdx = 0;
          }
        } else {
          if (currentFrameIdx === 0) {
            nextFrameIdx = framesCount - 1;
          } else {
            nextFrameIdx = currentFrameIdx - 1;
          }
        }
        dispatch(updateCurrentFrameIdx(nextFrameIdx));
        dispatch(updateCurrentFrameIdxToThree(nextFrameIdx));
      }}
      disabled={isPlaying || !isInitialized}>
      {playbackDirection === PlayBackDirectionType.DEFAULT ? (
        <NextFrameIcon />
      ) : (
        <PrevFrameIcon />
      )}
    </IconButton>
  );
};
SkipFrameButton.propTypes = {
  playbackDirection: PropTypes.oneOf(Object.keys(PlayBackDirectionType))
};
export default SkipFrameButton;

import React from 'react';
import {useSelector} from 'react-redux';
import {FormHelperText} from '@mui/material';
import {
  selectCurrentFrameIdx,
  selectFramesCount
} from '../../../Animation/reducers';

export const FramesCounter = ({sx = {}}) => {
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);

  return (
    <FormHelperText sx={sx}>
      Frame&nbsp;{currentFrameIdx}&nbsp;of&nbsp;{framesCount - 1}
    </FormHelperText>
  );
};

export default FramesCounter;

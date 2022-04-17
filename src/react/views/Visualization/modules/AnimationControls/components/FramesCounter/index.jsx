import React from 'react';
import {useSelector} from 'react-redux';
import {FormHelperText} from '@mui/material';
import {
  selectCurrentFrameIdx,
  selectFramesCount
} from '../../../Animation/reducers';

export const FramesCounter = ({sx = {}, compact = false}) => {
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);

  return (
    <FormHelperText sx={sx}>
      {!compact && `Frame ${currentFrameIdx} of ${framesCount}`}
      {compact && (
        <>
          <span style={{whiteSpace: 'nowrap'}}>
            {currentFrameIdx} / {framesCount}
          </span>
          <br />
          Frames
        </>
      )}
    </FormHelperText>
  );
};

export default FramesCounter;

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Divider, FormHelperText, Slider} from '@mui/material';
import {
  selectCurrentFrameIdx,
  selectFramesCount
} from '../../../Animation/reducers';
import {UPDATE_CURRENT_FRAME_IDX_TO_THREE} from '../../actions';

const valuetext = frameIdx => `Frame ${frameIdx}`;

export const Progress = () => {
  const dispatch = useDispatch();
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{mx: 2}}>
      <Divider orientation={'vertical'} sx={{mr: 2}} flexItem />
      <Box sx={{width: 300}} display={'flex'} flexDirection={'column'}>
        <FormHelperText sx={{ml: 'auto'}}>
          Frame&nbsp;{currentFrameIdx}&nbsp;of&nbsp;{framesCount - 1}
        </FormHelperText>
        <Slider
          color={'secondary'}
          aria-label='Animation progress'
          getAriaValueText={valuetext}
          valueLabelDisplay='auto'
          valueLabelFormat={valuetext}
          step={Math.floor(framesCount / 200)}
          min={0}
          max={framesCount - 1}
          value={currentFrameIdx}
          onChange={(_, frameIdx) =>
            dispatch({
              type: UPDATE_CURRENT_FRAME_IDX_TO_THREE,
              payload: {frameIdx}
            })
          }
        />
      </Box>
    </Box>
  );
};

export default Progress;

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Divider, FormHelperText, Slider, useTheme} from '@mui/material';
import {
  selectCurrentFrameIdx,
  selectFramesCount
} from '../../../Animation/reducers';
import {
  updateCurrentFrameIdx,
  updateCurrentFrameIdxToThree
} from '../../actions';

const valuetext = frameIdx => `Frame ${frameIdx}`;

export const Progress = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{mx: 2}}
    >
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
          onChange={(_, frameIdx) => {
            dispatch(updateCurrentFrameIdx(frameIdx));
            dispatch(updateCurrentFrameIdxToThree(frameIdx));
          }}
          sx={{
            color: 'secondary',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`
              },
              '&.Mui-active': {
                width: 20,
                height: 20
              }
            },
            '& .MuiSlider-rail': {
              opacity: 0.28
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Progress;

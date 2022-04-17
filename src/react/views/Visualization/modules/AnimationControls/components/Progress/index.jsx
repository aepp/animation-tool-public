import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Slider, useTheme} from '@mui/material';
import {
  selectCurrentFrameIdx,
  selectFramesCount
} from '../../../Animation/reducers';
import {
  updateCurrentFrameIdx,
  updateCurrentFrameIdxToThree
} from '../../actions';
import {selectFpsMultiplier} from '../../reducers';
import {useProgressTransition} from '../../hooks/useProgressTransition';

const valuetext = frameIdx => `Frame ${frameIdx}`;

export const Progress = ({sx = {}}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentFrameIdx = useSelector(selectCurrentFrameIdx);
  const framesCount = useSelector(selectFramesCount);
  const fpsMultiplier = useSelector(selectFpsMultiplier);
  const transition = useProgressTransition();

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{width: 300, ...sx}}>
      <Slider
        color={'secondary'}
        aria-label='Animation progress'
        getAriaValueText={valuetext}
        valueLabelDisplay='auto'
        valueLabelFormat={valuetext}
        step={Math.ceil(fpsMultiplier)}
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
          '& .MuiSlider-track': {
            transition
          },
          '& .MuiSlider-thumb': {
            backgroundColor: theme.palette.primary.light,
            width: 16,
            height: 16,
            transition,
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
  );
};

export default Progress;

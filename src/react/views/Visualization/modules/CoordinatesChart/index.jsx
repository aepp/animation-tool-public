import React from 'react';
import {useSelector} from 'react-redux';
import {Box, useTheme} from '@mui/material';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {CoordinatesPlot} from './components/CoordinatesPlot';

export const CoordinatesChart = () => {
  const theme = useTheme();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  if (!isInitialized) return '';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        '& .main-svg, & .svg-container, & .js-plotly-plot, & .plot-container, & #scene':
          {
            height: '100% !important',
            width: '100% !important'
          },
        '& #scene': {
          top: 0 + ' !important',
          left: 0 + ' !important'
        },
        '& .main-svg': {
          borderRadius: `${theme.shape.borderRadius}px`
        }
      }}>
      <CoordinatesPlot />
    </Box>
  );
};

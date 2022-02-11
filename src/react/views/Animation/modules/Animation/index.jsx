import React, {useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Paper, Typography, useTheme} from '@mui/material';
import {selectDataSetFileUrl} from '../Upload/reducers';
import {selectIsAnimationInitialized} from './reducers';
import {START_ANIMATION_INIT} from './actions';
import {BACKGROUND_COLOR} from '../../../../theme/constants';

export const Visualization = () => {
  const theme = useTheme();
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsAnimationInitialized);

  useEffect(() => {
    if (ref.current && dataSetFileUrl) {
      dispatch({
        type: START_ANIMATION_INIT,
        payload: {rootElement: ref.current}
      });
    }
  }, [dispatch, dataSetFileUrl]);

  return (
    <Box
      sx={{
        height: 'calc(100% - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.paper
      }}>
      <Paper
        elevation={isInitialized ? 3 : 0}
        square={false}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          backgroundColor: BACKGROUND_COLOR,
          padding: 1,
        }}>
        <Box
          ref={ref}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
          {!isInitialized && (
            <Typography sx={{position: 'absolute'}}>
              Upload dataset...
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Visualization;

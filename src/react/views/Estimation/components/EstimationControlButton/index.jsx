import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button, CircularProgress} from '@mui/material';
import {
  LocalFireDepartment as FireIcon,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import {beginWarmUpModel} from '../../actions/estimation';
import {
  selectHasDetectionStarted,
  selectHasDetectionFinished,
  selectIsDetecting,
  selectIsModelWarmedUp,
  selectIsModelWarmingUp
} from '../../reducers';
import {
  startEstimationVideo,
  stopEstimationVideo
} from '../../actions/estimationPlayback';

export const EstimationControlButton = () => {
  const dispatch = useDispatch();
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);
  const isModelWarmedUp = useSelector(selectIsModelWarmedUp);
  const isDetecting = useSelector(selectIsDetecting);
  const hasDetectionStarted = useSelector(selectHasDetectionStarted);
  const hasDetectionFinished = useSelector(selectHasDetectionFinished);

  let action = beginWarmUpModel,
    label = 'Warm up model',
    icon = <FireIcon color={'error'} />,
    disabled = false;
  if (isModelWarmingUp) {
    label = 'Warming up model...';
    icon = <CircularProgress color={'inherit'} size={16} />;
    disabled = true;
  } else if (isModelWarmedUp && !isDetecting && !hasDetectionFinished) {
    label = 'Start detection';
    if (hasDetectionStarted) {
      label = 'Resume detection';
    }
    action = startEstimationVideo;
    icon = <PlayArrow color={'inherit'} />;
  } else if (isDetecting) {
    label = 'Pause detection';
    action = stopEstimationVideo;
    icon = <Pause color={'inherit'} />;
  }

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      {!hasDetectionFinished && (
        <Button
          id={'video-button'}
          variant={'contained'}
          color={'primary'}
          onClick={() => dispatch(action())}
          startIcon={icon}
          disabled={disabled}>
          {label}
        </Button>
      )}
    </Box>
  );
};

export default EstimationControlButton;

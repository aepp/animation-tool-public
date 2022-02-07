import React from 'react';
import {Box, Button, CircularProgress} from '@mui/material';
import {
  LocalFireDepartment as FireIcon,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import '@tensorflow/tfjs-backend-webgl';
import {
  VIDEO_PLAYBACK_PAUSE,
  VIDEO_PLAYBACK_START,
  BEGIN_WARM_UP_MODEL
} from '../../actions';
import {
  selectDetectionStatus,
  selectIsModelWarmedUp,
  selectIsModelWarmingUp
} from '../../reducers';

export const VideoButton = ({videoElementPreview, videoElementOriginal}) => {
  const dispatch = useDispatch();
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);
  const isModelWarmedUp = useSelector(selectIsModelWarmedUp);
  const {hasDetectionStarted, hasDetectionFinished, isDetecting} = useSelector(
    selectDetectionStatus
  );

  let action = BEGIN_WARM_UP_MODEL,
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
    action = VIDEO_PLAYBACK_START;
    icon = <PlayArrow color={'inherit'} />;
  } else if (isDetecting) {
    label = 'Pause detection';
    action = VIDEO_PLAYBACK_PAUSE;
    icon = <Pause color={'inherit'} />;
  }

  return (
    <Box
      left={0}
      top={0}
      width={'100%'}
      height={'100%'}
      position={'absolute'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      zIndex={2}
    >
      {!hasDetectionFinished && (
        <Button
          id={'video-button'}
          variant={'contained'}
          color={'primary'}
          onClick={() =>
            dispatch({
              type: action,
              payload: {videoElementPreview, videoElementOriginal}
            })
          }
          startIcon={icon}
          disabled={disabled}
        >
          {label}
        </Button>
      )}
    </Box>
  );
};

export default VideoButton;

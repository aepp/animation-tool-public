import React from 'react';
import {Box, Button, LinearProgress, Typography} from '@mui/material';
import {FileDownload as FileDownloadIcon} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {downloadEstimationResult} from '../../actions/estimationResult';
import {
  selectEstimationVideoCurrentTime,
  selectEstimationVideoTotalTime,
  selectIsDetecting
} from '../../reducers';

export const DetectionProgress = () => {
  const dispatch = useDispatch();
  const isDetecting = useSelector(selectIsDetecting);
  const currentTime = useSelector(selectEstimationVideoCurrentTime);
  const totalTime = useSelector(selectEstimationVideoTotalTime);

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Typography>Detection progress</Typography>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box sx={{width: '100%', mr: 1}}>
            <LinearProgress
              color={'primary'}
              variant={'determinate'}
              value={(currentTime * 100) / totalTime}
            />
          </Box>
          <Box sx={{minWidth: 35}}>
            <Typography variant='body2' color='text.secondary'>{`${Math.round(
              (currentTime * 100) / totalTime
            )}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Button
        color={'secondary'}
        variant={'contained'}
        disabled={isDetecting}
        sx={{mt: 2}}
        onClick={() => dispatch(downloadEstimationResult())}
        startIcon={
          <FileDownloadIcon color={isDetecting ? 'disabled' : 'primary'} />
        }>
        {!isDetecting ? 'Download results' : 'Detecting poses...'}
      </Button>
    </>
  );
};

export default DetectionProgress;

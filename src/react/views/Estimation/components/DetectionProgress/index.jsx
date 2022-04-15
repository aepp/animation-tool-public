import React from 'react';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material';
import {FileDownload as FileDownloadIcon} from '@mui/icons-material';
import {useDispatch, useSelector} from 'react-redux';
import {DataSourceType} from '../../../../../config/constants';
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
      <Stack direction={'row'} width={'100%'} alignItems={'center'}>
        <Chip color={'info'} sx={{mr: 2}} label={4} />
        <Box sx={{width: '100%'}}>
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
                <Typography
                  variant='body2'
                  color='text.secondary'>{`${Math.round(
                  (currentTime * 100) / totalTime
                )}%`}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{display: 'flex', mt: 2, width: '100%'}}>
            {[
              DataSourceType.DATA_SOURCE_TF,
              DataSourceType.DATA_SOURCE_TF_MOCK_LH
            ].map(dataSource => (
              <Box
                key={dataSource}
                sx={{width: '50%', '&:first-of-type': {mr: 1}}}>
                <Button
                  color={'secondary'}
                  variant={'contained'}
                  disabled={isDetecting}
                  sx={{width: '100%'}}
                  onClick={() => dispatch(downloadEstimationResult(dataSource))}
                  startIcon={
                    <FileDownloadIcon
                      color={isDetecting ? 'disabled' : 'primary'}
                    />
                  }>
                  {!isDetecting
                    ? `Download ${dataSource} .json`
                    : 'Detecting poses...'}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default DetectionProgress;

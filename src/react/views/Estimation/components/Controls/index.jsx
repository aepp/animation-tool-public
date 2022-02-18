import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button} from '@mui/material';
import InputFile from '../../../../components/InputFile';
import {
  selectIsDetecting,
  selectIsEstimationVideoInitialized,
  selectEstimationVideoUrl,
  selectIsModelWarmingUp
} from '../../reducers';
import {updateEstimationVideoFile} from '../../actions/estimationPlayback';

const ID = 'upload-estimation-video__button';

export const EstimationControls = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsEstimationVideoInitialized);
  const estimationVideoUrl = useSelector(selectEstimationVideoUrl);
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);
  const isDetecting = useSelector(selectIsDetecting);

  return (
    <Box>
      {!isInitialized && (
        <label htmlFor={ID}>
          <InputFile
            accept='video/mp4'
            id={ID}
            onChange={e =>
              dispatch(updateEstimationVideoFile(e.target.files[0]))
            }
          />
          <Button
            variant={'outlined'}
            component='span'
            color={'inherit'}
            disabled={isModelWarmingUp || isDetecting}>
            {estimationVideoUrl ? 'Replace' : 'Open'}&nbsp;video for pose
            estimation
          </Button>
        </label>
      )}
    </Box>
  );
};

export default EstimationControls;

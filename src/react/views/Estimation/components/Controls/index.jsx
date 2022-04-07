import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SupportedModels} from '@tensorflow-models/pose-detection';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography
} from '@mui/material';
import {
  hasModelTypes,
  modelTypes,
  ScoreThreshHold
} from '../../../../../config/tensorFlow';
import InputFile from '../../../../components/InputFile';
import {
  selectIsDetecting,
  selectEstimationVideoUrl,
  selectIsModelWarmingUp,
  selectDetectionModel,
  selectIsModelWarmedUp,
  selectDetectionModelType,
  selectEstimationConfig,
  selectDetectionFps
} from '../../reducers';
import {updateEstimationVideoFile} from '../../actions/estimationPlayback';
import {
  setDetectionFps,
  setDetectionModel,
  setDetectionModelType,
  setEstimationConfig
} from '../../actions/estimation';

const ID = 'upload-estimation-video__button';

export const EstimationControls = () => {
  const dispatch = useDispatch();
  const isModelWarmedUp = useSelector(selectIsModelWarmedUp);
  const estimationVideoUrl = useSelector(selectEstimationVideoUrl);
  const isModelWarmingUp = useSelector(selectIsModelWarmingUp);
  const isDetecting = useSelector(selectIsDetecting);
  const selectedModel = useSelector(selectDetectionModel);
  const selectedModelType = useSelector(selectDetectionModelType);
  const estimationConfig = useSelector(selectEstimationConfig);
  const detectionFps = useSelector(selectDetectionFps);

  return (
    <Stack
      sx={{
        width: '100%',
        mb: 'auto',
        alignItems: 'center'
      }}>
      <label htmlFor={ID}>
        <InputFile
          accept='video/mp4'
          id={ID}
          onChange={e => dispatch(updateEstimationVideoFile(e.target.files[0]))}
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
      {estimationVideoUrl && (
        <>
          <Divider sx={{my: 4}} flexItem />
          <Typography sx={{mb: 2}} variant={'h6'}>
            Setup estimation model
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              '& > .MuiFormControl-root': {'&:not(:last-child)': {mr: 1}}
            }}>
            <FormControl
              color={'primary'}
              size={'small'}
              disabled={isModelWarmingUp || isModelWarmedUp}
              fullWidth>
              <InputLabel id='estimation-model-label' color={'secondary'}>
                Estimation model
              </InputLabel>
              <Select
                color={'secondary'}
                labelId='estimation-model-label'
                value={selectedModel}
                input={<OutlinedInput label='Estimation model' />}>
                {Object.keys(SupportedModels).map(model => {
                  return (
                    <MenuItem
                      key={model}
                      value={model}
                      onClick={() => {
                        dispatch(setDetectionModel(model));
                        dispatch(setDetectionModelType(modelTypes[model][0]));
                        const estimationConfig = {
                          maxPoses: 1,
                          scoreThreshold: ScoreThreshHold[model]
                        };
                        if (hasModelTypes(model)) {
                          estimationConfig.maxPoses = modelTypes[model][0]
                            .toLowerCase()
                            .includes('multi')
                            ? 2
                            : 1;
                        }
                        dispatch(setEstimationConfig(estimationConfig));
                      }}>
                      <ListItemText primary={model} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {hasModelTypes(selectedModel) && (
              <>
                <FormControl
                  color={'secondary'}
                  size={'small'}
                  disabled={isModelWarmingUp || isModelWarmedUp}
                  fullWidth>
                  <InputLabel
                    id='estimation-model-type-label'
                    color={'secondary'}>
                    Estimation model type
                  </InputLabel>
                  <Select
                    color={'secondary'}
                    labelId='estimation-model-type-label'
                    value={selectedModelType}
                    input={<OutlinedInput label='Estimation model type' />}>
                    {modelTypes[selectedModel].map(modelType => {
                      return (
                        <MenuItem
                          key={modelType}
                          value={modelType}
                          onClick={() => {
                            dispatch(setDetectionModelType(modelType));
                            dispatch(
                              setEstimationConfig({
                                maxPoses: modelType
                                  .toLowerCase()
                                  .includes('multi')
                                  ? 2
                                  : 1,
                                scoreThreshold: ScoreThreshHold[selectedModel]
                              })
                            );
                          }}>
                          <ListItemText primary={modelType} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {selectedModelType.toLowerCase().includes('multi') && (
                  <FormControl
                    color={'secondary'}
                    size={'small'}
                    disabled={isModelWarmingUp || isModelWarmedUp}
                    fullWidth>
                    <InputLabel id='multi-pose-count-label' color={'secondary'}>
                      Max. poses
                    </InputLabel>
                    <Select
                      color={'secondary'}
                      labelId='multi-pose-count-label'
                      value={estimationConfig.maxPoses}
                      input={<OutlinedInput label='Max. poses' />}>
                      {[1, 2, 3, 4, 5, 6].map(maxPoses => {
                        return (
                          <MenuItem
                            key={maxPoses}
                            value={maxPoses}
                            onClick={() => {
                              dispatch(
                                setEstimationConfig({
                                  ...estimationConfig,
                                  maxPoses
                                })
                              );
                            }}>
                            <ListItemText primary={maxPoses} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </>
            )}
            {/*<FormControl*/}
            {/*  color={'secondary'}*/}
            {/*  size={'small'}*/}
            {/*  disabled={isModelWarmingUp || isModelWarmedUp}*/}
            {/*  fullWidth>*/}
            {/*  <InputLabel id='detection-fps-label' color={'secondary'}>*/}
            {/*    FPS*/}
            {/*  </InputLabel>*/}
            {/*  <Select*/}
            {/*    color={'secondary'}*/}
            {/*    labelId='detection-fps-label'*/}
            {/*    value={detectionFps}*/}
            {/*    input={<OutlinedInput label='FPS' />}>*/}
            {/*    {[15, 24, 30, 60].map(fps => {*/}
            {/*      return (*/}
            {/*        <MenuItem*/}
            {/*          key={fps}*/}
            {/*          value={fps}*/}
            {/*          onClick={e => {*/}
            {/*            dispatch(setDetectionFps(fps));*/}
            {/*          }}>*/}
            {/*          <ListItemText primary={fps} />*/}
            {/*        </MenuItem>*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </Select>*/}
            {/*</FormControl>*/}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default EstimationControls;

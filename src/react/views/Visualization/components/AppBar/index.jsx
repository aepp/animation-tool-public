import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import {useSelector} from 'react-redux';
import {Box, Divider, FormControlLabel, FormGroup, Switch} from '@mui/material';
import UploadButton from '../../modules/Upload/Button';
// import PlaybackControls from '../../modules/AnimationControls/components/Playback';
import {selectIsAnimationInitialized} from '../../modules/Animation/reducers';
import {selectAreMiniControls} from '../../modules/AnimationControls/reducers';
import {toggleMiniControls} from '../../modules/AnimationControls/actions';

export const VisualizationAppbar = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const areMiniControls = useSelector(selectAreMiniControls);

  return (
    <>
      {/*{isInitialized && (*/}
      {/*  <Box*/}
      {/*    sx={{*/}
      {/*      position: 'absolute',*/}
      {/*      display: 'flex',*/}
      {/*      alignItems: 'center',*/}
      {/*      justifyContent: 'center',*/}
      {/*      width: '100%'*/}
      {/*    }}>*/}
      {/*    <PlaybackControls />*/}
      {/*  </Box>*/}
      {/*)}*/}
      <Box sx={{ml: 'auto', display: 'flex'}}>
        {isInitialized && (
          <Box sx={{display: 'flex'}}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color={'secondary'}
                    checked={areMiniControls}
                    onChange={() => dispatch(toggleMiniControls())}
                  />
                }
                label='Compact controls'
              />
            </FormGroup>
            <Divider sx={{mr: 2}} orientation={'vertical'} flexItem />
          </Box>
        )}
        <UploadButton />
      </Box>
    </>
  );
};

export default VisualizationAppbar;

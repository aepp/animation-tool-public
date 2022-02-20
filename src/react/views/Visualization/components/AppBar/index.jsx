import React from 'react';
// import {useSelector} from 'react-redux';
import {Box} from '@mui/material';
import UploadButton from '../../modules/Upload/Button';
// import PlaybackControls from '../../modules/AnimationControls/components/Playback';
// import {selectIsAnimationInitialized} from '../../modules/Animation/reducers';

export const VisualizationAppbar = () => {
  // const isInitialized = useSelector(selectIsAnimationInitialized);

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
      <Box sx={{ml: 'auto'}}>
        <UploadButton />
      </Box>
    </>
  );
};

export default VisualizationAppbar;

import React from 'react';
import {Box} from '@mui/material';
import UploadButton from '../Upload/Button';
import PlaybackControls from './components/Playback';

export const AnimationControls = () => {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
        <PlaybackControls />
      </Box>
      <Box sx={{ml: 'auto'}}>
        <UploadButton />
      </Box>
    </>
  );
};

export default AnimationControls;

import React from 'react';
import {useSelector} from 'react-redux';
import {Box} from '@mui/material';
import {selectDataFileUrl} from '../Upload/reducers';

export const Video = () => {
  const dataFileUrl = useSelector(selectDataFileUrl);

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end'
      }}>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
        <video style={{height: '100%'}} controls>
          <source src={dataFileUrl} type='video/mp4' />
        </video>
      </Box>
    </Box>
  );
};

export default Video;

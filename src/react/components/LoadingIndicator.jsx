import React from 'react';
import {Box, CircularProgress} from '@mui/material';

export const LoadingIndicator = () => (
  <Box
    sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
    <CircularProgress color={'primary'} />
  </Box>
);

export default LoadingIndicator;

import React from 'react';
import {Button, Grid} from '@mui/material';
import {LOCAL_STORAGE_THREE_INSTANCE} from '../../constants';

export const AnimationControls = () => {
  const personIndices = window[LOCAL_STORAGE_THREE_INSTANCE].personIndices;

  return (
    <Grid xs={12} item>
      <Button>Set color {personIndices.map(p => p)}</Button>
    </Grid>
  );
};

export default AnimationControls;

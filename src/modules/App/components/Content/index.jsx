import React from 'react';
import {Grid} from '@mui/material';
import {useSelector} from 'react-redux';
import AppControls from '../../../AppControls';
import AnimationControls from '../../../AnimationControls';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';

export const AppDrawer = () => {
  const isInitialized = useSelector(selectIsAnimationInitialized);
  return (
    <Grid md={9} item>
    </Grid>
  );
};

export default AppDrawer;

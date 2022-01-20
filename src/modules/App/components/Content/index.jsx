import React from 'react';
import {Grid} from '@mui/material';
import {useSelector} from 'react-redux';
import AppControls from '../../../AppControls';
import AnimationControls from '../../../AnimationControls';
import {selectIsVisualizationInitialized} from '../../../Visualization/reducers';

export const AppDrawer = () => {
  const isInitialized = useSelector(selectIsVisualizationInitialized);
  return (
    <Grid md={9} item>
    </Grid>
  );
};

export default AppDrawer;

import React from 'react';
import {Drawer} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsDrawerOpen} from '../../reducers';
import {setDrawerState} from '../../actions';

export const AppDrawer = () => {
  const dispatch = useDispatch();
  // const isInitialized = useSelector(selectIsAnimationInitialized);
  const isDrawerOpen = useSelector(selectIsDrawerOpen);
  return (
    <Drawer
      anchor={'left'}
      open={isDrawerOpen}
      onClose={() => dispatch(setDrawerState(false))}
    />
  );
};

export default AppDrawer;

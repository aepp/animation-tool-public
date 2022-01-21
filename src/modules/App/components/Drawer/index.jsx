import React from 'react';
import {Drawer} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import AnimationControls from '../../../AnimationControls';
import {selectIsAnimationInitialized} from '../../../Animation/reducers';
import {selectIsDrawerOpen} from '../../reducers';
import {SET_DRAWER_STATE} from '../../actions';

export const AppDrawer = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsAnimationInitialized);
  const isDrawerOpen = useSelector(selectIsDrawerOpen);
  return (
    <Drawer
      anchor={'left'}
      open={isDrawerOpen}
      onClose={() =>
        dispatch({type: SET_DRAWER_STATE, payload: {isDrawerOpen: false}})
      }
    >
      {isInitialized && <AnimationControls />}
    </Drawer>
  );
};

export default AppDrawer;

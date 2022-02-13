import React from 'react';
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import {selectIsAnimationInitialized} from '../../../../views/Visualization/modules/Animation/reducers';
import {setDrawerState} from '../../actions';
import {Route, Routes} from 'react-router-dom';
import AnimationControls from '../../../../views/Visualization/modules/AnimationControls';
import routes from '../../../../routes';

export const AppBar = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsAnimationInitialized);
  return (
    <>
      <MuiAppBar position={'fixed'}>
        <Toolbar>
          {isInitialized && (
            <IconButton
              color='inherit'
              aria-label='open animation controls'
              onClick={() => dispatch(setDrawerState(true))}
              edge='start'
              sx={{mr: 2, zIndex: 1}}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' noWrap component='div'>
            Animation tool
          </Typography>
          <Routes>
            <Route path={routes.root} element={<AnimationControls />} exact />
            <Route
              path={routes.recording}
              element={<AnimationControls />}
              exact
            />
          </Routes>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </>
  );
};

export default AppBar;

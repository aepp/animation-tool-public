import React from 'react';
import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import AppControls from '../../../AppControls';
import {selectIsVisualizationInitialized} from '../../../Visualization/reducers';
import {SET_DRAWER_STATE} from '../../actions';

export const AppBar = () => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsVisualizationInitialized);
  return (
    <MuiAppBar>
      <Toolbar>
        {isInitialized && (
          <IconButton
            color='inherit'
            aria-label='open animation controls'
            onClick={() =>
              dispatch({type: SET_DRAWER_STATE, payload: {isDrawerOpen: true}})
            }
            edge='start'
            sx={{mr: 2}}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant='h6' noWrap component='div'>
          Animation tool
        </Typography>
        <Box sx={{marginLeft: 'auto'}}>
          <AppControls />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;

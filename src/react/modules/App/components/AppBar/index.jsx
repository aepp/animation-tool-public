import React from 'react';
import {useDispatch} from 'react-redux';
import {NavLink, Route, Routes, useLocation, useMatch} from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  IconButton,
  Link,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StatsAppBar from '../../../../views/Stats/components/AppBar';
import VisualizationAppbar from '../../../../views/Visualization/components/AppBar';
import routes, {routeLabels} from '../../../../routes';
import EstimationAppBar from '../../../../views/Estimation/components/AppBar';
import {setDrawerState} from '../../actions';

export const AppBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const match = useMatch(location.pathname);
  const label = routeLabels[match.pathname];

  return (
    <>
      <MuiAppBar position={'fixed'}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open animation controls'
            onClick={() => dispatch(setDrawerState(true))}
            edge='start'
            sx={{mr: 2, zIndex: 1}}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div' sx={{zIndex: 1}}>
            <Link
              href={'#'}
              underline={'none'}
              component={NavLink}
              to={routes.root}
              color={'text.secondary'}>
              Animation tool
            </Link>
            {label ? ` / ${label}` : ''}
          </Typography>
          <Routes>
            <Route path={routes.root} element={<VisualizationAppbar />} exact />
            <Route
              path={routes.estimate}
              element={<EstimationAppBar />}
              exact
            />
            <Route path={routes.stats} element={<StatsAppBar />} exact />
          </Routes>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
    </>
  );
};

export default AppBar;

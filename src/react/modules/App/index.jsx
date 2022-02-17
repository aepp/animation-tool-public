import React from 'react';
import {useSelector} from 'react-redux';
import {Route, Routes} from 'react-router-dom';
import {Box} from '@mui/material';
import Visualization from '../../views/Visualization';
import routes from '../../routes';
import EstimationContent from '../../views/Estimation';
import AppDrawer from './components/Drawer';
import {AppBar} from './components/AppBar';
import {selectWithAppBar} from './reducers';

export const App = () => {
  const withAppBar = useSelector(selectWithAppBar);

  return (
    <Box sx={{height: '100%', width: '100%'}}>
      {withAppBar && <AppBar />}
      <AppDrawer />
      <Routes>
        <Route path={routes.root} element={<Visualization />} exact />
        <Route path={routes.estimate} element={<EstimationContent />} exact />
      </Routes>
    </Box>
  );
};

export default App;

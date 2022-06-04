import React from 'react';
import {useSelector} from 'react-redux';
import {Route, Routes} from 'react-router-dom';
import {Box} from '@mui/material';
import routes from '../../routes';
import Visualization from '../../views/Visualization';
import EstimationContent from '../../views/Estimation';
import Stats from '../../views/Stats';
import AppDrawer from './components/Drawer';
import {AppBar} from './components/AppBar';
import {selectIsStandalone} from './reducers';

export const App = () => {
  const isStandalone = useSelector(selectIsStandalone);

  return (
    <Box sx={{height: '100%', width: '100%'}}>
      {isStandalone && <AppBar />}
      <AppDrawer />
      <Routes>
        <Route path={routes.root} element={<Visualization />} exact />
        <Route path={routes.estimate} element={<EstimationContent />} exact />
        <Route path={routes.stats} element={<Stats />} exact />
      </Routes>
    </Box>
  );
};

export default App;

import React from 'react';
import {Box} from '@mui/material';
import Visualization from '../../views/Animation/modules/Animation';
import AppDrawer from './components/Drawer';
import {AppBar} from './components/AppBar';
import {Route, Routes} from 'react-router-dom';
import routes from '../../routes';
import RecordingContent from '../../views/Recording';

export const App = () => {
  return (
    <Box sx={{height: '100%', width: '100%'}}>
      <AppBar />
      <AppDrawer />
      <Routes>
        <Route path={routes.root} element={<Visualization />} exact />
        <Route path={routes.recording} element={<RecordingContent />} exact />
      </Routes>
    </Box>
  );
};

export default App;

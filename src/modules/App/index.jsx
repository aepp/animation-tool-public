import React from 'react';
import {Box, Grid} from '@mui/material';
import Visualization from '../Animation';
import AppDrawer from './components/Drawer';
import {AppBar} from './components/AppBar';

export const App = () => {
  return (
    <Box sx={{height: '100%', width: '100%'}}>
      <AppBar />
      <AppDrawer />
      <Visualization />
    </Box>
  );
};

export default App;

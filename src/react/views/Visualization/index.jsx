import React from 'react';
import {Box, Grid, Paper, useTheme} from '@mui/material';
import {BACKGROUND_COLOR} from '../../theme/constants';
import {DataSet} from './modules/DataSet';
import Animation from './modules/Animation';
import SkeletonTest from './modules/Animation/SkeletonTest';

export const Visualization = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 'calc(100% - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.paper
      }}>
      <Paper
        elevation={3}
        square={false}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          backgroundColor: BACKGROUND_COLOR
        }}>
        <Grid sx={{height: '100%'}} container>
          <Grid xs={12} md={6} sx={{maxHeight: '100%', padding: 1}} item>
            <DataSet />
          </Grid>
          <Grid
            xs={12}
            md={6}
            sx={{borderLeft: `solid 1px ${theme.palette.divider}`, padding: 1}}
            item>
            <Animation />
            {/*<SkeletonTest />*/}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Visualization;

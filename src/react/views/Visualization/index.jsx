import React from 'react';
import {Grid, useTheme} from '@mui/material';
// import {DataSet} from './modules/DataSet';
import Animation from './modules/Animation';
import DefaultTemplate from '../../template/Default';

export const Visualization = () => {
  const theme = useTheme();

  return (
    <DefaultTemplate>
      <Grid sx={{height: '100%'}} container>
        <Grid xs={12} md={6} sx={{padding: 1}} item>
          <Animation />
          {/*<SkeletonTest />*/}
        </Grid>
        <Grid
          xs={12}
          md={6}
          sx={{
            maxHeight: '100%',
            padding: 1,
            borderLeft: `solid 1px ${theme.palette.divider}`
          }}
          item>
          {/*<DataSet />*/}
        </Grid>
      </Grid>
    </DefaultTemplate>
  );
};

export default Visualization;

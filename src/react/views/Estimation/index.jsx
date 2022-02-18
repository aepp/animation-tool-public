import React, {useEffect} from 'react';
import {Grid, useTheme} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import DefaultTemplate from '../../template/Default';
import DetectionProgress from './components/DetectionProgress';
import EstimationVideo from './components/EstimationVideo';
import {selectHasDetectionStarted} from './reducers';
import EstimationControls from './components/Controls';
import {cleanupEstimationView} from './actions/view';

export const EstimationContent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const hasDetectionStarted = useSelector(selectHasDetectionStarted);

  useEffect(() => {
    return () => dispatch(cleanupEstimationView());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultTemplate>
      <Grid sx={{height: '100%'}} container>
        <Grid xs={12} md={6} sx={{maxHeight: '100%'}} item>
          <EstimationVideo />
        </Grid>
        <Grid
          xs={12}
          md={6}
          sx={{
            height: '100%',
            maxHeight: '100%',
            padding: 2,
            borderLeft: `solid 1px ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
          item>
          <EstimationControls />
          {hasDetectionStarted && <DetectionProgress />}
        </Grid>
      </Grid>
    </DefaultTemplate>
  );
};

export default EstimationContent;

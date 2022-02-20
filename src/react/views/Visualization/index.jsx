import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, useTheme} from '@mui/material';
// import {DataSet} from './modules/DataSet';
import Animation from './modules/Animation';
import DefaultTemplate from '../../template/Default';
import {selectIsStandalone} from '../../modules/App/reducers';
import {cleanUpAnimationView} from './actions/view';

export const Visualization = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isStandalone = useSelector(selectIsStandalone);

  useEffect(() => {
    return () => dispatch(cleanUpAnimationView());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultTemplate>
      <Grid sx={{height: '100%'}} container>
        <Grid xs={12} md={isStandalone ? 6 : 12} sx={{padding: 1}} item>
          <Animation />
        </Grid>
        {isStandalone && (
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
        )}
      </Grid>
    </DefaultTemplate>
  );
};

export default Visualization;

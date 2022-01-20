import React, {useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Typography} from '@mui/material';
import {startVisualization} from '../../three';
import {selectDataSetFileUrl} from '../Upload/reducers';
import {FINISH_VISUALIZATION_INIT, SET_THREE_INSTANCE} from './actions';
import {selectIsVisualizationInitialized} from './reducers';
import {LOCAL_STORAGE_THREE_INSTANCE} from '../../constants';

export const Visualization = () => {
  const dataSetFileUrl = useSelector(selectDataSetFileUrl);
  const dispatch = useDispatch();
  const ref = useRef();
  const isInitialized = useSelector(selectIsVisualizationInitialized);

  useEffect(() => {
    if (ref.current && dataSetFileUrl) {
      startVisualization({
        rootElement: ref.current,
        dataSetFileUrl,
        threeInstance: window[LOCAL_STORAGE_THREE_INSTANCE]
      }).then(threeInstance => {
        dispatch({type: SET_THREE_INSTANCE, payload: {threeInstance}});
        return dispatch({type: FINISH_VISUALIZATION_INIT});
      });
    }
  }, [dispatch, dataSetFileUrl]);

  return (
    <Box
      ref={ref}
      sx={{
        height: 'calc(100% - 64px)',
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& canvas': {height: 'calc(100% - 64px)'}
      }}>
      {!isInitialized && <Typography>Upload dataset...</Typography>}
    </Box>
  );
};

export default Visualization;

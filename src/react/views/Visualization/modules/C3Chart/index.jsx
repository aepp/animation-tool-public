import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import C3Chart from 'react-c3js';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import {selectC3ChartArgs, selectIsC3ChartInitialized} from './reducers';
import {initC3Chart} from './actions/c3';

export const JointsCoordinateChart = () => {
  const isInitialized = useSelector(selectIsC3ChartInitialized);
  let c3Args = useSelector(selectC3ChartArgs);
  console.log('c3Args', c3Args);
  console.log('isInitialized', isInitialized);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isInitialized) dispatch(initC3Chart());
  }, [isInitialized, dispatch]);

  if (!isInitialized) return <LoadingIndicator />;
  // throw new Error();
  let {data, ...rest} = c3Args;
  return <C3Chart data={data} {...rest} />;
};

export default JointsCoordinateChart;

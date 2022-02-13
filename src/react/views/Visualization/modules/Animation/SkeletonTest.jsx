import React, {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {Box} from '@mui/material';
import {skeletonTest} from './actions/animation';

export const SkeletonTest = () => {
  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (ref.current) {
      dispatch(skeletonTest({rootElement: ref.current}));
    }
  }, [dispatch]);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}/>
  );
};

export default SkeletonTest;

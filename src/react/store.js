import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import appReducer, {reducerKey as appReducerKey} from './modules/App/reducers';
import visualizationReducer, {
  reducerKey as visualizationReducerKey
} from './views/Visualization/modules/Animation/reducers';
import dataSetReducer, {
  reducerKey as dataSetReducerKey
} from './views/Visualization/modules/DataSet/reducers';
import uploadReducer, {
  reducerKey as uploadReducerKey
} from './views/Visualization/modules/Upload/reducers';
import animationControlsReducer, {
  reducerKey as animationControlsReducerKey
} from './views/Visualization/modules/AnimationControls/reducers';
import recordingReducer, {
  reducerKey as recordingReducerKey
} from './views/Estimation/reducers';

export const initSagas = () => createSagaMiddleware();

export const initStore = sagaMiddleware =>
  configureStore({
    reducer: {
      [appReducerKey]: appReducer,
      [visualizationReducerKey]: visualizationReducer,
      [uploadReducerKey]: uploadReducer,
      [animationControlsReducerKey]: animationControlsReducer,
      [recordingReducerKey]: recordingReducer,
      [dataSetReducerKey]: dataSetReducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(sagaMiddleware)
  });

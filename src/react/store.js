import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import appReducer, {reducerKey as appReducerKey} from './modules/App/reducers';
import animationReducer, {
  reducerKey as animationReducerKey
} from './views/Visualization/modules/Animation/reducers';
import coordinatesChartReducer, {
  reducerKey as coordinatesChartKey
} from './views/Visualization/modules/CoordinatesChart/reducers';
import coordinatesChartControlsReducer, {
  reducerKey as coordinatesChartControlsReducerKey
} from './views/Visualization/modules/CoordinatesChartControls/reducers';
import uploadReducer, {
  reducerKey as uploadReducerKey
} from './views/Visualization/modules/Upload/reducers';
import animationControlsReducer, {
  reducerKey as animationControlsReducerKey
} from './views/Visualization/modules/AnimationControls/reducers';
import estimationViewReducer, {
  reducerKey as estimationViewReducerKey
} from './views/Estimation/reducers';
import visualizationViewReducer, {
  reducerKey as visualizationViewReducerKey
} from './views/Visualization/reducers';

export const initSagas = () => createSagaMiddleware();

export const initStore = sagaMiddleware =>
  configureStore({
    reducer: {
      // app
      [appReducerKey]: appReducer,
      // visualization view
      [visualizationViewReducerKey]: visualizationViewReducer,
      [animationReducerKey]: animationReducer,
      [uploadReducerKey]: uploadReducer,
      [animationControlsReducerKey]: animationControlsReducer,
      [coordinatesChartKey]: coordinatesChartReducer,
      [coordinatesChartControlsReducerKey]: coordinatesChartControlsReducer,
      // estimation view
      [estimationViewReducerKey]: estimationViewReducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(sagaMiddleware)
  });

import {configureStore} from '@reduxjs/toolkit';
import appReducer, {reducerKey as appReducerKey} from './modules/App/reducers';
import visualizationReducer, {
  reducerKey as visualizationReducerKey
} from './modules/Visualization/reducers';
import uploadReducer, {
  reducerKey as uploadReducerKey
} from './modules/Upload/reducers';
import createSagaMiddleware from 'redux-saga';

export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [appReducerKey]: appReducer,
    [visualizationReducerKey]: visualizationReducer,
    [uploadReducerKey]: uploadReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(sagaMiddleware)
});

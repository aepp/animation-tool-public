import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import appReducer, {reducerKey as appReducerKey} from './modules/App/reducers';
import visualizationReducer, {
  reducerKey as visualizationReducerKey
} from './views/Animation/modules/Animation/reducers';
import uploadReducer, {
  reducerKey as uploadReducerKey
} from './views/Animation/modules/Upload/reducers';
import animationControlsReducer, {
  reducerKey as animationControlsReducerKey
} from './views/Animation/modules/AnimationControls/reducers';
import recordingReducer, {
  reducerKey as recordingReducerKey
} from './views/Recording/reducers';

export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    [appReducerKey]: appReducer,
    [visualizationReducerKey]: visualizationReducer,
    [uploadReducerKey]: uploadReducer,
    [animationControlsReducerKey]: animationControlsReducer,
    [recordingReducerKey]: recordingReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(sagaMiddleware)
});

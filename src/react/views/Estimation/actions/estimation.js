import {createAction} from '@reduxjs/toolkit';

export const beginWarmUpModel = createAction('beginWarmUpModel');
export const finishWarmUpModel = createAction('finishWarmUpModel');
export const setHasEstimationStarted = createAction('setHasEstimationStarted');
export const setEstimationStatus = createAction('setEstimationStatus');
export const startEstimation = createAction('startEstimation');
export const pauseEstimation = createAction('pauseEstimation');
export const endEstimation = createAction('endEstimation');
export const addEstimationFrame = createAction('addEstimationFrame');
export const addEstimationFrameStamp = createAction('addEstimationFrameStamp');
export const setDetectionModel = createAction('setDetectionModel');
export const setDetectionModelType = createAction('setDetectionModelType');
export const setEstimationConfig = createAction('setEstimationConfig');
export const setDetectionFps = createAction('setDetectionFps');

export const resetEstimation = createAction('resetEstimation');

import {createAction} from '@reduxjs/toolkit';

export const beginWarmUpModel = createAction('beginWarmUpModel');
export const finishWarmUpModel = createAction('finishWarmUpModel');
export const setHasEstimationStarted = createAction('setHasEstimationStarted');
export const setEstimationStatus = createAction('setEstimationStatus');
export const startEstimation = createAction('startEstimation');
export const pauseEstimation = createAction('pauseEstimation');
export const endEstimation = createAction('endEstimation');
export const addEstimatedPose = createAction('addEstimatedPose');

export const resetEstimation = createAction('resetEstimation');

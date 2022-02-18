import {createAction} from '@reduxjs/toolkit';

export const beginWarmUpModel = createAction('beginWarmUpModel');
export const finishWarmUpModel = createAction('finishWarmUpModel');
export const setHasDetectionStarted = createAction('setHasDetectionStarted');
export const setDetectionStatus = createAction('setDetectionStatus');
export const startDetection = createAction('startDetection');
export const pauseDetection = createAction('pauseDetection');
export const endDetection = createAction('endDetection');
export const addDetectedPose = createAction('addDetectedPose');

export const resetEstimation = createAction('resetEstimation');

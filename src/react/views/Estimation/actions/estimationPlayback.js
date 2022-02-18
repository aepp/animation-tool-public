import {createAction} from '@reduxjs/toolkit';

export const setIsEstimationVideoInitialized = createAction(
  'setIsEstimationVideoInitialized'
);
export const updateEstimationVideoFile = createAction(
  'updateEstimationVideoFile'
);
export const setEstimationVideoUrl = createAction('setEstimationVideoUrl');
export const setIsEstimationVideoPlaying = createAction(
  'setIsEstimationVideoPlaying'
);
export const updateEstimationVideoTotalTime = createAction(
  'updateEstimationVideoTotalTime'
);
export const updateEstimationVideoCurrentTime = createAction(
  'updateEstimationVideoCurrentTime'
);
export const startEstimationVideo = createAction('startEstimationVideo');
export const stopEstimationVideo = createAction('stopEstimationVideo');
export const endEstimationVideo = createAction('endEstimationVideo');
export const setEstimationVideoPreviewDimensions = createAction(
  'setEstimationVideoPreviewDimensions'
);
export const setEstimationVideoOriginalDimensions = createAction(
  'setEstimationVideoOriginalDimensions'
);

export const resetEstimationPlayback = createAction('resetEstimationPlayback');

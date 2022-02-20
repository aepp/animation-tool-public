import {createAction} from '@reduxjs/toolkit';

export const togglePlay = createAction('togglePlay');
export const setIsPlaying = createAction('setIsPlaying');
export const changePlaybackSpeed = createAction('changePlaybackSpeed');
export const setPlaybackSpeed = createAction('setPlaybackSpeed');
export const setPlaybackSpeedAndDirection = createAction(
  'setPlaybackSpeedAndDirection'
);
export const resetPlaybackSpeedAndDirection = createAction(
  'resetPlaybackSpeedAndDirection'
);
export const updateCurrentFrameIdx = createAction('updateCurrentFrameIdx');
export const updateCurrentFrameIdxToThree = createAction(
  'updateCurrentFrameIdxToThree'
);

export const toggleInlineAnimationControlsVisibility = createAction(
  'toggleInlineAnimationControlsVisibility'
);
export const resetAnimationControls = createAction('resetAnimationControls');

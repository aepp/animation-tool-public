import {createAction} from '@reduxjs/toolkit';

export const togglePlay = createAction('togglePlay');
export const setIsPlaying = createAction('setIsPlaying');
export const increaseFps = createAction('increaseFps');
export const setFpsMultiplier = createAction('setFpsMultiplier');
export const setFpsMultiplierAndDirection = createAction(
  'setFpsMultiplierAndDirection'
);
export const resetFpsMultiplierAndDirection = createAction(
  'resetFpsMultiplierAndDirection'
);
export const updateCurrentFrameIdx = createAction('updateCurrentFrameIdx');
export const updateCurrentFrameIdxToThree = createAction(
  'updateCurrentFrameIdxToThree'
);

export const toggleInlineAnimationControlsVisibility = createAction(
  'toggleInlineAnimationControlsVisibility'
);
export const toggleMiniControls = createAction('toggleMiniControls');
export const resetAnimationControls = createAction('resetAnimationControls');

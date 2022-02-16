import {createAction} from '@reduxjs/toolkit';

export const TOGGLE_PLAY = 'TOGGLE_PLAY';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const CHANGE_PLAYBACK_SPEED = 'CHANGE_PLAYBACK_SPEED';
export const SET_PLAYBACK_SPEED_AND_DIRECTION =
  'SET_PLAYBACK_SPEED_AND_DIRECTION';
export const SET_PLAYBACK_SPEED = 'SET_PLAYBACK_SPEED';
export const RESET_PLAYBACK_SPEED_AND_DIRECTION =
  'RESET_PLAYBACK_SPEED_AND_DIRECTION';

export const resetAnimationControls = createAction('resetAnimationControls');
export const updateCurrentFrameIdx = createAction('updateCurrentFrameIdx');
export const updateCurrentFrameIdxToThree = createAction(
  'updateCurrentFrameIdxToThree'
);

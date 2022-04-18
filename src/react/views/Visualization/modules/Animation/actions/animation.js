import {createAction} from '@reduxjs/toolkit';

export const beginAnimationInit = createAction('beginAnimationInit');
export const finishAnimationInit = createAction('finishAnimationInit');
export const cancelAnimationInit = createAction('cancelAnimationInit');
export const startAnimation = createAction('startAnimation');
export const updateFramesCount = createAction('updateFramesCount');
export const setOriginalFps = createAction('setOriginalFps');

export const resetAnimation = createAction('resetAnimation');

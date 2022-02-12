import {createAction} from '@reduxjs/toolkit';

export const START_ANIMATION_INIT = 'START_ANIMATION_INIT';
export const FINISH_ANIMATION_INIT = 'FINISH_ANIMATION_INIT';

export const startAnimation = createAction(START_ANIMATION_INIT);

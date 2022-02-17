import {createAction} from '@reduxjs/toolkit';

export const openUiChannel = createAction('openUiChannel');
export const closeUiChannel = createAction('closeUiChannel');
export const updateCurrentFrameIndexFromThree = createAction(
  'updateCurrentFrameIndexFromThree'
);

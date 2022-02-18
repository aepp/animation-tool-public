import {createAction} from '@reduxjs/toolkit';

export const setAppConfig = createAction('setAppConfig');
export const setDrawerState = createAction('setDrawerState');

export const showInfoMessage = createAction('showInfoMessage');
export const showWarnMessage = createAction('showWarnMessage');
export const showErrorMessage = createAction('showErrorMessage');

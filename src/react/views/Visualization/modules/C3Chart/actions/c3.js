import {createAction} from '@reduxjs/toolkit';

export const initC3Chart = createAction('initC3Chart');
export const finishC3ChartInit = createAction('finishC3ChartInit');
export const setC3ChartArgs = createAction('setC3ChartArgs');
export const setC3AttributeDictionary = createAction('setC3AttributeDictionary');
export const resetC3Chart = createAction('resetC3Chart');

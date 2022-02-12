import {createAction} from '@reduxjs/toolkit';

const SET_DATA_SET = 'SET_DATA_SET';
const PLOT_DATA_SET = 'PLOT_DATA_SET';

export const setDataSet = createAction(SET_DATA_SET);
export const plotDataSet = createAction(PLOT_DATA_SET);

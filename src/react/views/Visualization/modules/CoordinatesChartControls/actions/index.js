import {createAction} from '@reduxjs/toolkit';

export const selectJoint = createAction('selectJoint');
export const deselectJoint = createAction('deselectJoint');

export const resetCoordinatesChartControls = createAction(
  'resetCoordinatesChartControls'
);

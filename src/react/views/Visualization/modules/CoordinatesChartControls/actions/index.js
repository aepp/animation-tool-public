import {createAction} from '@reduxjs/toolkit';

export const selectJoint = createAction('selectJoint');
export const deselectJoint = createAction('deselectJoint');
export const deselectAllJoints = createAction('deselectAllJoints');

export const resetCoordinatesChartControls = createAction(
  'resetCoordinatesChartControls'
);

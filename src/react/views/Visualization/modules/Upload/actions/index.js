import {createAction} from '@reduxjs/toolkit';

export const beginUpload = createAction('beginUpload');
export const finishUpload = createAction('finishUpload');
export const setDataFile = createAction('setDataFile');
export const setDataFileUrl = createAction('setDataFileUrl');
export const setInputFileType = createAction('setInputFileType');
export const setDataFileType = createAction('setDataFileType');

export const resetUpload = createAction('resetUpload');

import {createSelector, createReducer} from '@reduxjs/toolkit';
import {resetDataSet, setDataSet} from '../actions';
import {frameStampToMilliseconds, millisecondsToTime} from '../../../util/time';
import {DEFAULT_PLAYBACK_FPS} from '../../../../../../config/constants';

export const reducerKey = 'coordinatesChart';

/**
 * @typedef CoordinatesChartPartialState
 * @property {object} original
 * @property {string[]} jointNames
 * @property {string[]} frameStamps
 * @property {object} frameIdsByStamps
 * @property {string[]} frameStampsFormatted
 * @property {object} frameIdsByFormattedStamps
 * @property {boolean} isUsingFrameStamps
 * @property {number} firstNoneEmptyFrameIdx
 */
/**
 * @typedef {PreProcessedDataSet | CoordinatesChartPartialState} CoordinatesChartState
 */
const defaultState = {
  dataSource: undefined,
  framesPerPerson: [],
  personIndices: [],
  extremes: {},
  normalization: {},
  original: undefined,
  jointNames: [],
  frameStamps: [],
  frameIdsByStamps: {},
  frameStampsFormatted: [],
  frameIdsByFormattedStamps: {},
  isUsingFrameStamps: false,
  firstNoneEmptyFrameIdx: 0
};
const r = createReducer(defaultState, {
  [setDataSet]: (state, action) => {
    state.isUsingFrameStamps =
      action.payload.frameStamps.length ===
      action.payload.framesPerPerson.length;
    state.framesPerPerson = action.payload.framesPerPerson;
    state.personIndices = action.payload.personIndices;
    state.extremes = action.payload.extremes;
    state.normalization = action.payload.normalization;
    state.dataSource = action.payload.dataSource;
    state.original = action.payload.original;
    state.jointNames = action.payload.jointNames;
    state.frameStamps = action.payload.frameStamps.map(frameStamp =>
      frameStampToMilliseconds(frameStamp)
    );
    state.frameStampsFormatted = state.frameStamps.map(frameStamp => {
      const ms = millisecondsToTime(frameStamp);
      return ms.substring(3, ms.length - 1);
    });
    state.frameIdsByStamps = state.frameStamps.reduce(
      (idsByStamps, frameStamp, frameIdx) => {
        idsByStamps[frameStamp] = frameIdx;
        return idsByStamps;
      },
      {}
    );
    state.frameIdsByFormattedStamps = state.frameStampsFormatted.reduce(
      (idsByStamps, frameStamp, frameIdx) => {
        idsByStamps[frameStamp] = frameIdx;
        return idsByStamps;
      },
      {}
    );
    state.firstNoneEmptyFrameIdx = action.payload.framesPerPerson.reduce(
      (id, frame, i) => {
        if (frame.length > 0 && id === 0) return i;
        return id;
      },
      0
    );
  },
  [resetDataSet]: () => ({...defaultState})
});

export default r;

/**
 * @param state
 * @return CoordinatesChartState
 */
const selectSelf = state => state[reducerKey];
export const selectDataSet = createSelector(selectSelf, state => state);
export const selectOriginalDataSet = createSelector(
  selectSelf,
  state => state.original
);
export const selectFramesPerPerson = createSelector(
  selectSelf,
  state => state.framesPerPerson
);
export const selectJointNames = createSelector(
  selectSelf,
  state => state.jointNames
);
export const selectFrameStamps = createSelector(
  selectSelf,
  state => state.frameStamps
);
export const selectFrameIdsByStamps = createSelector(
  selectSelf,
  state => state.frameIdsByStamps
);
export const selectFrameStampsFormatted = createSelector(
  selectSelf,
  state => state.frameStampsFormatted
);
export const selectIsUsingFrameStamps = createSelector(
  selectSelf,
  state => state.isUsingFrameStamps
);
export const selectFrameIdsByFormattedStamps = createSelector(
  selectSelf,
  state => state.frameIdsByFormattedStamps
);
export const selectFirstNoneEmptyFrameIdx = createSelector(
  selectSelf,
  state => state.firstNoneEmptyFrameIdx
);
export const selectPersonIndices = createSelector(
  selectSelf,
  state => state.personIndices
);

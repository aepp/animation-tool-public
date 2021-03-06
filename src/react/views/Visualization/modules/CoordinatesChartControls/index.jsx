import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {
  selectJointNames,
  selectPersonIndices
} from '../CoordinatesChart/reducers';
import {selectSelectedJoints} from './reducers';
import {deselectAllJoints, deselectJoint, selectJoint} from './actions';

const vectorComponents = ['x', 'y', 'z'];
const separator = '---';

/**
 *
 * @param {string} string
 * @returns {string}
 */
const upperCaseFirst = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const CoordinatesChartControls = () => {
  /**
   * @type {Dispatch<any>}
   */
  const dispatch = useDispatch();

  /**
   * @type {boolean}
   */
  const isInitialized = useSelector(selectIsAnimationInitialized);

  /**
   * @type {string[]}
   */
  const jointNames = useSelector(selectJointNames);
  /**
   * @type {number[]}
   */
  const personIndices = useSelector(selectPersonIndices);
  /**
   * @type {Array.<object[]>}
   */
  const selectedJoints = useSelector(selectSelectedJoints);

  if (!isInitialized) return '';
  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Typography sx={{fontWeight: 'bold', width: '100%', textAlign: 'center'}}>
        Plot joints' coordinates
      </Typography>
      <Divider sx={{my: 1}} flexItem />
      <Box sx={{mb: 1, display: 'flex', flexWrap: 'wrap'}}>
        {personIndices.map(personIdx => {
          const label = `Person ${personIdx}`;
          const labelId = `select-joints-checkbox-label-${personIdx}`;
          /**
           * @type {string[]}
           */
          const selectedJointsTransformed = (
            selectedJoints[personIdx] || []
          ).map(j => {
            return j.name + separator + j.component;
          });
          return (
            <Box sx={{width: 'calc(100% / 6)', p: 0.5}} key={personIdx}>
              <FormControl color={'secondary'} sx={{width: '100%'}}>
                <InputLabel id={labelId} color={'secondary'}>
                  {label}
                </InputLabel>
                <Select
                  color={'secondary'}
                  labelId={labelId}
                  value={selectedJointsTransformed}
                  input={<OutlinedInput label={label} />}
                  renderValue={selected =>
                    selected
                      .map(t =>
                        t
                          .split(separator)
                          .map(p => upperCaseFirst(p))
                          .join(' ')
                      )
                      .join(', ')
                  }
                  multiple>
                  <MenuItem
                    onClick={() => dispatch(deselectAllJoints({personIdx}))}
                    disabled={
                      !selectedJoints[personIdx] ||
                      !selectedJoints[personIdx].length
                    }>
                    Select none
                  </MenuItem>
                  {jointNames.map(jointName => {
                    return [
                      <ListSubheader key={jointName} sx={{fontWeight: 'bold'}}>
                        {jointName}
                      </ListSubheader>,
                      ...vectorComponents.map(c => {
                        /**
                         * @type {string}
                         */
                        const value = jointName + separator + c;
                        return (
                          <MenuItem
                            dense
                            sx={{py: 0}}
                            key={value}
                            value={value}
                            onClick={() => {
                              if (
                                selectedJointsTransformed.indexOf(value) > -1
                              ) {
                                return dispatch(
                                  deselectJoint({
                                    personIdx,
                                    name: jointName,
                                    component: c
                                  })
                                );
                              }
                              return dispatch(
                                selectJoint({
                                  personIdx,
                                  name: jointName,
                                  component: c
                                })
                              );
                            }}>
                            <Checkbox
                              checked={
                                selectedJointsTransformed.indexOf(value) > -1
                              }
                            />
                            <ListItemText primary={c} />
                          </MenuItem>
                        );
                      })
                    ];
                  })}
                </Select>
              </FormControl>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

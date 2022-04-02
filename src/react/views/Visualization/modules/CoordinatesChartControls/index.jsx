import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select
} from '@mui/material';
import {selectIsAnimationInitialized} from '../Animation/reducers';
import {selectJointNames} from '../CoordinatesChart/reducers';
import {selectSelectedJoints} from './reducers';
import {deselectJoint, selectJoint} from './actions';

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
   * @type {object[]}
   */
  const selectedJoints = useSelector(selectSelectedJoints);
  /**
   * @type {string[]}
   */
  const selectedJointsTransformed = selectedJoints.map(
    j => j.name + separator + j.component
  );
  if (!isInitialized) return '';
  return (
    <Box sx={{mb: 1}}>
      <FormControl sx={{width: 300}} color={'secondary'}>
        <InputLabel id='select-joints-checkbox-label' color={'secondary'}>
          Select joints
        </InputLabel>
        <Select
          color={'secondary'}
          labelId='select-joints-checkbox-label'
          value={selectedJointsTransformed}
          input={<OutlinedInput label='Select joints' />}
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
          {jointNames.map(jointName => {
            return [
              <ListSubheader key={jointName}>{jointName}</ListSubheader>,
              ...vectorComponents.map(c => {
                /**
                 * @type {string}
                 */
                const value = jointName + separator + c;
                return (
                  <MenuItem
                    key={value}
                    value={value}
                    onClick={() => {
                      if (selectedJointsTransformed.indexOf(value) > -1) {
                        return dispatch(
                          deselectJoint({
                            name: jointName,
                            component: c
                          })
                        );
                      }
                      return dispatch(
                        selectJoint({
                          name: jointName,
                          component: c
                        })
                      );
                    }}>
                    <Checkbox
                      checked={selectedJointsTransformed.indexOf(value) > -1}
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
};

import React from 'react';
import {useSelector} from 'react-redux';
import {Alert, Box, Divider, Fade, Stack} from '@mui/material';
import {selectAreMiniControls} from './reducers';
import {selectHoveredJointData} from '../Animation/reducers';
import DraggableAnimationControls from './Draggable';
import InlineAnimationControls from './Inline';

export const AnimationControls = () => {
  const areMiniControls = useSelector(selectAreMiniControls);
  const hoveredJointData = useSelector(selectHoveredJointData);

  return (
    <>
      <Fade in={hoveredJointData !== null && 'name' in hoveredJointData}>
        <Box>
          {hoveredJointData && (
            <Alert
              severity={'info'}
              sx={{position: 'absolute', right: 0, top: 0}}>
              <Stack direction={'column'}>
                <Stack direction={'row'}>
                  <b>Person:</b>&nbsp;{hoveredJointData.personIdx}
                </Stack>
                <Stack direction={'row'}>
                  <b>Joint:</b>&nbsp;{hoveredJointData.name}
                </Stack>
                <Divider sx={{my: 1}} flexItem />
                <Stack direction={'row'}>
                  <b>x:</b>&nbsp;{hoveredJointData.x}
                </Stack>
                <Stack direction={'row'}>
                  <b>y:</b>&nbsp;{hoveredJointData.y}
                </Stack>
                <Stack direction={'row'}>
                  <b>z:</b>&nbsp;{hoveredJointData.z}
                </Stack>
              </Stack>
            </Alert>
          )}
        </Box>
      </Fade>
      {areMiniControls && <DraggableAnimationControls />}
      {!areMiniControls && <InlineAnimationControls />}
    </>
  );
};

export default AnimationControls;

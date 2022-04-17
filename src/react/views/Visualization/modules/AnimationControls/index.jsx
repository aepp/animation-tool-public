import React from 'react';
import {useSelector} from 'react-redux';
import {selectAreMiniControls} from './reducers';
import DraggableAnimationControls from './Draggable';
import InlineAnimationControls from './Inline';

export const AnimationControls = () => {
  const areMiniControls = useSelector(selectAreMiniControls);

  if (areMiniControls) return <DraggableAnimationControls />;
  return <InlineAnimationControls />;
};

export default AnimationControls;

import {useTheme} from '@mui/material';
import {useSelector} from 'react-redux';
import {selectIsPlaying} from '../reducers';

export const useProgressTransition = () => {
  const theme = useTheme();
  const isPlaying = useSelector(selectIsPlaying);

  return theme.transitions.create(['all'], {
    duration: !isPlaying ? theme.transitions.duration.shortest : '10ms'
  });
};

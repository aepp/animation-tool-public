import React from 'react';
import * as PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import {BACKGROUND_COLOR} from '../../../../theme/constants';
import {setDrawerState} from '../../actions';

export const DrawerItem = ({
  primary,
  secondary,
  icon,
  component,
  onClick = () => {},
  componentProps = {}
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <ListItem sx={{paddingX: 0, paddingBottom: 1, paddingTop: 0}}>
      <ListItemButton
        component={component ? component : undefined}
        {...componentProps}
        onClick={e => {
          onClick(e);
          dispatch(setDrawerState(false));
        }}
        sx={{
          transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.standard
          }),
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            backgroundColor: BACKGROUND_COLOR,
            transition: theme.transitions.create(['all'], {
              duration: theme.transitions.duration.standard
            })
          },
          '&.active, &.selected': {
            backgroundColor: theme.palette.secondary.main,
            transition: theme.transitions.create(['all'], {
              duration: theme.transitions.duration.standard
            })
          }
        }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={secondary ? secondary : undefined}
        />
      </ListItemButton>
    </ListItem>
  );
};

DrawerItem.propTypes = {
  primary: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object
  ]),
  onClick: PropTypes.func,
  componentProps: PropTypes.object
};
export default DrawerItem;

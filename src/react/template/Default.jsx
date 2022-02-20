import React from 'react';
import {useSelector} from 'react-redux';
import {Box, Paper, useTheme} from '@mui/material';
import {BACKGROUND_COLOR} from '../theme/constants';
import {useContentStyle} from '../modules/App/hooks/useContentStyle';
import {selectIsStandalone} from '../modules/App/reducers';

export const DefaultTemplate = ({children}) => {
  const theme = useTheme();
  const contentStyle = useContentStyle();
  const isStandalone = useSelector(selectIsStandalone);

  return (
    <Box
      sx={{
        ...contentStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isStandalone ? 2 : 0,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.paper
      }}>
      <Paper
        elevation={3}
        square={false}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          backgroundColor: BACKGROUND_COLOR,
          borderRadius: `${theme.shape.borderRadius}px`
        }}>
        {children}
      </Paper>
    </Box>
  );
};

export default DefaultTemplate;

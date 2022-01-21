import {createTheme} from '@mui/material/styles';
import {BACKGROUND_COLOR, PRIMARY_COLOR, SECONDARY_COLOR} from './constants';

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: SECONDARY_COLOR
    }
  }
});

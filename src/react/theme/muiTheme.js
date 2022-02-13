import {createTheme} from '@mui/material/styles';
import {PRIMARY_COLOR, SECONDARY_COLOR} from './constants';

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
console.log(theme);
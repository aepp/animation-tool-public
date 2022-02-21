import {createTheme} from '@mui/material/styles';
import {PRIMARY_COLOR, SECONDARY_COLOR} from './constants';

export const theme = createTheme({
  typography: {
    // Tell MUI what's the font-size on the html element is.
    htmlFontSize: 16
  },
  palette: {
    primary: {
      main: PRIMARY_COLOR
    },
    secondary: {
      main: SECONDARY_COLOR
    }
  }
});
if (process.env.NODE_ENV !== 'production') {
  console.log(theme);
}

import { createTheme} from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#00696E',
        
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
        light: '#CCE8E9'
      },
    },
    components: {
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '12px'
          }
        }
      }
    },
  });

export default theme;
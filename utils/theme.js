import { createTheme} from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { themeGuide } from './themeGuide';
const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: themeGuide.schemes.light.primary,
        
      },
      secondary: {
        // This is green.A700 as hex.
        main: themeGuide.schemes.light.secondary,
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
      },
      MuiCard: {
        variants: [{
          props: {variant: 'outlined'},
          style: {
            border: 0
          }
        }],
        styleOverrides: {
          root: {
            backgroundColor: '#ECEEEE',
            borderRadius: '20px',
            border: 0
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px'
          }
        }
      }
    },
  });

export default theme;
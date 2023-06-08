import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { themeGuide } from "./themeGuide";
const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: themeGuide.schemes.light.primary,
    },
    secondary: {
      // This is green.A700 as hex.
      main: themeGuide.schemes.light.secondary,
      light: "#CCE8E9",
    },
  },
  typography: {
    fontSize: 12
  },
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "12px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgorundColor: '#F7FAF9'
        },
        colorDefault: {
          backgroundColor: '#F7FAF9'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px'
        }
      }
    },
    
  },
});

export default theme;

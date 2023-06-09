import { createTheme } from "@mui/material/styles";
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
  components: {
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
    
  },
});

export default theme;

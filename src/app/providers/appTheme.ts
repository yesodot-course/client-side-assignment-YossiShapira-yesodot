import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: "Arial, Rubik, Heebo, sans-serif",
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          direction: "rtl",
        },
      },
    },
    
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          direction: "rtl",
          textAlign: "right",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          direction: "rtl",
          textAlign: "right",
        },
      },
    },
  },
});

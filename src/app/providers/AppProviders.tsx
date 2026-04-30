import type { PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { prefixer } from "stylis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "../store/store";
import { queryClient } from "../../shared/api/queryClient";

const theme = createTheme({
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          direction: "rtl",
          textAlign: "right",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          direction: "rtl",
          textAlign: "right",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          direction: "rtl",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
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

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  return (
    <Provider store={store}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer position="bottom-left" rtl />
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}
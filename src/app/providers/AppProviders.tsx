import type { PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
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
          textAlign: "start",
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
          textAlign: "start",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          direction: "rtl",
          textAlign: "start",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          direction: "rtl",
          textAlign: "start",
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
          textAlign: "start",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          direction: "rtl",
          textAlign: "start",
        },
      },
    },
  },
});

// No @mui/stylis-plugin-rtl: cssjanus flips *every* Emotion rule including `direction: rtl` → `ltr`,
// which made the whole app look LTR unless styles bypassed Emotion (e.g. inline `style`).
// Theme `direction: "rtl"` + `lang`/`dir` on <html> handle RTL; use logical margins in new code.
const emotionCache = createCache({
  key: "mui",
  stylisPlugins: [prefixer],
});

export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
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
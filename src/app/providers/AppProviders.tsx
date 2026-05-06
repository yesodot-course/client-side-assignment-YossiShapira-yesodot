import type { PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { prefixer } from "stylis";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { store } from "../store/store";
import { queryClient } from "../../shared/api/queryClient";
import { appTheme } from "./appTheme";


const emotionCache = createCache({
  key: "mui",
  stylisPlugins: [prefixer],
});

export function AppProviders({ children }: PropsWithChildren): JSX.Element {
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={appTheme}>
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
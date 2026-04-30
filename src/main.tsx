import React from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "./app/providers/AppProviders";
import { AppRouter } from "./app/router/AppRouter";

document.documentElement.lang = "he";
document.documentElement.dir = "rtl";
document.body.dir = "rtl";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>
);
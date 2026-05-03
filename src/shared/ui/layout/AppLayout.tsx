import type { PropsWithChildren } from "react";
import { Box } from "@mui/material";

import { AppHeader } from "../components/AppHeader";
import { PageContainer } from "../components/PageContainer";

export function AppLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", direction: "rtl", textAlign: "start" }}>
      <AppHeader />
      <PageContainer>{children}</PageContainer>
    </Box>
  );
}
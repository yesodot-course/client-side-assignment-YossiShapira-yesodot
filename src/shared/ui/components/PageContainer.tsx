import type { PropsWithChildren } from "react";
import { Container } from "@mui/material";

export function PageContainer({ children }: PropsWithChildren): JSX.Element {
  return <Container sx={{ py: 3, direction: "rtl", textAlign: "start" }}>{children}</Container>;
}
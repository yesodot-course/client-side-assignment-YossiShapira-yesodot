import { Alert } from "@mui/material";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "משהו השתבש." }: ErrorStateProps): JSX.Element {
  return <Alert severity="error">{message}</Alert>;
}
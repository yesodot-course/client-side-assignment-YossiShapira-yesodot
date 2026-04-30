import { Alert } from "@mui/material";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "אין נתונים להצגה כרגע." }: EmptyStateProps): JSX.Element {
  return <Alert severity="info">{message}</Alert>;
}
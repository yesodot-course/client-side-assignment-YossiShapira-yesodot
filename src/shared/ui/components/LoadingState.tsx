import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingState(): JSX.Element {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <CircularProgress size={20} />
      <Typography>טוען...</Typography>
    </Box>
  );
}
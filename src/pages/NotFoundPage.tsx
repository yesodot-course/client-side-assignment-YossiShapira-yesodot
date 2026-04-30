import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export function NotFoundPage(): JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
      <Typography variant="h4">העמוד לא נמצא</Typography>
      <Button component={Link} to="/" variant="contained">
        חזרה לדף הבית
      </Button>
    </Box>
  );
}
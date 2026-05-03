import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar } from "@mui/material";

export function AppHeader(): JSX.Element {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar
        sx={{
          display: "flex",
          direction: "rtl",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          component={Link}
          to="/"
          color="inherit"
          sx={{ typography: "h6", whiteSpace: "nowrap", textTransform: "none" }}
        >
          onlineStore
        </Button>
        <Box sx={{ display: "flex", gap: 0, direction: "rtl", justifyContent: "flex-end" }}>
          <Button component={Link} to="/cart" sx={{ minWidth: "auto", fontSize: "1.8rem", p: 0.5 }}>
            🛒
          </Button>
          <Button component={Link} to="/admin" sx={{ minWidth: "auto", fontSize: "1.8rem", p: 0.5 }}>
            ⚙️
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar } from "@mui/material";

/** כפתורי ניווט בעגלה ובניהול — אימוג׳י בלבד; aria-label לקריאת מסך קוראים */
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
        <Box sx={{ display: "flex", gap: 0.5, direction: "rtl", justifyContent: "flex-end", alignItems: "center" }}>
          <Button
            component={Link}
            to="/cart"
            color="inherit"
            aria-label="עגלה"
            sx={{
              minWidth: "auto",
              fontSize: "1.35rem",
              lineHeight: 1,
              px: 0.65,
              py: 0.45,
            }}
          >
            🛒
          </Button>
          <Button
            component={Link}
            to="/admin"
            color="inherit"
            aria-label="לוח ניהול"
            sx={{
              minWidth: "auto",
              fontSize: "1.35rem",
              lineHeight: 1,
              px: 0.65,
              py: 0.45,
            }}
          >
            🛡️
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

import { IoCartOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar } from "@mui/material";

const navIconButtonSx = {
  minWidth: "auto",
  lineHeight: 1,
  px: 0.65,
  py: 0.45,
  color: "text.primary",
  "& svg": { fontSize: "1.35rem", display: "block" },
} as const;

/** ניווט: IoCartOutline (עגלה) + RiAdminLine (ניהול). aria-label לנגישות */
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
          <Button component={Link} to="/cart" color="inherit" aria-label="עגלה" sx={navIconButtonSx}>
            <IoCartOutline aria-hidden />
          </Button>
          <Button component={Link} to="/admin" color="inherit" aria-label="לוח ניהול" sx={navIconButtonSx}>
            <RiAdminLine aria-hidden />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

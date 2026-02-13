import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const DRAWER_WIDTH = 260;

const SidebarContent = ({ onSelectMenu }) => (
  <Box sx={{ width: DRAWER_WIDTH }}>
    <Box sx={{ p: 2 }}>
      <Link to="/">
        <Box component="img" src="/image/hm-logo.png" alt="hm-logo.png" sx={{ width: 100 }} />
      </Link>
    </Box>

    <Typography variant="subtitle1" sx={{ px: 2, pb: 1, fontWeight: 700 }}>
      Admin Account
    </Typography>

    <Divider />

    <List>
      <ListItemButton onClick={() => onSelectMenu("/admin/product?page=1")}>
        <ListItemText primary="Product" />
      </ListItemButton>

      <ListItemButton onClick={() => onSelectMenu("/admin/order?page=1")}>
        <ListItemText primary="Order" />
      </ListItemButton>
    </List>
  </Box>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);

  const handleSelectMenu = (url) => {
    navigate(url);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
            minHeight: "100vh",
            bgcolor: "background.paper",
          }}
        >
          <SidebarContent onSelectMenu={handleSelectMenu} />
        </Box>
      )}

      {/* Mobile AppBar + Drawer */}
      {isMobile && (
        <>
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              color: "text.primary",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box component="img" src="/image/hm-logo.png" alt="hm-logo.png" sx={{ width: 80 }} />

              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{ sx: { width: DRAWER_WIDTH } }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <SidebarContent onSelectMenu={handleSelectMenu} />
          </Drawer>

          {/* AppBar 높이만큼 공간 확보 */}
          <Toolbar />
        </>
      )}
    </>
  );
};

export default Sidebar;

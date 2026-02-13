import React, { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, createSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";

// MUI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItemCount } = useSelector((state) => state.cart);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 네 테마 기준 md=980

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const menuList = useMemo(
    () => ["여성", "Divided", "남성", "신생아/유아", "아동", "H&M HOME", "Sale", "지속가능성"],
    [],
  );

  const goSearch = (value) => {
    const v = value.trim();
    if (!v) {
      navigate("/");
      return;
    }
    navigate({
      pathname: "/",
      search: `?${createSearchParams({ name: v })}`,
    });
  };

  const onCheckEnter = (event) => {
    if (event.key !== "Enter") return;
    goSearch(event.target.value || "");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: theme.zIndex.appBar }}>
      {/* Admin quick link */}
      {user?.level === "admin" && (
        <Box
          sx={{
            bgcolor: "background.paper",
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: { xs: 2, md: 3 },
            py: 1,
          }}
        >
          <Button component={RouterLink} to="/admin/product?page=1" variant="outlined" size="small">
            Admin page
          </Button>
        </Box>
      )}

      {/* Top Bar */}
      <AppBar
        elevation={0}
        position="static"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, md: 3 },
            minHeight: { xs: 56, md: 72 },
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Left: Burger + Logo */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} aria-label="open menu">
                <MenuIcon />
              </IconButton>
            )}

            <Box
              component={RouterLink}
              to="/"
              sx={{ display: "inline-flex", alignItems: "center" }}
            >
              <Box
                component="img"
                src="/image/hm-logo.png"
                alt="hm-logo.png"
                sx={{ width: 92, height: "auto" }}
              />
            </Box>
          </Stack>

          {/* Center: Desktop Menu */}
          {!isMobile && (
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ flex: 1, ml: 3 }}>
              {menuList.map((menu) => (
                <Button
                  key={menu}
                  variant="text"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    px: 0.5,
                    "&:hover": { bgcolor: "transparent", color: "primary.main" },
                  }}
                  onClick={() => {
                    // 메뉴 클릭 시 동작이 아직 없어서 placeholder
                    // 필요하면 navigate(`/products?category=${...}`) 같은 식으로 연결
                  }}
                >
                  {menu}
                </Button>
              ))}
            </Stack>
          )}

          {/* Right: Actions + Search */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Desktop Search */}
            {!isMobile && (
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  width: 280,
                }}
              >
                <SearchIcon fontSize="small" />
                <InputBase
                  placeholder="제품검색"
                  onKeyDown={onCheckEnter}
                  sx={{ flex: 1, fontSize: "0.95rem" }}
                />
              </Paper>
            )}

            {/* Login/Logout */}
            {user ? (
              <Button
                onClick={handleLogout}
                startIcon={<PersonOutlineIcon />}
                variant="text"
                sx={{ color: "text.primary", fontWeight: 700 }}
              >
                {!isMobile ? "로그아웃" : ""}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                startIcon={<PersonOutlineIcon />}
                variant="text"
                sx={{ color: "text.primary", fontWeight: 700 }}
              >
                {!isMobile ? "로그인" : ""}
              </Button>
            )}

            {/* Cart */}
            <IconButton onClick={() => navigate("/cart")} aria-label="cart">
              <Badge badgeContent={cartItemCount || 0} color="primary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {/* Orders */}
            <IconButton onClick={() => navigate("/account/purchase")} aria-label="orders">
              <Inventory2OutlinedIcon />
            </IconButton>

            {/* Mobile Search Toggle */}
            {isMobile && (
              <IconButton onClick={() => setShowMobileSearch((v) => !v)} aria-label="toggle search">
                {showMobileSearch ? <CloseIcon /> : <SearchIcon />}
              </IconButton>
            )}
          </Stack>
        </Toolbar>

        {/* Mobile Search Bar */}
        {isMobile && showMobileSearch && (
          <Box
            sx={{
              px: 2,
              pb: 2,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
              }}
            >
              <SearchIcon fontSize="small" />
              <InputBase
                placeholder="제품검색"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goSearch(e.target.value || "");
                    setShowMobileSearch(false);
                  }
                }}
                sx={{ flex: 1 }}
              />
            </Paper>
          </Box>
        )}
      </AppBar>

      {/* Drawer (Mobile Menu) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: "background.paper" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            {menuList.map((menu) => (
              <Button
                key={menu}
                variant="text"
                sx={{
                  justifyContent: "flex-start",
                  color: "text.primary",
                  fontWeight: 600,
                  py: 1,
                }}
                onClick={() => setDrawerOpen(false)}
              >
                {menu}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;

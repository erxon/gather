import Link from "next/link";
import { useUser } from "@/lib/hooks";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Popover } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "@/lib/api-lib/api-auth";
import ContactRequestMain from "./notifications/ContactRequestMain";
import ContactAcceptedMain from "./notifications/ContactAcceptedMain";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconTypography from "@/utils/layout/IconTypography";

export default function ComponentNavbar(props) {
  const [user, { mutate }] = useUser();

  const handleLogout = async () => {
    await logout();
    mutate({ user: null });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotifcationsAnchorEl] = React.useState(null);

  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotifcationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotifcationsAnchorEl(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link href="/profile" style={{ textDecoration: "none", color: "#000" }}>
          Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  const popoverId = "notifications";
  const renderNotifications = (
    <Popover
      open={isNotificationsOpen}
      onClose={handleNotificationsClose}
      anchorEl={notificationsAnchorEl}
      id={popoverId}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {user && (
        <Box>
          <ContactRequestMain
            userId={user._id}
            username={user.username}
            photo={user.photo}
          />
          <ContactAcceptedMain userId={user._id} />
        </Box>
      )}
    </Popover>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuList dense>
        <MenuItem>
          <Link href="/login" style={{ textDecoration: "none", color: "#000" }}>
            Login
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
          px: 4,
        }}
        color="default"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountCircleIcon />
                <Typography>{user.username}</Typography>
              </Stack>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <ArrowDropDownIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex", backgroundColor: "primary" },
              }}
            >
              <Stack spacing={2} direction="row" alignItems="center">
                <Button
                  color="primary"
                  href="/login"
                  variant="contained"
                  size="large"
                  disableElevation
                >
                  Login
                </Button>
              </Stack>
            </Box>
          )}
          {user ? (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountCircleIcon />
                <Typography>{user.username}</Typography>
              </Stack>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <ArrowDropDownIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Button
                  color="primary"
                  href="/login"
                  variant="contained"
                  size="large"
                  disableElevation
                >
                  Login
                </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotifications}
    </Box>
  );
}

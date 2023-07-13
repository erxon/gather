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
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Avatar, Divider, Popover, Paper } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "@/lib/api-lib/api-auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ProfilePhoto from "./photo/ProfilePhoto";
import Notifications from "./appbar/Notifications";
import Contacts from "./notifications/Contacts";
import Image from "next/image";

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
        horizontal: "right",
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
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {user && (
        <Box sx={{ maxWidth: 350, p: 3 }}>
          <Typography sx={{ my: 1 }}>Notifications</Typography>
          <Divider />
          <Contacts userId={user._id} />
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
              <Stack direction="row" alignItems="center" spacing={1}>
                <Notifications
                  handleNotificationsOpen={handleNotificationsOpen}
                  userId={user._id}
                />
                <IconButton
                  sx={{ mr: 1 }}
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user.photo ? (
                    <Avatar>
                      <ProfilePhoto publicId={user.photo} />
                    </Avatar>
                  ) : (
                    <Avatar src="/asests/placeholder.png" />
                  )}
                </IconButton>
                <Stack direction="column">
                  <Typography sx={{ fontWeight: "bold" }} variant="body2">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="subtitle2">{user.username}</Typography>
                </Stack>
              </Stack>
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
              <Stack direction="row" alignItems="center" spacing={1}>
                <Notifications
                  handleNotificationsOpen={handleNotificationsOpen}
                  userId={user._id}
                />
                <IconButton
                  sx={{ mr: 1 }}
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar>
                    <ProfilePhoto publicId={user.photo} />
                  </Avatar>
                </IconButton>
                <Stack direction="column">
                  <Typography sx={{ fontWeight: "bold" }} variant="body2">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="subtitle2">{user.username}</Typography>
                </Stack>
              </Stack>
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

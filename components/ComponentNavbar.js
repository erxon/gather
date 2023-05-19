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
        vertical: "top",
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
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={popoverId}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
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
  const renderMobileMenu = user ? (
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
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationsOpen}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  ) : (
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
          <p>Signup</p>
        </MenuItem>
        <MenuItem>
          <p>Login</p>
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
        }}
        color="background"
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
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Gather
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                aria-controls={popoverId}
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
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
                  size="small"
                  disableElevation
                >
                  Login
                </Button>
                <Button
                  size="small"
                  href="/signup"
                  variant="contained"
                  disableElevation
                >
                  Signup
                </Button>
              </Stack>
            </Box>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotifications}
    </Box>
  );
}

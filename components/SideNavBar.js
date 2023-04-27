import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Box, Drawer } from "@mui/material";
import { useUser } from "@/lib/hooks";

function MainListItems() {
  const [user] = useUser();
  const styles = {
    borderRadius: "5px",
    margin: "10px",
  };
  return (
    <>
      <List>
        {user ? (
          <ListItemButton href="/dashboard" sx={styles} selected={true}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        ) : (
          <ListItemButton href="/" sx={styles} selected={true}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        )}
        <ListItemButton href="/reports" sx={styles}>
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
        {user && (
          <List>
            {" "}
            <ListItemButton href={`/communicate/${user._id}`} sx={styles}>
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText primary="Communicate" />
            </ListItemButton>
            <ListItemButton href="/users" sx={styles}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </List>
        )}
      </List>
    </>
  );
}

export default function SideNavBar() {
  return (
    <>
      <MainListItems />
    </>
  );
}

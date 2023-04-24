import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Drawer } from "@mui/material";


function MainListItems(){
  const styles = {
    borderRadius: '5px', 
    margin: '10px',

  }
  return <>
 <List>
    <ListItemButton sx={styles}
      selected={true}
      >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton sx={styles}>
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
  </List>
  </>
}

export default function SideNavBar() {
  return (
    <>
        <MainListItems />
    </>
  );
}

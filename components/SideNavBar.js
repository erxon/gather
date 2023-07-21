import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUser } from "@/lib/hooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { Collapse, Divider, Typography } from "@mui/material";

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import UnverifedUsers from "./drawer/UnverifiedUsers";
import MapIcon from '@mui/icons-material/Map';

function ItemButtonReports() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
    router.push("/reports");
  };
  return (
    <div>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            onClick={() => {
              router.push("/reports/archive");
            }}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <Inventory2OutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Archived reports" />
          </ListItemButton>
        </List>
      </Collapse>
    </div>
  );
}
function ItemButtonUsers() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
    router.push("/users");
  };
  return (
    <div>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <UnverifedUsers />
      </Collapse>
    </div>
  );
}

function ListItems(props) {
  const router = useRouter();
  const [user] = useUser();

  return (
    <>
      <List>
        {user ? (
          <ListItemButton
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={() => {
              router.push("/");
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        )}
        <ItemButtonReports />
        {user && (
          <List>
            <Divider />
            <Typography sx={{ p: 2, fontWeight: "bold" }}>Connect</Typography>
            <ListItemButton
              onClick={() => {
                router.push("/communicate");
              }}
            >
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText primary="Communicate" />
            </ListItemButton>
            {user.type === "authority" && user.status === "verified" ? (
              <ItemButtonUsers />
            ) : (
              <ListItemButton
                onClick={() => {
                  router.push("/users");
                }}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            )}
            <ListItemButton
              onClick={() => {
                router.push("/myreport");
              }}
            >
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="My report" />
            </ListItemButton>
            {user.type === "authority" && (
              <div>
                <Divider />
                <Typography sx={{ p: 2, fontWeight: "bold" }}>
                  Authorities
                </Typography>
                <ListItemButton
                  onClick={() => {
                    router.push("/authority/photos");
                  }}
                >
                  <ListItemIcon>
                    <PhotoLibraryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Photos" />
                </ListItemButton>
              </div>
            )}
            {user.type === "authority" && user.status === "verified" && (
              <ListItemButton
              onClick={() => {
                router.push("/map");
              }}
            >
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
            )}
          </List>
        )}
      </List>
    </>
  );
}

export default function SideNavBar() {
  return (
    <>
      <ListItems />
    </>
  );
}

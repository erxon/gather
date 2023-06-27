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
import { Collapse, Divider, Typography } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';

function ItemButtonUsers() {

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(!open)
    router.push("/users");
  }
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
        <List component="div" disablePadding>
          <ListItemButton onClick={() => {router.push("/users/unverified")}} sx={{ pl: 4 }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Unverified users" />
          </ListItemButton>
        </List>
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
        <ListItemButton
          onClick={() => {
            router.push("/reports");
          }}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
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
            {user.type === "authority" ? (
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

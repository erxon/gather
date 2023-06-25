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
import { useUser } from "@/lib/hooks";
import { useRouter } from "next/router";

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
            {" "}
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

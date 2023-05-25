import {
  Box,
  Avatar,
  Paper,
  Typography,
  Stack,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  List,
  Grid,
  Divider,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import { useState} from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import ConversationBox from "./ConversationBox";

function Contact(props) {
  return (
    <ListItemButton
      onClick={() => {
        props.onContactClick(props.id, props.username);
      }}
      sx={{ minWidth: 100 }}
    >
      <Box sx={{ margin: { xs: "auto", md: 0, sm: "auto" } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={2}
        >
          <ListItemAvatar>
            {props.photo ? (
              <Avatar sx={{ margin: "auto" }}>
                <ProfilePhotoAvatar publicId={props.photo} />
              </Avatar>
            ) : (
              <Avatar sx={{ margin: "auto" }}>
                {props.username.slice(0, 1)}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={props.username} />
        </Stack>
      </Box>
    </ListItemButton>
  );
}

export default function ChatMain({user}) {

  const { data, error, isLoading } = useSWR("/api/user/contacts", fetcher);

  const [contact, setContact] = useState({
    id: "",
    username: "",
  });

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress size="small" />;

  const handleClick = (contactId, username) => {
    setContact({
      id: contactId,
      username: username,
    });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{p: 3}}>
            <Typography variant="body1">Contacts</Typography>
            <List
              sx={{
                maxHeight: "500px",
                maxWidth: "500px",
                overflowY: "auto",
              }}
            >
              <Stack
                direction={{ xs: "row", md: "column", sm: "row" }}
                spacing={{ xs: 2, md: 1, sm: 1 }}
              >
                {data && data.length > 0 ? data.map((contact) => {
                  return (
                    <Contact
                      key={contact._id}
                      id={contact._id}
                      onContactClick={handleClick}
                      photo={contact.photo}
                      username={contact.username}
                    />
                  );
                }) : <Typography color="GrayText">No contacts yet</Typography>}
              </Stack>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {contact.id !== "" && (
            <ConversationBox contactId={contact.id} username={contact.username} user={user}/>
          )}
        </Grid>
      </Grid>
    </>
  );
}

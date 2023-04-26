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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import { useState } from "react";

function Contact(props) {
  return (
    <ListItemButton
      onClick={() => {
        props.onContactClick(props.username);
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

export default function Communicate({ data }) {
  const contacts = data.contacts;
  const [displayContact, setDisplayContact] = useState(
    data.contacts[0].username
  );

  const handleClick = (value) => {
    setDisplayContact(value);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="body1">Contacts</Typography>
            <List
              sx={{ maxHeight: "500px", maxWidth: "500px", overflowY: "auto" }}
            >
              <Stack
                direction={{ xs: "row", md: "column", sm: "row" }}
                spacing={{ xs: 2, md: 1, sm: 1 }}
              >
                {contacts.map((contact) => {
                  return (
                    <Contact
                      onContactClick={handleClick}
                      photo={contact.photo}
                      username={contact.username}
                    />
                  );
                })}
              </Stack>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography>{displayContact}</Typography>
          </Box>
          <Divider />
          <Box sx={{ height: "500px", maxWidth: "300px" }}>
            <Typography>Conversations will go here</Typography>
          </Box>
          <Box>
            <Stack direction="row" spacing={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message here..."
              />

              <IconButton color="primary">
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { uid } = params;

  const res = await fetch(`http://localhost:3000/api/user/${uid}`);

  const data = await res.json();

  return {
    props: { data },
  };
}

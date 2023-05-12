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
import { useState, useEffect } from "react";
import { pusherJS } from "@/utils/pusher";

async function getChannel(contactId) {
  const res = await fetch(`/api/communicate/${contactId}`);
  const data = await res.json();
  return data;
}

function Chat({ from, message }) {
  return (
    <>
      <Typography variant="subtitle2">{from}</Typography>
      <Typography variant="body1">{message}</Typography>
    </>
  );
}

function Contact(props) {
  return (
    <ListItemButton
      onClick={() => {
        props.onContactClick(props.id);
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
  const [contact, setContact] = useState(data.contacts[0]._id);
  const [messageObj, setMessageObj] = useState({
    message: "",
    from: data.username,
  });
  const [conversation, setConversation] = useState([]);

  const [channel, setChannel] = useState("");
  useEffect(() => {
    getChannel(contact).then((data) => {
      setConversation([...data[0].conversation]);
    });
    const subscribeChannel = pusherJS.subscribe(channel);
    subscribeChannel.bind("chat", (data) => {
      setConversation([...conversation, data.body]);
    });
    return () => {
      subscribeChannel.unbind();
      pusherJS.unsubscribe(channel);
    };
  }, [conversation]);

  const handleClick = async (contactId) => {
    const data = await getChannel(contactId);

    setChannel(data[0]._id);
    setContact(contactId);
  };

  const handleChange = (event) => {
    setMessageObj((prev) => {
      return { ...prev, message: event.target.value };
    });
  };

  const handleSend = async () => {
    await fetch("/api/communicate/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channelId: channel,
        ...messageObj,
      }),
    });

    setConversation([...conversation, messageObj]);
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
                      key={contact._id}
                      id={contact._id}
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
            <Typography>
              {contact} {channel}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ height: "500px", maxWidth: "300px" }}>
            <Typography>Conversations will go here</Typography>
            {conversation.map((data) => {
              return (
                <>
                  <Chat from={data.from} message={data.message} />
                </>
              );
            })}
          </Box>
          <Box>
            <Stack direction="row" spacing={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message here..."
                value={messageObj.message}
                onChange={handleChange}
              />

              <IconButton onClick={handleSend} color="primary">
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

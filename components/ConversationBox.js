import {
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import useSWR from "swr";
import { useState, useEffect, useRef } from "react";
import { fetcher } from "@/lib/hooks";
import SendIcon from "@mui/icons-material/Send";
import { pusherJS } from "@/utils/pusher";

async function sendMessage(message, channelId, user) {
  const body = {
    message: message,
    date: new Date(),
    channelId: channelId,
    from: user,
  };

  const result = await fetch("/api/communicate/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return result;
}

function MessageContainer(props) {
  //Render a different container style for messages that came from the user,
  //and messages that came from the contact
  const { username, currentUserUsername, message, date } = props;
  const dateString = new Date(date).toDateString();

  const commonStyle = {
    p: 2,
  };
  const structure = (
    <Box>
      <Typography variant="subtitle2">{username}</Typography>
      <Typography variant="body2">{dateString}</Typography>
      <Box
        sx={{
          textAlign: "left",
          maxWidth: "300px",
          p: 2,
          borderRadius: "20px",
          backgroundColor: "#CCE8E9",
        }}
      >
        <Typography variant="body1">{message}</Typography>
      </Box>
    </Box>
  );
  const userMessageContainer = (
    //align right
    <Box
      sx={{
        textAlign: "right",
        display: "flex",
        justifyContent: "flex-end",
        ...commonStyle,
      }}
    >
      {structure}
    </Box>
  );
  const contactMessageContainer = (
    //align left
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        ...commonStyle,
      }}
    >
      {structure}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          px: 5,
        }}
      >
        {currentUserUsername === username
          ? userMessageContainer
          : contactMessageContainer}
      </Box>
    </>
  );
}

function Conversation(props) {
  const [conversation, setConversation] = useState([...props.conversation]);
  const [channelId, setChannelId] = useState(props.channelId);
  const chatLogRef = useRef(null);

  if (channelId !== props.channelId) {
    setConversation(props.conversation);
    setChannelId(props.channelId);
  }

  useEffect(() => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;

    const channel = pusherJS.subscribe(channelId);

    channel.bind("chat", (data) => {
      setConversation([...conversation, data.body]);
    });

    return () => {
      channel.unbind();
      pusherJS.unsubscribe(channel);
    };
  }, [conversation, chatLogRef]);
  return (
    <>
      <Box
        sx={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            marginBottom: "10px",
          }}
          ref={chatLogRef}
        >
          {console.log(conversation)}
          {conversation.map((messageObj) => {
            return (
              <MessageContainer
                currentUserUsername={props.user}
                username={messageObj.from}
                date={messageObj.createdAt}
                message={messageObj.message}
              />
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default function ConversationBox({ contactId, username, user }) {
  //data - contains the conversations
  const [message, setMessage] = useState("");

  const { data, error, isLoading } = useSWR(
    `/api/communicate/${contactId}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading)
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography>Loading conversation </Typography>
        <CircularProgress />
      </Stack>
    );

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = async () => {
    setMessage("");
    await sendMessage(message, data[0]._id, user);
  };

  return (
    <>
      <Box>
        <Typography>{username}</Typography>
        <Divider />
        <Conversation
          channelId={data[0]._id}
          conversation={data[0].conversation}
          user={user}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message here..."
            onChange={handleChange}
            value={message}
          />
          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
}

import {
  Card,
  CardMedia,
  Avatar,
  Box,
  CircularProgress,
  CardContent,
  Typography,
  Button,
  Chip,
  CardActions,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import ProfilePhotoAvatar from "./photo/ProfilePhotoAvatar";
import { useRouter } from "next/router";

function Contact(props) {
  const router = useRouter();
  return (
    <>
      <Card sx={{ mb: 3 }} variant="outlined">
        <Stack sx={{ px: 2 }} direction="row" spacing={1} alignItems="center">
          <CardMedia>
            {props.photo !== "" ? (
              <Avatar>
                <ProfilePhotoAvatar publicId={props.photo} />
              </Avatar>
            ) : (
              <Avatar src="/assets/placeholder.png" />
            )}
          </CardMedia>
          <CardContent sx={{ flex: "1" }}>
            <Typography variant="subtitle2">{props.username}</Typography>
            <Chip size="small" label={props.type} />
          </CardContent>
          <CardActions sx={{ float: "right" }}>
            <IconButton
              onClick={() => {
                router.push("/communicate");
              }}
              color="primary"
              size="small"
              disableElevation
              variant="contained"
            >
              <MessageIcon />
            </IconButton>
          </CardActions>
        </Stack>
      </Card>
    </>
  );
}

export default function ContactList({ user }) {
  const { data, error, isLoading } = useSWR(`/api/user/contacts`, fetcher);
  if (isLoading) return <CircularProgress />;
  const contacts = data;
  console.log(contacts);

  return (
    <>
      <Divider sx={{ mb: 2 }} />
      {contacts.length > 0 ? (
        contacts.map((contact) => {
          return (
            <Contact
              key={contact._id}
              username={contact.username}
              firstName={contact.firstName}
              lastName={contact.lastName}
              photo={Object.hasOwn(contact, "photo") ? contact.photo : ""}
              type={contact.type}
            />
          );
        })
      ) : (
        <Typography color="GrayText">No contacts yet</Typography>
      )}
    </>
  );
}

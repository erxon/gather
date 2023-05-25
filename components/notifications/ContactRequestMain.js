import { useEffect, useState } from "react";
import { pusherJS } from "@/utils/pusher";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import ReportPhoto from "../photo/ReportPhoto";
import {
  getContactRequests,
  removeContactNotification,
  requestAccepted,
} from "@/lib/api-lib/api-notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

function ContactRequestNotification(props) {
  return (
    <>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box>
            {props.photo ? (
              <Avatar>
                <ReportPhoto publicId={props.photo} />
              </Avatar>
            ) : (
              <Avatar />
            )}
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">New contact request</Typography>
            <Typography variant="subtitle2">{props.message}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {/*Add to contact list*/}
              <Button
                onClick={() => {
                  props.onAccept(props.from, props.id);
                }}
                size="small"
                variant="contained"
              >
                Accept
              </Button>
              {/*Delete notification */}
              <Button
                onClick={() => {
                  props.onRemove(props.id);
                }}
                size="small"
              >
                Decline
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Divider />
    </>
  );
}

function ContactRequest({userId, username, photo, requests }) {
  const [notifications, setNotifications] = useState([...requests]);
  
  const handleAccept = async (from, notificationId) => {
    const body = {
      currentUserId: userId,
      newContact: from,
    };
    //Add the user to contact
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        //snackbar
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    //Remove notification once the request is accepted
    setNotifications(
      notifications.filter((notification) => {
        return notification._id !== notificationId;
      })
    );
    //Remove notification in Database
    await removeContactNotification(notificationId);

    //Send notification to another user with request accepted message
    const result = await requestAccepted({
      userId: userId,
      contactId: body.newContact,
      photo: photo,
      message: `${username} accepted your request`,
    });
    console.log(result);
  };

  const handleRemove = async (id) => {

    setNotifications(
      notifications.filter((notification) => {
        return notification._id !== id;
      })
    );
    await removeContactNotification(id);
  };

  useEffect(() => {
    const channel = pusherJS.subscribe(`notification-${userId}`);
    channel.bind("contact-requested", (data) => {
      setNotifications([...notifications, data]);
    });
    return () => {
      channel.unbind;
      pusherJS.unsubscribe(`notification-${userId}`);
    };
  }, [notifications]);

  return (
    <>
      <Box>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            return (
              <ContactRequestNotification
                key={notification._id}
                id={notification._id}
                from={notification.body.from}
                message={notification.body.message}
                username={notification.body.username}
                userId={notification.body.userId}
                photo={notification.body.photo}
                onAccept={handleAccept}
                onRemove={handleRemove}
              />
            );
          })
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2">No notifications yet</Typography>{" "}
          </Box>
        )}
      </Box>
    </>
  );
}

export default function ContactRequestMain({ userId, username, photo }) {
  const { data, error, isLoading } = useSWR(
    "/api/notification/contacts",
    fetcher
  );
  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;
  return (
    <ContactRequest
      userId={userId}
      username={username}
      photo={photo}
      requests={data}
    />
  );
}

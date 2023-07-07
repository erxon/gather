import { pusherJS } from "@/utils/pusher";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import ProfilePhoto from "../photo/ProfilePhoto";
import _ from "lodash";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/hooks";
import NotificationsIcon from "@mui/icons-material/Notifications";

function Notification({
  notification,
  removeNotification,
  notificationID,
  userId,
}) {
  const [isAccepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    removeNotification(notificationID);
    setAccepted(true);
    const accept = await fetch("/api/notification/contact-accepted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photo: notification.body.photo,
        from: userId,
        message: "Your contact request has been accepted.",
        sendTo: notification.body.from,
      }),
      
    });

    console.log(userId)
    // Add the user to contact
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUserId: userId,
        newContact: notification.body.from,
      }),
    });

    if (accept.status === 200) {
      await fetch("/api/notification/contact-request", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationID }),
      });
    }
  };

  const handleDecline = async () => {
    removeNotification(notificationID);
    await fetch("/api/notification/contact-request", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: notificationID }),
    });
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            {notification.body.photo ? (
              <Avatar>
                <ProfilePhoto publicId={notification.body.photo} />
              </Avatar>
            ) : (
              <Avatar />
            )}
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">{notification.body.title}</Typography>
            <Typography color="GrayText" variant="subtitle2">
              {notification.body.message}
            </Typography>
            {notification.body.eventName === "contact-requested" &&
              (!isAccepted ? (
                <Box sx={{ mt: 1 }}>
                  <Button
                    onClick={handleAccept}
                    size="small"
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={handleDecline}
                    size="small"
                    variant="outlined"
                  >
                    Decline
                  </Button>
                </Box>
              ) : (
                <Typography>Request Accepted</Typography>
              ))}
          </Box>
        </Stack>
        <Divider sx={{ my: 2 }} />
      </Box>
    </div>
  );
}

function GetNotifications({ userId, notificationsFromDB }) {
  const [notifications, setNotifications] = useState([...notificationsFromDB]);

  const removeNotification = (notificationID) => {
    setNotifications(
      notifications.filter((data) => {
        return data._id !== notificationID;
      })
    );
  };

  useEffect(() => {
    const channelSubscribe = pusherJS.subscribe(`contact-${userId}`);
    channelSubscribe.bind_global((eventName, data) => {
      console.log(eventName);
      if (!_.isEmpty(data)) {
        setNotifications([...notifications, { ...data.body }]);
      }
    });

    return () => {
      channelSubscribe.unbind;
      pusherJS.unsubscribe(`contact-${userId}`);
    };
  }, []);

  console.log(notifications);
  return (
    <Box>
      {notifications.length > 0 ? (
        notifications.map((data) => {
          return (
            <Notification
              key={data._id}
              notificationID={data._id}
              notification={data}
              userId={userId}
              removeNotification={removeNotification}
            />
          );
        })
      ) : (
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <NotificationsIcon htmlColor="GrayText" />
            <Typography color="GrayText" variant="body2">
              No new notifications
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default function Contacts({ userId }) {
  const { data, error, isLoading } = useSWR(
    "/api/notification/contacts",
    fetcher
  );
  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;

  return <GetNotifications userId={userId} notificationsFromDB={data} />;
}

import { useState, useEffect } from "react";
import { pusherJS } from "@/utils/pusher";
import { acceptedRequestNotifications } from "@/lib/api-lib/api-notifications";
import { Box, Typography, Button } from "@mui/material";

function Notification(props) {
  return (
    <>
      <Box sx={{p: 3}}>
        <Typography variant="subtitle2">{props.message}</Typography>
        <Button size="small" href={`/profile/${props.userId}`}>View profile</Button>
      </Box>
    </>
  );
}

export default function ContactAccepted({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    acceptedRequestNotifications().then((data) => setNotifications(data));
    const channel = pusherJS.subscribe(`notification-accepted-${userId}`);
    channel.bind("request-accepted", (data) => {
      setNotifications([...notifications, data]);
    });
    return () => {
      channel.unbind;
      pusherJS.unsubscribe(`notification-accepted-${userId}`);
    };
  }, [notifications]);
  return (
    <>
      {notifications.map((notification) => {
        return (
          <Notification
            key={notification._id}
            id={notification._id}
            message={notification.body.message}
            userId={notification.body.from}
          />
        );
      })}
    </>
  );
}

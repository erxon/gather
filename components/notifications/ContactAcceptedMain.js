import { useState, useEffect } from "react";
import { pusherJS } from "@/utils/pusher";
import { acceptedRequestNotifications } from "@/lib/api-lib/api-notifications";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { fetcher } from "@/lib/hooks";
import useSWR from 'swr'

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

function ContactAccepted({ userId, data }) {
  const [notifications, setNotifications] = useState([...data]);

  useEffect(() => {
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
export default function ContactAcceptedMain({userId}){
  const {data, error, isLoading} = useSWR('/api/notification/contactReqAccepted', fetcher)

  if (error) return <Typography>Something went wrong</Typography>
  if (isLoading) return <CircularProgress />
  return (
    <>
      <ContactAccepted data={data} userId={userId}/>
    </>
  )
}

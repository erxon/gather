import { useEffect, useState } from "react";
import { pusherJS} from "@/utils/pusher";
import { Box } from "@mui/material";
export default function ContactRequest({ userId }) {
  const [notifications, setNotifications] = useState([]);
  console.log(userId)
  useEffect(() => {
    const channel = pusherJS.subscribe(`notification-${userId}`);
    channel.bind(`contact-requested`, (data) => {
      setNotifications([...notifications, data]);
    });
    return () => {
      channel.unbind;
      pusherJS.unsubscribe("notification");
    };
  });
  console.log(notifications)
  return (
    <>
      <Box>
        <pre>{JSON.stringify(notifications, null, 2)}</pre>
      </Box>
    </>
  );
}

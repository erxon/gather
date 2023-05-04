//Display notifications from an event
//Retrieve past notifications from database
import { pusherJS } from "@/utils/pusher";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { removeNotification } from "@/utils/notificationClient";

function Notification(props) {
  //Handle removing of notification

  return (
    <>
      <Box sx={{ my: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircleNotificationsIcon />
            <Box>
              <Typography variant="body1">New report</Typography>
              <Typography variant="body2">
                {props.name}, {props.lastSeen}
              </Typography>
              <Typography variant="body2">{props.reporter}</Typography>
              <Stack
                sx={{ mt: 2 }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Button href={`/reports/${props.reportId}`} disableElevation size="small" variant="contained">
                  View
                </Button>
                <Button
                  onClick={() => {
                    props.onRemove(props.id);
                  }}
                  disableElevation
                  size="small"
                >
                  Dismiss
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    fetch("/api/notification/reports").then((response) => {
      response.json().then((data) => {
        setNotifications([...data]);
      });
    });
    const channel = pusherJS.subscribe("notification");
    channel.bind("new-report", (data) => {
      setNotifications([data, ...notifications]);
    });
    return () => {
      channel.unbind;
      pusherJS.unsubscribe("notification");
    };
  }, [notifications]);

  const handleDelete = async (id) => {
    setNotifications((prev) => {
      return prev.filter((obj) => {
        obj._id !== id;
      });
    });
    await removeNotification(id);
  };

  return (
    <>
      <Box>
        <pre>
          {notifications.map((object) => {
            return (
              <Notification
                name={`${object.firstName} ${object.lastName}`}
                lastSeen={object.lastSeen}
                reporter={object.reporter}
                id={object._id}
                key={object._id}
                reportId={object.reportId}
                onRemove={handleDelete}
              />
            );
          })}
        </pre>
      </Box>
    </>
  );
}

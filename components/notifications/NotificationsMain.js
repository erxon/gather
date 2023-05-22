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
import {
  removeNotification,
  getNotifications,
} from "@/lib/api-lib/api-notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

function Notification(props) {
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
                <Button
                  href={`/reports/${props.reportId}`}
                  disableElevation
                  size="small"
                  variant="contained"
                >
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

function Notifications(props) {
  const [notifications, setNotifications] = useState([...props.notifications]);

  useEffect(() => {
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
                name={`${object.body.firstName} ${object.body.lastName}`}
                lastSeen={object.body.lastSeen}
                reporter={object.body.reporter}
                id={object._id}
                key={object._id}
                reportId={object.body.reportId}
                onRemove={handleDelete}
              />
            );
          })}
        </pre>
      </Box>
    </>
  );
}

export default function NotificationsMain() {
  const { data, error, isLoading } = useSWR(
    "/api/notification/reports",
    fetcher
  );
  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;
  console.log(data);
  return (
    <>
      {data.length > 0 ? (
        <Notifications notifications={data} />
      ) : (
        <Typography color="GrayText" variant="body1">
          No new reports yet
        </Typography>
      )}
    </>
  );
}

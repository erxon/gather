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
import { removeNotification } from "@/lib/api-lib/api-notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { useRouter } from "next/router";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import QueryPhoto from "../photo/QueryPhoto";

export default function NotificationsMain() {
  const { data, error, isLoading } = useSWR(
    "/api/notification/reports",
    fetcher
  );

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

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
    setNotifications(
      notifications.filter((notification) => {
        return notification._id !== id;
      })
    );

    await removeNotification(id);
  };

  return (
    <>
      <Box>
        {notifications.reverse().map((object) => {
          return (
            <Notification
              name={`${object.body.firstName} ${object.body.lastName}`}
              lastSeen={object.body.lastSeen}
              reporter={object.body.reporter}
              id={object._id}
              key={object._id}
              reportId={object.body.reportId}
              photo={
                object.body.hasOwnProperty("photoUploaded")
                  ? object.body.photoUploaded
                  : null
              }
              type={object.type}
              createdAt={object.createdAt}
              onRemove={handleDelete}
            />
          );
        })}
      </Box>
    </>
  );
}

function DisplayPhoto({ id }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${id}`, fetcher);

  if (error) return <Typography>Error.</Typography>;
  if (isLoading) return <CircularProgress />;

  if (data) {
    return <QueryPhoto publicId={data.image} />;
  }
}

function Notification(props) {
  const router = useRouter();
  const date = new Date(props.createdAt);
  const elapsedTime = computeElapsedTime(date);

  return (
    <>
      <Box sx={{ my: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircleNotificationsIcon />
            <Box sx={{width: '100%'}}>
              <Typography sx={{fontWeight: "bold"}} variant="body1">New report</Typography>
              <Typography variant="body2">
                {props.name}, {props.lastSeen}
              </Typography>
              <Typography variant="body2">{props.reporter}</Typography>
              <Typography variant="subtitle2">{elapsedTime}</Typography>
              <Stack
                sx={{ mt: 2 }}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                {props.type === "report-manage" && (
                  <Button
                    onClick={() => {
                      router.push(`/reports/${props.reportId}`);
                    }}
                    disableElevation
                    size="small"
                    variant="contained"
                  >
                    View
                  </Button>
                )}
                {props.type === "upload-photo" && (
                  <Button
                    onClick={() => {
                      router.push(`/authority/matches/${props.photo}`);
                    }}
                    disableElevation
                    size="small"
                    variant="contained"
                  >
                    View
                  </Button>
                )}
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
            {props.photo && <DisplayPhoto id={props.photo} />}
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

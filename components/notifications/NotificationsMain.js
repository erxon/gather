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
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Avatar,
} from "@mui/material";

import { useEffect, useState } from "react";
import { removeNotification } from "@/lib/api-lib/api-notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { useRouter } from "next/router";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import QueryPhoto from "../photo/QueryPhoto";
import _ from "lodash";

export default function NotificationsMain({ user }) {
  const api =
    user.type === "authority"
      ? "/api/notification/authority/reports"
      : `/api/notification/citizen/${user._id}`;
  const { data, error, isLoading } = useSWR(api, fetcher);

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  const channel1 =
    user.type === "authority"
      ? "notification-authority"
      : "notification-citizen";
  const channel2 =
    user.type === "authority"
      ? `notification-authority-${user._id}`
      : `notification-citizen-${user._id}`;

  return (
    <div>
      {data.length > 0 ? (
        <Notifications
          notificationsFromDB={data}
          channel1={channel1}
          channel2={channel2}
        />
      ) : (
        <Typography color="GrayText" variant="body1">
          No new reports yet
        </Typography>
      )}
    </div>
  );
}

function Notifications(props) {
  const [notifications, setNotifications] = useState([
    ...props.notificationsFromDB,
  ]);

  useEffect(() => {
    const channel1 = pusherJS.subscribe(props.channel1);
    const channel2 = pusherJS.subscribe(props.channel2);
    pusherJS.bind_global((eventName, data) => {
      console.log(data);
      if (!_.isEmpty(data)) {
        setNotifications([data.body, ...notifications]);
      }
    });
    return () => {
      channel1.unbind;
      channel2.unbind;
      pusherJS.unsubscribe(props.channel1);
      pusherJS.unsubscribe(props.channel2);
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

  console.log(notifications);

  return (
    <>
      <Box sx={{ overflowY: "scroll", height: 500 }}>
        {notifications.reverse().map((object) => {
          return object.body.type === "match-found" ? (
            <NotificationMatchFound
              id={object._id}
              message={object.body.message}
              createdAt={object.createdAt}
              reportId={object.body.reportId}
              photoUploaded={object.body.photoUploaded}
              onRemove={handleDelete}
            />
          ) : (
            <Notification
              name={`${object.body.firstName} ${object.body.lastName}`}
              lastSeen={object.body.lastSeen}
              reporter={object.body.reporter}
              title={object.body.title}
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
  console.log(props.type);
  return (
    <>
      <Box sx={{ my: 2 }}>
        <Card>
          <CardHeader
            avatar={
              <Avatar>
                {props.name.charAt(0)}
              </Avatar>
            }
            title={props.title}
            subheader={`${
              props.name
            } ${elapsedTime}`}
          />

          {props.photo ? (
            <CardMedia
              sx={{
                height: 300,
                backgroundColor: "#ECEEEE",
                textAlign: "center",
              }}
            >
              <DisplayPhoto id={props.photo} />
            </CardMedia>
          ) : (
            <CardMedia
              component="img"
              image="/assets/placeholder.png"
              sx={{ height: 300 }}
            />
          )}

          <CardActions>
            <Stack
              sx={{ mt: 2 }}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {(props.type === "report-manage" ||
                props.type === "status-change") && (
                <Button
                  onClick={() => {
                    router.push(`/reports/${props.reportId}`);
                  }}
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
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

function NotificationMatchFound({
  id,
  message,
  createdAt,
  reportId,
  onRemove,
  photoUploaded,
}) {
  const elapsedTime = computeElapsedTime(createdAt);
  const router = useRouter();

  return (
    <Paper sx={{ my: 2, p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontWeight: "bold" }} variant="body1">
          Match found
        </Typography>
        <Typography color="GrayText" variant="subtitle2">
          {elapsedTime}
        </Typography>
      </Stack>
      <Typography sx={{ mb: 2 }} variant="body2">
        {message}
      </Typography>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          router.push(`/reporter/${photoUploaded}`);
        }}
      >
        View
      </Button>
      <Button
        onClick={() => {
          onRemove(id);
        }}
        disableElevation
        size="small"
      >
        Dismiss
      </Button>
    </Paper>
  );
}

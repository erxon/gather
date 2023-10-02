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
  CardContent,
  Pagination,
} from "@mui/material";

import { useEffect, useState } from "react";
import { removeNotification } from "@/lib/api-lib/api-notifications";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import { useRouter } from "next/router";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import QueryPhoto from "../photo/QueryPhoto";
import _ from "lodash";
import DialogFoundMissingPerson from "../reports/DialogFoundMissingPerson";

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
  const [page, setPage] = useState(1);

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
  }, [notifications, props.channel1, props.channel2]);

  const handleDelete = async (id) => {
    setNotifications(
      notifications.filter((notification) => {
        return notification._id !== id;
      })
    );

    await removeNotification(id);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  console.log(notifications.length);

  return (
    <>
      <Box>
        {notifications.length > 3 && (
          <Pagination
            page={page}
            onChange={handlePageChange}
            count={notifications.length - 2}
          />
        )}
        {notifications
          .reverse()
          .slice(page - 1, page + 2)
          .map((object) => {
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
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <DialogFoundMissingPerson
        reportId={props.reportId}
        photo={props.photo}
        reportLocation={props.reportLocation}
        open={openDialog}
        setOpen={setOpenDialog}
      />
      <Card sx={{ display: "flex", p: 2, my: 2 }} variant="outlined">
        {props.photo ? (
          <CardMedia
            sx={{
              height: 100,
              backgroundColor: "#ECEEEE",
            }}
          >
            <DisplayPhoto id={props.photo} />
          </CardMedia>
        ) : (
          <CardMedia
            component="img"
            image="/assets/placeholder.png"
            sx={{ height: 100, width: 100 }}
          />
        )}
        <Box>
          <CardContent>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.75 }}>
              {props.type === "upload-photo" && "Found missing person"}
              {props.type === "report-manage" && "New report"}
              {props.type === "status-change" && "New active report"}
            </Typography>
            <Typography variant="body2">
              Reported by{" "}
              <span style={{ fontWeight: "bold" }}>{props.name}</span>
            </Typography>
            <Typography color="GrayText" variant="body2">
              {elapsedTime}
            </Typography>
          </CardContent>
          <Stack sx={{ mt: 2 }} direction="row" spacing={1} alignItems="center">
            {(props.type === "report-manage" ||
              props.type === "status-change") && (
              <Button
                onClick={() => {
                  router.push(`/reports/${props.reportId}`);
                }}
                size="small"
              >
                View
              </Button>
            )}
            {props.type === "upload-photo" && (
              <Button onClick={handleOpenDialog} size="small">
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
      </Card>
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

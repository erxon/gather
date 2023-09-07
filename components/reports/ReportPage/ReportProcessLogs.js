import useSWR from "swr";
import { fetcher, useUser } from "@/lib/hooks";
import {
  CircularProgress,
  Stack,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import Image from "next/image";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";

function Changes({ oldState, changes }) {
  const isChanged = {
    status: oldState.status === changes.status,
    result: oldState.result === changes.result,
    state: oldState.state === changes.state,
  };
  const propChanged = {
    backgroundColor: "#3b801d",
    borderRadius: "5px",
    p: 0.5,
    mb: 0.5,
    color: "#ffffff",
  };
  return (
    <div>
      <Box sx={isChanged.status && propChanged}>
        <Typography variant="body2">Status: {changes.status}</Typography>
      </Box>
      <Box sx={isChanged.result && propChanged}>
        <Typography variant="body2">Result: {changes.result}</Typography>
      </Box>
      <Box sx={isChanged.state && propChanged}>
        <Typography variant="body2">State: {changes.state}</Typography>
      </Box>
    </div>
  );
}

function AssignedTo({ userId }) {
  const { data, isLoading, error } = useSWR(`/api/user/${userId}`, fetcher);

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="body2">
        Something went wrong fetching the user.
      </Typography>
    );

  return (
    <Paper sx={{ p: 1 }} variant="outlined">
      <Typography variant="body2" sx={{ fontSize: "12px", mb: 1 }}>
        Assigned to
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        {data.user.photo ? (
          <ProfilePhoto publicId={photo} />
        ) : (
          <Image
            src="/assets/placeholder.png"
            alt="Profile Photo Placeholder"
            style={{ borderRadius: "100%" }}
            width={32}
            height={32}
          />
        )}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {data.user.firstName} {data.user.lastName}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function Editor({ username, firstName, lastName, photo }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box>
          {photo ? (
            <ProfilePhoto publicId={photo} />
          ) : (
            <Image
              src="/assets/placeholder.png"
              alt="Profile Photo Placeholder"
              style={{ borderRadius: "100%" }}
              width={32}
              height={32}
            />
          )}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px" }}>
            {username}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function Log({
  userId,
  owner,
  createdAt,
  note,
  userType,
  changes,
  editor,
  oldState,
}) {
  const dateCreated = new Date(createdAt);
  const elapsedTime = computeElapsedTime(dateCreated);
  const checkViewer = () => {
    if (note.viewer === "all") {
      return true;
    } else if (note.viewer === "authority" && userType === "authority") {
      return true;
    } else if (note.viewer === "citizen" && userType === "citizen") {
      return true;
    } else if (note.viewer === "reporter" && userId === owner) {
      return true;
    } else if (note.viewer === "assigned" && userId === changes.assignedTo) {
      return true;
    } else {
      return false;
    }
  };

  const isViewer = checkViewer();

  return (
    <div>
      <Box sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Editor
            username={editor.username}
            firstName={editor.firstName}
            lastName={editor.lastName}
            photo={editor.photo}
          />
          <Typography sx={{ mt: 1, color: "GrayText" }} variant="body2">
            Report was edited {elapsedTime}
          </Typography>
        </Box>
        {isViewer && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {note.content}
            </Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Changes oldState={oldState} changes={changes} />
        </Box>
        <AssignedTo userId={changes.assignedTo} />
      </Box>
      <Divider />
    </div>
  );
}

export default function ReportProcessLogs({ report, reportId, user }) {
  //Fetch logs
  const { data, isLoading, error } = useSWR(
    `/api/reports/logs/report-logs/${reportId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;
  console.log(data)
  //Display logs
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Updates</Typography>
      {data.logs.map((log) => {
        const changes = JSON.parse(log.changes);
        const oldState = JSON.parse(log.oldState);
        console.log(log);

        return (
          <Log
            owner={report.account}
            userId={user._id}
            userType={user.type}
            createdAt={log.createdAt}
            note={log.note}
            editor={log.editor}
            oldState={oldState}
            changes={changes}
          />
        );
      })}
    </Paper>
  );
}

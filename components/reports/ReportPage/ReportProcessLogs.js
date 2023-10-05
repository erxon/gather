import useSWR from "swr";
import { fetcher, useUser } from "@/lib/hooks";
import {
  CircularProgress,
  Stack,
  Typography,
  Box,
  Paper,
  Divider,
  Avatar,
  Pagination,
  PaginationItem,
  Button,
} from "@mui/material";
import Image from "next/image";
import ProfilePhoto from "@/components/photo/ProfilePhoto";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function Changes({ oldState, changes }) {
  const isChanged = {
    status: oldState.status !== changes.status,
    result: oldState.result !== changes.result,
    state: oldState.state !== changes.state,
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
      <Stack direction="row" alignItems="center" spacing={2}>
        {data.user.photo ? (
          <ProfilePhoto publicId={data.user.photo} />
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
  logId,
  userId,
  owner,
  createdAt,
  note,
  userType,
  changes,
  editor,
  oldState,
  attachedDocument,
}) {
  const router = useRouter();
  const dateCreated = new Date(createdAt);
  const elapsedTime = computeElapsedTime(dateCreated);
  const checkViewer = () => {
    if (note.viewer === "all") {
      return true;
    } else if (
      userId === changes.assignedTo ||
      (note.viewer === "authority" && userType === "authority")
    ) {
      return true;
    } else if (
      userId === changes.assignedTo ||
      (note.viewer === "citizen" && userType === "citizen")
    ) {
      return true;
    } else if (
      userId === changes.assignedTo ||
      (note.viewer === "reporter" && userId === owner)
    ) {
      return true;
    } else if (note.viewer === "assigned" && userId === changes.assignedTo) {
      return true;
    } else {
      return false;
    }
  };

  const isViewer = checkViewer();

  const handleViewFile = async () => {
    const getFile = await fetch(
      `/api/reports/logs/report-logs/view-file/${logId}`
    );
    window.open(getFile.url);
  };
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
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {note.content}
            </Typography>
          </Box>
        )}
        <Box sx={{ mb: 2 }}>
          <Changes oldState={oldState} changes={changes} />
        </Box>
        {attachedDocument && (
          <Button
            sx={{ mb: 1 }}
            size="small"
            startIcon={<AttachFileIcon />}
            onClick={handleViewFile}
          >
            View attached file
          </Button>
        )}
        {changes.assignedTo && <AssignedTo userId={changes.assignedTo} />}
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
  const [page, setPage] = useState(1);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;
  //Display logs

  const logsToDisplay = data.logs.slice(page - 1, page + 1);
  const pages = Math.round(data.logs.length / 2);

  function handlePageChange(event, value) {
    setPage(value);
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Updates</Typography>
      <Pagination onChange={handlePageChange} page={page} count={pages} />
      {logsToDisplay.map((log) => {
        const changes = JSON.parse(log.changes);
        const oldState = JSON.parse(log.oldState);

        return (
          <Log
            key={log._id}
            logId={log._id}
            attachedDocument={log.attachedDocument && log.attachedDocument}
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

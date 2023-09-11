import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import Image from "next/image";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/lib/hooks";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CancelIcon from "@mui/icons-material/Cancel";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function NoteViewer({ viewer, setViewer }) {
  return (
    <FormControl sx={{ minWidth: 100 }} size="small">
      <InputLabel id="demo-simple-select-label">Viewer</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={viewer}
        label="Viewer"
        onChange={(event) => {
          setViewer(event.target.value);
        }}
      >
        <MenuItem value={"all"}>All</MenuItem>
        <MenuItem value={"authority"}>Authorities</MenuItem>
        <MenuItem value={"citizen"}>Citizens</MenuItem>
        <MenuItem value={"reporter"}>Reporter</MenuItem>
        <MenuItem value={"assigned"}>Assigned</MenuItem>
      </Select>
    </FormControl>
  );
}

function Assignment({ currentUser, users, assign, assignTo }) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="select_user">Assign to</InputLabel>
      <Select
        label="Assign to"
        labelId="select_user"
        value={assign}
        onChange={(event) => {
          assignTo(event.target.value);
        }}
      >
        {users
          .filter((user) => {
            return user.type === "authority";
          })
          .map((user) => {
            return (
              <MenuItem value={user._id}>
                <Typography>
                  {user.firstName} {user.lastName}
                  {user._id === currentUser._id && (
                    <span
                      style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                      }}
                    >
                      {" "}
                      you
                    </span>
                  )}
                </Typography>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}

function ReportProcessingMain({ currentUser, report, users }) {
  const [document, setDocument] = useState(); //File type .docx, .pdf, .doc
  const [assign, assignTo] = useState(currentUser._id);
  const [status, setStatus] = useState(report.status);
  const [result, setResult] = useState(report.result);
  const [stateWhenFound, setStateWhenFound] = useState(report.state);
  const [noteContent, setNoteContent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [viewer, setViewer] = useState("authority");

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          setSnackbar({
            open: false,
            message: "",
          });
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleFileChange = (event) => {
    if (event.target.files[0].size > 5000000) {
      console.log("file size exceeds 5mb");
      return;
    }
    setDocument(event.target.files[0]);
  };

  const handleFileCancel = () => {
    setDocument();
  };

  const handleNotes = (event) => {
    setNoteContent(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleResultChange = (event) => {
    setResult(event.target.value);
  };

  const handleStateWhenFound = (event) => {
    setStateWhenFound(event.target.value);
  };

  const handleSave = async () => {
    //Update report
    const updateReport = await fetch(`/api/reports/${report._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status,
        result: result,
        state: stateWhenFound,
        assignedTo: assign,
      }),
    });

    const updateReportResult = await updateReport.json();

    const createLog = await fetch("/api/reports/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: report._id,
        noteContent: noteContent,
        noteViewer: viewer,
        oldState: JSON.stringify({
          status: updateReportResult.data.status,
          result: updateReportResult.data.result,
          state: updateReportResult.data.state,
          assignedTo: updateReportResult.data.assignedTo,
        }),
        changes: JSON.stringify(updateReportResult.update),
      }),
    });

    if (document) {
      const createLogResult = await createLog.json();
      const { _id } = createLogResult.log;
      const logData = new FormData();

      logData.append("file", document);

      const uploadFile = await fetch(`/api/reports/file-upload/${_id}`, {
        method: "POST",
        body: logData,
      });

      if (uploadFile.status === 200) {
        setSnackbar({
          open: true,
          message: "File attached",
        });
      }
    }

    if (createLog.status === 200) {
      setSnackbar({
        open: true,
        message: "Updated successfully",
      });
      setNoteContent("");
      setStatus(updateReportResult.update.status);
      assignTo(updateReportResult.update.assignedTo);
      setResult(updateReportResult.update.result);
      setStateWhenFound(updateReportResult.update.state);
    } else {
      setSnackbar({
        open: true,
        message: "Something went wrong",
      });
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar({
            open: false,
            message: "",
          });
        }}
        message={snackbar.message}
        action={snackbarAction}
      />
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {/* User information */}
        <Box>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {currentUser.photo ? (
                <ProfilePhotoAvatar publicId={currentUser.photo} />
              ) : (
                <Image
                  style={{ borderRadius: "100%" }}
                  width="56"
                  height="56"
                  src="/assets/placeholder.png"
                />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography sx={{ mb: 1 }} variant="body2">
                  {currentUser.username}
                </Typography>
                <Chip label={currentUser.type} size="small" />
              </Box>
            </Stack>
          </Box>
        </Box>
        {/* Setting note viewer */}
        <Stack sx={{ mb: 1 }} direction="row" alignItems="center">
          <Typography sx={{ mr: 1 }} variant="body2">
            Who can view your note?
          </Typography>
          <NoteViewer viewer={viewer} setViewer={setViewer} />
        </Stack>
        {/* Notes */}
        <TextField
          sx={{ mb: 1 }}
          focused
          value={noteContent}
          onChange={handleNotes}
          fullWidth
          rows={4}
          multiline
          placeholder="Note"
        />

        {/*File attachment*/}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            disabled={document}
            component="label"
            startIcon={<AttachFileIcon />}
          >
            Attach document
            <input
              onChange={handleFileChange}
              hidden
              type="file"
              accept=".pdf, .docx, .doc"
            />
          </Button>
          {document && (
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <InsertDriveFileIcon />
                <Typography variant="body2">{document.name}</Typography>
                <Box>
                  <Tooltip title="cancel">
                    <IconButton
                      onClick={handleFileCancel}
                      color="secondary"
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Paper>
          )}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={3}>
            {/*Assigning*/}
            <Assignment
              assign={assign}
              assignTo={assignTo}
              users={users}
              currentUser={currentUser}
            />
            {/*Status*/}
            <FormControl size="small" fullWidth>
              <InputLabel id="set_status">Set status</InputLabel>
              <Select
                labelId="set_status"
                label="Set Status"
                value={status}
                onChange={handleStatusChange}
              >
                <MenuItem value={"pending"}>Pending</MenuItem>
                <MenuItem value={"under verification"}>
                  Under verification
                </MenuItem>
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"close"}>Close</MenuItem>
                <MenuItem value={"archive"}>Archive</MenuItem>
              </Select>
            </FormControl>
            {/*Result*/}
            {status === "close" && (
              <FormControl size="small" fullWidth>
                <InputLabel id="result">Result</InputLabel>
                <Select
                  labelId="result"
                  label="Result"
                  value={result}
                  onChange={handleResultChange}
                >
                  <MenuItem value={"found"}>Found</MenuItem>
                  <MenuItem value={"not found"}>Not Found</MenuItem>
                </Select>
              </FormControl>
            )}
            {/*State when found*/}
            {status === "close" && result === "found" && (
              <FormControl size="small" fullWidth>
                <InputLabel id="state_when_found">State when found</InputLabel>
                <Select
                  labelId="state_when_found"
                  label="State when found"
                  value={stateWhenFound}
                  onChange={handleStateWhenFound}
                >
                  <MenuItem value={"deceased"}>Deceased</MenuItem>
                  <MenuItem value={"alive"}>Alive</MenuItem>
                </Select>
              </FormControl>
            )}
            {/* Save */}
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Stack>
          {/*Search DB for existing reports*/}
          <Box>
            <Typography sx={{ mb: 1, mt: 1 }}>
              Search database for existing report.
            </Typography>
            <Button size="small" startIcon={<SearchIcon />} variant="contained">
              Search
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default function ReportProcessing({ currentUser, report }) {
  const { data, isLoading, error } = useSWR("/api/users", fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  return (
    <div>
      <ReportProcessingMain
        currentUser={currentUser}
        report={report}
        users={data.users}
      />
    </div>
  );
}

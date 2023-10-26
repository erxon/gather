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
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Avatar,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import useSWR from "swr";
import React, { useState } from "react";
import { fetcher } from "@/lib/hooks";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useRouter } from "next/router";

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
              <MenuItem key={user._id} value={user._id}>
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

function Editor({ id, setEditors, username, photo }) {
  const [mouseEnter, setMouseEnter] = useState(false);

  const handleRemove = () => {
    setEditors((prev) => {
      return [
        ...prev.filter((item) => {
          return item !== id;
        }),
      ];
    });
  };

  return (
    <Stack
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
      direction="row"
      alignItems="center"
      spacing={1}
    >
      {photo ? (
        <ProfilePhotoAvatar publicId={photo} />
      ) : (
        <Image
          src="/assets/placeholder.png"
          alt="placeholder image for profile photo"
          width={42}
          height={42}
          style={{ borderRadius: "100%" }}
        />
      )}
      <Typography variant="body2">{username}</Typography>
      <IconButton
        onClick={handleRemove}
        size="small"
        sx={{ visibility: !mouseEnter ? "hidden" : "visible" }}
      >
        <PersonRemoveIcon />
      </IconButton>
    </Stack>
  );
}

function SelectUser({
  currentUser,
  editors,
  users,
  open,
  setOpenDialog,
  setEditors,
}) {
  const handleSelect = (id) => {
    console.log(editors);
    if (!editors.includes(id)) {
      setEditors((prev) => {
        return [...prev, id];
      });
    }
    setOpenDialog(false);
  };

  return (
    <Dialog
      onClose={() => {
        setOpenDialog(false);
      }}
      open={open}
    >
      <List>
        {users
          .filter((user) => {
            return user._id !== currentUser._id;
          })
          .map((user) => {
            const { _id, type, firstName, lastName, photo } = user;
            return (
              <ListItem disableGutters key={_id}>
                <ListItemButton onClick={() => handleSelect(_id)}>
                  <ListItemAvatar>
                    {photo ? (
                      <ProfilePhotoAvatar publicId={photo} />
                    ) : (
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    secondary={type}
                    primary={`${firstName} ${lastName}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Dialog>
  );
}

function AddEditors({ currentUser, users, editors, setEditors }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => {
    setOpenDialog(true);
  };

  console.log(editors);

  return (
    <div>
      <SelectUser
        users={users}
        currentUser={currentUser}
        editors={editors}
        setEditors={setEditors}
        open={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <Paper sx={{ maxWidth: 300, my: 3, p: 1 }} variant="outlined">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Editors</Typography>
          <IconButton onClick={handleOpen} size="small">
            <AddIcon />
          </IconButton>
        </Stack>
        {editors.length > 0 ? (
          editors.map((editor) => {
            const user = users.find((user) => {
              return user._id === editor;
            });
            return (
              <Editor
                key={user._id}
                id={user._id}
                setEditors={setEditors}
                username={user.username}
                photo={user.photo}
              />
            );
          })
        ) : (
          <Typography variant="body2">No editors added yet</Typography>
        )}
      </Paper>
    </div>
  );
}

function FoundReport({ id, firstName, lastName, photo, setOpen }) {
  const router = useRouter();
  return (
    <ListItem>
      <ListItemButton
        onClick={() => {
          setOpen(false);
          router.push(`/reports/${id}`);
        }}
      >
        <ListItemAvatar>
          {photo ? (
            <ProfilePhotoAvatar publicId={photo} />
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText primary={`${firstName} ${lastName}`} />
      </ListItemButton>
    </ListItem>
  );
}

function SearchForExistingReport({ id, firstName, lastName, open, setOpen }) {
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [foundReports, setFoundReports] = useState([]);

  const handleSearch = async () => {
    setSearching(true);

    const searchReport = await fetch("/api/reports/search-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });

    const result = await searchReport.json();
    const filterResult = result.filter((report) => {
      return report._id !== id;
    });

    setSearching(false);
    if (filterResult.length === 0) {
      setMessage("No similar report found");
    } else {
      setMessage("Similar report found");
      setFoundReports(filterResult);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Search existing report</DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center" }}>
        <DialogContentText>
          <Typography>
            Search{" "}
            <span style={{ fontWeight: "bold" }}>
              {firstName} {lastName}
            </span>{" "}
            in database
          </Typography>
          {message !== "" && <Typography variant="body2">{message}</Typography>}
        </DialogContentText>
        {searching ? (
          <CircularProgress sx={{ ml: 1 }} size={24} />
        ) : (
          <IconButton onClick={handleSearch} color="primary" sx={{ ml: 1 }}>
            <SearchIcon />
          </IconButton>
        )}
      </DialogContent>
      {foundReports.length > 0 && (
        <List>
          {foundReports.map((report) => {
            return (
              <FoundReport
                key={report._id}
                id={report._id}
                firstName={report.firstName}
                lastName={report.lastName}
                photo={report.photo}
                setOpen={setOpen}
              />
            );
          })}
        </List>
      )}
      <DialogActions>
        <Button onClick={() => setOpen(false)}>close</Button>
      </DialogActions>
    </Dialog>
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
  const [editors, setEditors] = useState(
    report.editors ? [...report.editors] : []
  );
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

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
    if (event.target.files[0].size > 500000) {
      console.log("file size exceeds 500 kilobytes");
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
        editors: editors,
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
          editors: updateReportResult.data.editors,
        }),
        changes: JSON.stringify(updateReportResult.update),
      }),
    });

    //if there is a file attached
    if (document) {
      //Initialize file
      const createLogResult = await createLog.json();
      const { _id } = createLogResult.log;
      const logData = new FormData();

      logData.append("file", document);

      //Upload file
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
      setDocument();
    } else {
      setSnackbar({
        open: true,
        message: "Something went wrong",
      });
    }

    window.location.reload();
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
      <SearchForExistingReport
        id={report._id}
        firstName={report.firstName}
        lastName={report.lastName}
        open={openSearchDialog}
        setOpen={setOpenSearchDialog}
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
                  alt="placeholder image for profile photo"
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
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
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

          {/*Add editors*/}
          <AddEditors
            currentUser={currentUser}
            users={users}
            editors={editors}
            setEditors={setEditors}
          />

          {/*Search DB for existing reports*/}
          <Button
            onClick={() => setOpenSearchDialog(true)}
            size="small"
            startIcon={<SearchIcon />}
            variant="contained"
          >
            Search
          </Button>
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

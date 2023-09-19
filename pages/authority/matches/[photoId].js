import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  Divider,
  LinearProgress,
  Modal,
  Collapse,
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Snackbar,
} from "@mui/material";
import Image from "next/image";
import Authenticate from "@/utils/authority/Authenticate";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import ReportPhoto from "@/components/photo/ReportPhoto";

import IconTypography from "@/utils/layout/IconTypography";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StackRow from "@/utils/StackRow";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import StackRowLayout from "@/utils/StackRowLayout";
import SmallMap from "@/components/map/SmallMap";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import IconText from "@/utils/components/IconText";
import DisplaySnackbar from "@/components/DisplaySnackbar";

function DisplayModal({ handleClose, openModal, matchId, userId }) {
  const router = useRouter();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleConfirm = async () => {
    const confirm = await fetch("/api/face-recognition/verify-match", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: matchId, userId: userId }),
    });
    if (confirm.status === 200) {
      router.reload();
    }
  };

  return (
    <Modal open={openModal} handleClose={() => handleClose()}>
      <Box sx={style}>
        <Typography sx={{ fontWeight: "bold" }}>Match found</Typography>
        <Typography>Verify match, and notify reporter.</Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={handleConfirm}
            startIcon={<CheckIcon />}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Confirm
          </Button>
          <Button onClick={() => handleClose()} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

function DisplayReferencePhotos({ reportId, style }) {
  const { data, error, isLoading } = useSWR(
    `/api/photos/report/${reportId}`,
    fetcher
  );

  if (error)
    return (
      <Typography>Something went wrong fetching reference photos.</Typography>
    );
  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={style}>
      <Typography sx={{ my: 2, fontWeight: "bold" }} variant="body2">
        Reference Photos
      </Typography>
      {data.images.map((image) => {
        return (
          <ReportPhoto
            key={image._id}
            publicId={`report-photos/${image.publicId}`}
          />
        );
      })}
    </Box>
  );
}

function UpdateReportDialog({
  photoUploadedId,
  report,
  queryPhoto,
  open,
  setOpen,
  setSnackbarOpen,
}) {
  const [openNote, setOpenNote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const { data, isLoading, error } = useSWR(
    `/api/reporters/uploaded-photo/${photoUploadedId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  const reporter = data;
  const date = new Date(reporter.createdAt);
  const elapsedTime = computeElapsedTime(date);
  const reportDate = new Date(report.reportedAt);
  const elapsedTimeForReport = computeElapsedTime(reportDate);

  const updateReport = async (note) => {
    const response = await fetch(`/api/reports/update-and-log/${report._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporterId: reporter._id,
        match: photoUploadedId,
        status: "close",
        result: "found",
        state: "alive",
        noteContent: note,
        noteViewer: "all",
      }),
    });

    return response;
  };

  const handleConfirm = () => {
    setLoading(true);
    updateReport(note)
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200) {
          setSnackbarOpen({ open: true, message: result.message });
          setLoading(false);
          setOpen(false);
        }
      })
      .catch((error) => {
        setSnackbarOpen({ open: true, message: error.message });
        setLoading(false);
      });
  };

  const handleNote = (event) => {
    setNote(event.target.value);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Update this report</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            The missing person in this report is already found
          </Typography>
          {loading && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <CircularProgress size={24} />
              <Typography variant="body2">Updating report</Typography>
            </Stack>
          )}
        </DialogContentText>
        <Box>
          <Button
            onClick={() => setOpenNote(true)}
            startIcon={<AddIcon />}
            size="small"
          >
            Add note
          </Button>
          <Collapse in={openNote}>
            <TextField
              variant="standard"
              sx={{ mb: 2 }}
              placeholder="Note"
              onChange={handleNote}
              value={note}
              multiline
              fullWidth
            />
          </Collapse>
        </Box>
        {/* Matched Report Information */}
        <Paper sx={{ mb: 1, p: 2 }} variant="outlined">
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <Box>
              <ReportPhotoSmall publicId={report.photo} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: "bold" }}>
                {report.firstName} {report.lastName}
              </Typography>
              <Typography color="GrayText" variant="body2">
                Reported {elapsedTimeForReport}
              </Typography>
              {/* Current Status */}
              <Typography sx={{ mt: 1 }} variant="body2">
                Current Status
              </Typography>
              <Typography color="GrayText" variant="body2">
                {report.status}
              </Typography>
              <Typography color="GrayText" variant="body2">
                {report.result !== "undefined" && report.result}
              </Typography>
              <Typography color="GrayText" variant="body2">
                {report.state !== "undefined" && report.state}
              </Typography>
            </Box>
          </Stack>
        </Paper>
        {/* Reporter & Uploaded Photo Information */}
        <Paper sx={{ p: 2 }} variant="outlined">
          <Stack
            sx={{ mb: 1 }}
            direction="row"
            spacing={1}
            alignItems="flex-start"
          >
            <QueryPhoto publicId={queryPhoto} />
            <Box>
              <Typography variant="body2">
                This person is found by{" "}
                <span style={{ fontWeight: "bold" }}>
                  {reporter.firstName} {reporter.lastName}
                </span>{" "}
              </Typography>
              <Typography sx={{ mb: 1 }} variant="body2">
                {elapsedTime}
              </Typography>
              <IconText
                icon={<PhoneIcon fontSize="small" htmlColor="GrayText" />}
                text={reporter.contactNumber}
                textStyle={{ color: "GrayText" }}
              />
              <IconText
                icon={<EmailIcon fontSize="small" htmlColor="GrayText" />}
                text={reporter.email}
                textStyle={{ color: "GrayText" }}
              />
            </Box>
          </Stack>
          {/* <SmallMap
            lng={reporter.position.longitude}
            lat={reporter.position.latitude}
          /> */}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm}>Confirm</Button>
        <Button>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function FoundButton({ photoUploadedId, account, reportId, found }) {
  const [isFound, setFound] = useState(found);

  const handleMatchFoundClick = async () => {
    // const result = await fetch("/api/face-recognition/verify-match", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     photoUploadedId: photoUploadedId,
    //     userId: account,
    //     reportId: reportId,
    //   }),
    // });
    // const resultJson = await result.json();
    // console.log(resultJson);

    setFound(true);
  };

  return (
    <div>
      {!isFound ? (
        <Button onClick={handleMatchFoundClick} size="small" variant="outlined">
          this is a match
        </Button>
      ) : (
        <Alert severity="success">This missing person has been found.</Alert>
      )}
    </div>
  );
}

function DisplayReportDetails({
  photoUploadedId,
  queryPhoto,
  reportId,
  score,
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  const handleSnackbarClose = () => {
    setShowSnackbar({ open: false });
  };

  if (data) {
    return (
      <div>
        <UpdateReportDialog
          report={data}
          queryPhoto={queryPhoto}
          photoUploadedId={photoUploadedId}
          setOpen={setShowDialog}
          open={showDialog}
          setSnackbarOpen={setShowSnackbar}
        />
        {!showDialog && showSnackbar.open && (
          <DisplaySnackbar
            open={showSnackbar.open}
            message={showSnackbar.message}
            handleClose={() => handleSnackbarClose()}
          />
        )}
        <Box>
          <Card
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              alignItems: { xs: "center", md: "left" },
              mb: 3,
            }}
            variant="elevation"
          >
            <CardMedia sx={{ p: 2 }}>
              {data.photo ? (
                <ReportPhoto publicId={data.photo} />
              ) : (
                <Image
                  alt="placeholder"
                  src="/assets/placeholder.png"
                  width={150}
                  height={150}
                />
              )}
            </CardMedia>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {Math.round(score)}% Similarity
                </Typography>

                <Typography
                  sx={{ mb: 0.25, mt: 0.5, fontWeight: "bold" }}
                  variant="body1"
                >
                  {data.firstName} {data.lastName}
                </Typography>
                <IconTypography
                  customStyles={{ mb: 0.5 }}
                  Icon={<PlaceIcon color="disabled" />}
                  content={data.lastSeen}
                />
                <IconTypography
                  Icon={<PersonIcon color="disabled" />}
                  content={`${data.gender}, ${data.age}`}
                  customStyles={{ mb: 0.5 }}
                />
              </CardContent>
              <CardActions>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems="center"
                  spacing={1}
                >
                  <Button
                    sx={{ width: { xs: "100%", md: "75px" } }}
                    onClick={() => {
                      router.push(`/reports/${reportId}`);
                    }}
                    size="small"
                    variant="contained"
                  >
                    View
                  </Button>
                  {data.match && data.match === photoUploadedId ? (
                    <Typography color="primary">This is a match</Typography>
                  ) : (
                    <Button
                      onClick={() => setShowDialog(true)}
                      startIcon={<CheckCircleIcon />}
                    >
                      Match
                    </Button>
                  )}
                </Stack>
              </CardActions>
            </Box>
          </Card>
          {/* <Paper sx={{ mt: 1, p: 3 }}>
            <DisplayReferencePhotos style={{ mb: 2 }} reportId={reportId} />
          </Paper> */}
        </Box>
      </div>
    );
  }
}

function GetReport({ photoUploadedId, queryPhoto, score, reportId }) {
  return (
    <DisplayReportDetails
      photoUploadedId={photoUploadedId}
      queryPhoto={queryPhoto}
      reportId={reportId}
      score={score}
    />
  );
}

function FindMatches({ photoUploadedId, queryPhotoId }) {
  const router = useRouter();
  // resetting the search
  const [isReset, setReset] = useState(false);
  // search face
  const [isSearchPressed, searchButtonPressed] = useState(false);
  // Render past matches to avoid rematching
  const { data, error, isLoading, mutate } = useSWRImmutable(
    `/api/face-recognition/past-matches/${queryPhotoId}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  // Find match handler
  const handleFindMatch = async () => {
    searchButtonPressed(true);
    const getMatches = await fetch(`/api/imagga-face-recognition/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryPhoto: queryPhotoId }),
    });

    const result = await getMatches.json();
    mutate(result);
  };

  // Reset handler
  const handleReset = async (id) => {
    await fetch("/api/imagga-face-recognition/reset", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    mutate();
    searchButtonPressed(false);
  };

  // Reload handler
  const handleReload = async (id) => {
    setReset(true);
    const reload = await fetch("/api/imagga-face-recognition/reload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryPhoto: queryPhotoId, id: id }),
    });

    const result = await reload.json();
    console.log(result);
    mutate(result);
    setReset(false);
  };

  return (
    <Box>
      {data && (
        <Box sx={{ mb: 2 }}>
          <Button
            disabled={isReset}
            onClick={() => handleReset(data._id)}
            variant="outlined"
            size="small"
          >
            Clear
          </Button>
          <IconButton
            sx={{ ml: 1 }}
            disabled={isReset}
            onClick={() => {
              handleReload(data._id);
            }}
          >
            <RefreshIcon color="primary" />
          </IconButton>
        </Box>
      )}
      {isReset && <LinearProgress sx={{ mb: 1 }} />}
      {data && data.result.length > 0 ? (
        <div>
          {data.result.map((result) => {
            return (
              <GetReport
                queryPhoto={queryPhotoId}
                photoUploadedId={photoUploadedId}
                key={result.id}
                score={result.score}
                reportId={result.id}
              />
            );
          })}
        </div>
      ) : (
        <div>
          <Typography sx={{ mb: 1 }}>No matches found.</Typography>

          {!isSearchPressed ? (
            <Button
              startIcon={<SearchIcon />}
              variant="contained"
              onClick={handleFindMatch}
            >
              Search
            </Button>
          ) : (
            <div>
              <CircularProgress />
              <Typography>Please wait.</Typography>
            </div>
          )}
        </div>
      )}
    </Box>
  );

  // return <ReportCardHorizontal distance={"Distance: 10%"} />;
}

function RenderMatches({ queryPhotoId }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWRImmutable(
    `/api/photos/${queryPhotoId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    return (
      <Box>
        <StackRow styles={{ mb: 1 }}>
          <IconButton onClick={() => router.push("/authority/photos")}>
            <ArrowBackIcon />
          </IconButton>
          {/*Render matches*/}
          <Typography variant="h5">Matches</Typography>
        </StackRow>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography sx={{ mb: 1.5 }} variant="h6">
                Photo
              </Typography>
              {/*Display query photo*/}
              <Box
                sx={{
                  p: 1,
                  backgroundColor: "#F2F4F4",
                  textAlign: "center",
                  borderRadius: "10px",
                }}
              >
                <QueryPhoto publicId={data.image} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }} variant="outlined">
              {/*Render possible matches*/}
              <Typography sx={{ mb: 1.5 }} variant="h6">
                Possible matches
              </Typography>
              <FindMatches
                photoUploadedId={queryPhotoId}
                queryPhotoId={data.image}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default function Page() {
  const router = useRouter();
  const { photoId } = router.query;
  return (
    <Authenticate>
      <RenderMatches queryPhotoId={photoId} />
    </Authenticate>
  );
}

//Material UI Components
import {
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

//Material UI Icons
import SearchIcon from "@mui/icons-material/Search";

//Hooks
import { useState } from "react";

//Components
import UploadPhotoModal from "./UploadPhotoModal";

export default function ReportWithPhoto() {
  const [photo, setPhoto] = useState({
    src: "",
    file: {},
  });
  const [uploadData, setUploadData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  //Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({
      open: false,
      severity: "",
      message: "",
    });
  };

  const handleUploadImage = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <UploadPhotoModal
        open={openDialog}
        setOpen={setOpenDialog}
        photo={photo}
        setPhoto={setPhoto}
        uploadData={uploadData}
        setUploadData={setUploadData}
        setSnackbar={setSnackbar}
      />
      {/*Snackbar*/}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity}>{snackbar.message} </Alert>
      </Snackbar>
      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
      >
        {/*Report with Photo*/}
        <Stack
          sx={{
            height: 140,
          }}
          alignItems="flex-start"
        >
          <Stack spacing={1} alignItems="center" direction="row">
            <SearchIcon fontSize="medium" />
            <Typography variant="h5">Search</Typography>
          </Stack>
          <Typography sx={{ my: 1, height: "100%" }} variant="body1">
            Search for existing reports on our database.
          </Typography>
          <Button onClick={handleUploadImage}>Upload image</Button>
        </Stack>
      </Paper>
    </>
  );
}

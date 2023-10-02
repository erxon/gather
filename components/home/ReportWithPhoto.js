import {
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import styles from "@/public/style/home.module.css";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { uploadReportPhoto } from "@/lib/api-lib/api-reports";
import { useState } from "react";
import Router from "next/router";

function UploadPhotoModal({
  setPhoto,
  photo,
  open,
  setOpen,
  uploadData,
  setUploadData,
}) {
  const handleCancelImage = () => {
    setPhoto({
      src: "",
      file: {},
    });
  };

  const handleChange = (event) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setPhoto({
        src: onLoadEvent.target.result,
        file: event.target.files[0],
      });
      setUploadData(undefined);
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", photo.file);
    formData.append("upload_preset", "query-photos");

    //Upload photo to Cloudinary
    const cloudUpload = await uploadReportPhoto(formData);
    const publicId = cloudUpload.public_id.substring(13);

    //Upload photo to Database
    const setValues = {
      type: "query",
      image: publicId,
      fileName: photo.fileName,
    };
    const uploadToDatabase = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(setValues),
    });
    const newQueryPhoto = await uploadToDatabase.json();
    if (uploadToDatabase.status === 400) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Something went wrong",
      });
    } else {
      Router.push(`/reports/upload/${newQueryPhoto.data._id}`);
    }
  };
  const imageUploadBox = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Upload image</DialogTitle>
      <DialogContent>
        <form
          method="post"
          onChange={handleChange}
          onSubmit={handleImageSubmit}
        >
          {photo.src ? (
            <Paper variant="outlined" sx={imageUploadBox}>
              <Image width={150} height={150} alt="" src={photo.src} />
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{...imageUploadBox, width: 150}}>
              <IconButton component="label" color="primary">
                <AddPhotoAlternateIcon />
                <input
                  hidden
                  type="file"
                  name="file"
                  accept="image/jpeg, image/png"
                />
              </IconButton>
              <Typography variant="body2">Upload file here</Typography>
            </Paper>
          )}
          {photo.src && !uploadData && (
            <p>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0.75,
                }}
              >
                <Typography sx={{ width: "100%" }} variant="body2">
                  {photo.file.name}
                </Typography>
                <IconButton color="primary" type="submit">
                  <FileUploadIcon />
                </IconButton>
                <IconButton onClick={handleCancelImage} color="secondary">
                  <CancelOutlinedIcon />
                </IconButton>
              </Paper>
            </p>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

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
      />
      {/*Snackbar*/}
      <Snackbar open={snackbar.open} onClose={handleSnackbarClose}>
        <Alert severity={snackbar.severity} />
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
            height: 140
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

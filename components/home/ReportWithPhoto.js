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
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import styles from "@/public/style/home.module.css";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { uploadReportPhoto } from "@/lib/api-lib/api-reports";
import { useState } from "react";
import Router from "next/router";

export default function ReportWithPhoto() {
  const [photo, setPhoto] = useState({
    src: "",
    file: {},
  });
  const [uploadData, setUploadData] = useState();
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

  //Handle change in image element to display the preview
  //of the image before uploading
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
  

  //Handle uploading of an image
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

  const handleCancelImage = () => {

    console.log(photo);
    setPhoto({
      src: "",
      file: {}
    });
  };

  const imageUploadBox = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  };

  return (
    <>
      <Paper
        sx={{
          p: 3,
          mb: 3,
        }}
        elevation={2}
      >
        {/*Snackbar*/}
        <Snackbar open={snackbar.open} onClose={handleSnackbarClose}>
          <Alert severity={snackbar.severity} />
        </Snackbar>
        {/*Report with Photo*/}

        <form
          method="post"
          onChange={handleChange}
          onSubmit={handleImageSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack
                spacing={1}
                alignItems="center"
                direction="row"
                sx={{ marginBottom: "16px" }}
              >
                <Typography variant="h5">Report with Photo</Typography>
              </Stack>
              <Typography variant="body1">
                Report a missing person with only an image at hand.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              {photo.src ? (
                <Paper variant="outlined" sx={imageUploadBox}>
                  <Image width={150} height={150} alt="" src={photo.src} />
                </Paper>
              ) : (
                <Paper variant="outlined" sx={imageUploadBox}>
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
              {uploadData && (
                <code>
                  <pre>{JSON.stringify(uploadData, null, 2)}</pre>
                </code>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

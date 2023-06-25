import {
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import styles from "@/public/style/home.module.css";
import Image from "next/image";

import { useState } from "react";

export default function ReportWithPhoto() {
  const [photo, setPhoto] = useState({
    src: "",
    fileName: "",
    type: "",
    size: 0,
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
        fileName: event.target.files[0].name,
        type: event.target.files[0].type,
        size: event.target.files[0].size,
      });
      setUploadData(undefined);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  //Handle uploading of an image
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

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
              <Button
                startIcon={<AttachFileIcon />}
                sx={{ mt: 2 }}
                variant="contained"
                component="label"
                size="small"
              >
                Select file
                <input
                  hidden
                  type="file"
                  name="file"
                  accept="image/jpeg, image/png"
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {photo.src && (
                <div className={styles.imagecontainer}>
                  <Image width={150} height={150} alt="" src={photo.src} />
                </div>
              )}
              {photo.src && !uploadData && (
                <p>
                  <Button
                    startIcon={<FileUploadIcon />}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    upload files
                  </Button>
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

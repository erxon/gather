import Router from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Data from "@/components/Data";
import styles from "../public/style/home.module.css";

import { createReport, uploadReportPhoto } from "@/lib/api-lib/api-reports";
import Image from "next/image";

const ReportToManage = () => {
  const [gender, setGender] = useState("");
  //Handle submission of Report and Manage form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      lastSeen: e.currentTarget.lastSeen.value,
      age: e.currentTarget.age.value,
      gender: gender,
      status: "pending",
    };
    //Create new report
    const data = await createReport(body);

    if (data) {
      Router.push(`/reports/create-account/${data.data._id}`);
    }
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5">Report and manage</Typography>
        <Typography sx={{ my: 2 }} variant="body1">
          Manage, and keep updated on the report you have filed.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack sx={{ mb: 3 }} direction="row" spacing={1} alignItems="center">
            <TextField
              id="age"
              label="Age"
              name="age"
              variant="outlined"
              type="text"
              size="small"
              required
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                value={gender}
                label="Gender"
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Stack sx={{ mb: 2 }} direction="row" spacing={1} alignItems="center">
            {/*First name*/}
            <TextField
              id="firstName"
              label="First Name"
              variant="outlined"
              name="firstName"
              type="text"
              size="small"
              fullWidth
              required
            />
            {/*Last name*/}
            <TextField
              id="lastName"
              label="Last Name"
              variant="outlined"
              name="lastName"
              type="text"
              size="small"
              fullWidth
              required
            />
          </Stack>
          {/*Last seen*/}
          <TextField
            id="lastSeen"
            label="Last Seen"
            variant="outlined"
            name="lastSeen"
            type="text"
            size="small"
            fullWidth
            required
          />
          <Button
            startIcon={<ArticleIcon />}
            size="small"
            sx={{ my: 2 }}
            type="submit"
            variant="contained"
          >
            Report
          </Button>
        </form>
      </Paper>
    </>
  );
};

const ReportWithPhoto = () => {
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
    const publicId = cloudUpload.public_id.substring(13)

    //Upload photo to Database
    const setValues = {
      type: 'query',
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
                <input hidden type="file" name="file" accept="image/jpeg, image/png" />
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
};

const DisplayData = () => {
  return (
    <>
      <Box>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography sx={{ mb: 3 }} variant="h5">
            Data
          </Typography>
          <Data />
        </Paper>
      </Box>
    </>
  );
};

export default function HomePage() {
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {/*ReportWithPhoto*/}
            <ReportWithPhoto />
            {/*Report and manage*/}
            <ReportToManage />
          </Grid>
          <Grid item xs={12} md={4}>
            {/*Data*/}
            <DisplayData />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

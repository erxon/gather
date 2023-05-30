import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import {
  Chip,
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

//Icons
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import ReportPhoto from "@/components/photo/ReportPhoto";
import { sendNotification } from "@/lib/api-lib/api-notifications";
import {
  getSingleReport,
  updateReportOnSignup,
  uploadReportPhoto,
} from "@/lib/api-lib/api-reports";
import Image from "next/image";
//Signup user
//Update the report

function UploadPhoto({ mpName, reportId, getPhotoId }) {
  const uploadToDatabase = async (photoData) => {
    const uploadedPhoto = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photoData),
    });
    return uploadedPhoto;
  };

  const generateAlertContent = (status, message) => {
    if (status === 400) {
      return {
        open: true,
        severity: "error",
        message: message,
      };
    } else if (status === 200) {
      return {
        open: true,
        severity: "success",
        message: message,
      };
    }
  };

  const [photo, setPhoto] = useState({
    src: "",
    fileName: "",
    type: "",
    size: 0,
  });

  //Snackbar, for feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [uploaded, isUploaded] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, severity: "", message: "" });
  };

  //Display Photo
  const handleChange = (event) => {
    //Include validation
    //if the size of the photo exceeds 100000, return a message
    if (event.target.files[0].size > 100000) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "The file exceeds 100mb",
      });
      return;
    } else {
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        setPhoto({
          src: onLoadEvent.target.result,
          fileName: event.target.files[0].name,
          type: event.target.files[0].type,
          size: event.target.files[0].size,
        });
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let snackbarContent = {};

    //Upload photo to Cloudinary
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "report-photos");

    const data = await uploadReportPhoto(formData);
    const publicId = data.public_id.substring(14, 34);

    //Save photo to Photo database
    const photoData = {
      publicId: publicId,
      reportId: reportId,
      fileName: photo.fileName,
      mpName: mpName,
    };

    //Store response message
    const upload = await uploadToDatabase(photoData);
    const newPhoto = await upload.json();

    snackbarContent = generateAlertContent(upload.status, newPhoto.message);

    setSnackbar(snackbarContent);
    isUploaded(true);
    // Link the photo to report
    getPhotoId(newPhoto.data._id);
    // setSnackbar(snackbarContent)
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      {/*Snackbar*/}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Typography variant="body1" sx={{ mb: 2 }} fontWeight={500}>
        Missing person photo
      </Typography>

      {/*Display photo preview before upload*/}
      {photo.src !== "" && (
        <Box>
          <Box
            sx={{
              borderRadius: "10px",
              border: "0.5px solid grey",
              width: 150,
              height: 150,
            }}
          >
            <Image
              style={{ objectFit: "contain" }}
              src={photo.src}
              width={150}
              height={150}
              alt={photo.fileName}
            />
          </Box>
          <Typography variant="subtitle1" color="secondary">
            {photo.fileName}
          </Typography>
        </Box>
      )}

      {/* If the photo is already uploaded, remove the form */}
      {!uploaded ? (
        <form onChange={handleChange} onSubmit={handleSubmit}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              startIcon={<AttachFileIcon />}
              component="label"
              size="small"
              variant="contained"
            >
              Select file
              <input
                hidden
                type="file"
                name="file"
                accept="image/png, image/jpeg"
              />
            </Button>
            {photo.src !== "" && (
              <Button type="submit" size="small" variant="contained">
                Upload
              </Button>
            )}
          </Stack>
        </form>
      ) : (
        <Typography variant="body1" sx={{ mt: 2.5 }} color="secondary">
          Photo is already uploaded
        </Typography>
      )}
    </Paper>
  );
}

function Report({ data }) {
  const reportedAt = new Date(data.reportedAt);
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography fontWeight={500} variant="body1" sx={{ mb: 2 }}>
        Your report
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            sx={{ mb: 0.5 }}
            color="secondary"
          >
            This report will be verified by authorities.
          </Typography>
          <Chip
            size="small"
            color="secondary"
            variant="filled"
            label={data.status}
          />
        </Box>
        <Box>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceIcon />
              <Typography variant="body1">{data.lastSeen}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon />
              <Typography variant="body2">
                {data.gender}, {data.age} years old
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon />
              <Typography variant="body2">
                {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function CreateAccount({ data }) {
  //Initialize user using useUser hook
  const [user, { mutate }] = useUser();
  //Control input fields
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [photoId, setPhotoId] = useState(null);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //Handle submit for signup and report update.
  const handleSubmit = async () => {
    //Signup the user first
    const registerUser = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        type: "citizen",
      }),
    });
    //Get the data
    const newUser = await registerUser.json();

    //If the res.status is 201, add the username and account of the user in the report
    if (registerUser.status === 201) {
      //update report (Add try catch)
      await updateReportOnSignup(data._id, {
        photoId: photoId,
        username: newUser.username,
        account: newUser.userId,
      });

      //send notification to the Notifications dashboard (Add try catch)
      await sendNotification({
        firstName: data.firstName,
        lastName: data.lastName,
        lastSeen: data.lastSeen,
        reportId: data._id,
        reporter: newUser.username,
      });
      //Update user

      mutate(newUser);
      // Router.push(`/reports/edit/${response.data._id}`)
    }
  };

  //if the user is authenticated, redirect to "/myreport" page
  useEffect(() => {
    if (user) {
      Router.push("/myreport");
    }
  }, [user]);

  return (
    <>
      <Box sx={{ margin: "auto", width: { xs: "100%", md: "50%" } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Create your account</Typography>
        </Box>

        {data.photo ? (
          <ReportPhoto publicId={data.photo} />
        ) : (
          <Report data={data} />
        )}
        {/*Upload photo*/}
        <UploadPhoto
          mpName={`${data.firstName} ${data.lastName}`}
          reportId={data._id}
          getPhotoId={setPhotoId}
        />
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography sx={{ mb: 2 }} variant="h6">
            Signup
          </Typography>
          <TextField
            variant="outlined"
            label="username"
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            required
            fullWidth
          />
          <br />
          <TextField
            margin="dense"
            variant="outlined"
            label="email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <br />
          <TextField
            margin="dense"
            variant="outlined"
            label="password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <br />
          <Button
            sx={{ mt: 2 }}
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Signup
          </Button>
        </Paper>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { rid } = context.params;
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
}

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
  CircularProgress,
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
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
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

  const [photos, setPhotos] = useState([]);
  const [isDisabled, disableButton] = useState({
    photo1: false,
    photo2: false,
    photo3: false,
  });

  //Snackbar, for feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [uploaded, isUploaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, severity: "", message: "" });
  };

  //Display Photo
  const handleChange = (event) => {
    console.log(event.target.files[0]);

    //Include validation
    //if the size of the photo exceeds 100000, return a message
    if (event.target.files[0].size > 10000000) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "The file exceeds 100mb",
      });
      return;
    } else {
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        setPhotos([
          ...photos,
          {
            [event.target.name]: onLoadEvent.target.result,
            fileName: event.target.files[0].name,
          },
        ]);
      };
      disableButton({ ...isDisabled, [event.target.name]: true });

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let snackbarContent = {};
    let uploadedPhotos = [];

    //Upload photo to Cloudinary
    const form = event.currentTarget;

    for (let i = 0; i < 3; i++) {
      for (const file of form.elements[i].files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "report-photos");
        const data = await uploadReportPhoto(formData);
        uploadedPhotos.push({
          publicId: data.public_id.substring(14, 34),
          fileName: file.name,
        });
      }
    }

    //Save photo to Photo database
    const photosData = {
      images: [...uploadedPhotos],
      type: "reference",
      reportId: reportId,
      missingPerson: mpName,
    };

    // //Store response message
    const upload = await uploadToDatabase(photosData);
    const newPhotos = await upload.json();

    snackbarContent = generateAlertContent(upload.status, newPhotos.message);

    setSnackbar(snackbarContent);
    isUploaded(true);
    setLoading(false);
    // Link the photo to report
    getPhotoId(newPhotos.data._id);
    setSnackbar(snackbarContent);
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

      {/* If the photo is already uploaded, remove the form */}
      {!uploaded ? (
        <form onChange={handleChange} onSubmit={handleSubmit}>
          <Stack direction="column" alignItems="left" spacing={1}>
            <Button
              disabled={isDisabled.photo1}
              startIcon={<AttachFileIcon />}
              component="label"
              size="small"
              variant="contained"
            >
              Select Image 1
              <input
                hidden
                type="file"
                name="photo1"
                accept="image/png image/jpeg"
              />
            </Button>
            <Button
              disabled={isDisabled.photo2}
              startIcon={<AttachFileIcon />}
              component="label"
              size="small"
              variant="contained"
            >
              Select Image 2
              <input
                hidden
                type="file"
                name="photo2"
                accept="image/png image/jpeg"
              />
            </Button>
            <Button
              disabled={isDisabled.photo3}
              startIcon={<AttachFileIcon />}
              component="label"
              size="small"
              variant="contained"
            >
              Select Image 3
              <input
                hidden
                type="file"
                name="photo3"
                accept="image/png image/jpeg"
              />
            </Button>
            {photos.length === 3 &&
              (!isLoading ? (
                <Button type="submit" size="small" variant="contained">
                  Upload
                </Button>
              ) : (
                <div>
                  <Stack
                    direction="row"
                    justifyItems="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <CircularProgress />
                    <Typography color="GrayText">Uploading</Typography>
                  </Stack>
                </div>
              ))}
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
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [photoId, setPhotoId] = useState(null);
  const [isSubmitted, setSubmissionState] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //Handle submit for signup and report update.
  const handleSubmit = async () => {
    //Signup the user first
    setSubmissionState(true);
    const registerUser = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        type: "citizen",
        status: "unverified",
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
          <Stack sx={{ mb: 2 }} spacing={1} direction="row">
            <TextFieldWithValidation
              label="First name"
              type="text"
              name="firstName"
              value={values.firstName}
              isFullWidth={true}
              changeHandler={handleChange}
              isSubmitted={isSubmitted}
            />
            <TextFieldWithValidation
              label="Last name"
              type="text"
              name="lastName"
              value={values.lastName}
              isFullWidth={true}
              changeHandler={handleChange}
              isSubmitted={isSubmitted}
            />
          </Stack>
          <TextFieldWithValidation
            style={{ mb: 2 }}
            label="username"
            type="text"
            name="username"
            value={values.username}
            changeHandler={handleChange}
            isFullWidth={true}
            isSubmitted={isSubmitted}
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            label="email"
            type="email"
            name="email"
            value={values.email}
            changeHandler={handleChange}
            isFullWidth={true}
            isSubmitted={isSubmitted}
          />
          <TextFieldWithValidation
            style={{ mb: 2 }}
            label="password"
            type="password"
            name="password"
            value={values.password}
            changeHandler={handleChange}
            isFullWidth={true}
            isSubmitted={isSubmitted}
          />
          <Button sx={{ mt: 2 }} variant="contained" onClick={handleSubmit}>
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

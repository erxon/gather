import Router, { useRouter } from "next/router";
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
  Avatar,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import PeopleIcon from "@mui/icons-material/People";
import styles from "../public/style/home.module.css";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

import { createReport, uploadReportPhoto } from "@/lib/api-lib/api-reports";
import Image from "next/image";
import ReportPhoto from "@/components/photo/ReportPhoto";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import ErrorAlert from "@/components/ErrorAlert";

const ReportToManage = () => {
  const [gender, setGender] = useState("");
  const [isSubmitted, setSubissionState] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    lastSeen: "",
    details: "",
    age: "",
  });

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };
  //Handle submission of Report and Manage form
  const handleSubmit = async () => {
    setSubissionState(true);
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.age === "" ||
      values.lastSeen === "" ||
      values.details === ""
    ) {
      setAlert({ open: true, message: "Please fill all the required fields." });
      return;
    }
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      lastSeen: values.lastSeen,
      age: values.age,
      details: values.details,
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
        <Stack sx={{ mb: 3 }} direction="row" spacing={1}>
          <TextFieldWithValidation
            id="age"
            label="Age"
            name="age"
            variant="outlined"
            type="text"
            size="small"
            isSubmitted={isSubmitted}
            value={values.age}
            changeHandler={handleChange}
          />
          <FormControl sx={{ minWidth: 120 }}>
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
        <Stack sx={{ mb: 2 }} direction="row" spacing={1}>
          {/*First name*/}
          <TextFieldWithValidation
            id="firstName"
            label="First Name"
            variant="outlined"
            name="firstName"
            type="text"
            isSubmitted={isSubmitted}
            value={values.firstName}
            isFullWidth={true}
            changeHandler={handleChange}
          />
          {/*Last name*/}
          <TextFieldWithValidation
            id="lastName"
            label="Last Name"
            variant="outlined"
            name="lastName"
            type="text"
            size="small"
            isSubmitted={isSubmitted}
            value={values.lastName}
            isFullWidth={true}
            changeHandler={handleChange}
          />
        </Stack>
        {/*Last seen*/}
        <TextFieldWithValidation
          id="lastSeen"
          label="Last Seen"
          variant="outlined"
          name="lastSeen"
          type="text"
          size="small"
          style={{ mb: 1 }}
          isSubmitted={isSubmitted}
          value={values.lastSeen}
          isFullWidth={true}
          changeHandler={handleChange}
        />
        <Typography sx={{ my: 1 }} color="GrayText">
          Please state as much details as needed for your report. Adequate
          information will help investigators or authorities find the person.
        </Typography>
        <TextFieldWithValidation
          id="details"
          label="Details"
          variant="outlined"
          name="details"
          type="text"
          style={{ mb: 1 }}
          isSubmitted={isSubmitted}
          value={values.details}
          isFullWidth={true}
          isMultiline={true}
          rows={4}
          changeHandler={handleChange}
        />
        <ErrorAlert
          open={alert.open}
          message={alert.message}
          close={() => setAlert({ open: false })}
        />
        <Button
          startIcon={<ArticleIcon />}
          size="small"
          sx={{ my: 2 }}
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        >
          Report
        </Button>
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
    severity: "error",
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
                disabled={!!photo.src}
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
                  <Image
                    width={150}
                    height={150}
                    alt=""
                    style={{ objectFit: "cover" }}
                    src={photo.src}
                  />
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

function Report({ reportId, photo, name, lastSeen, gender, age }) {
  const router = useRouter();
  return (
    <Card
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      variant="outlined"
    >
      {photo ? (
        <ReportPhoto publicId={photo} />
      ) : (
        <Image width={100} height={100} src="/assets/placeholder.png" />
      )}
      <Box>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {name}
          </Typography>
          <Typography variant="body2">Last seen in {lastSeen}</Typography>
          <Typography variant="body2">
            {gender}, {age}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            onClick={() => {
              router.push(`/reports/${reportId}`);
            }}
            variant="outlined"
          >
            View
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}

function Reports() {
  const { data, error, isLoading } = useSWR(
    "/api/reports/status/active",
    fetcher
  );

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading) return <CircularProgress />;
  console.log(data);
  return (
    <Paper sx={{ p: 3, mt: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Recent reports
      </Typography>
      {data.activeReports.length > 0 ? (
        data.activeReports.map((report) => {
          return (
            <Report
              key={report._id}
              reportId={report._id}
              name={`${report.firstName} ${report.lastName}`}
              photo={report.photo}
              lastSeen={report.lastSeen}
              gender={report.gender}
              age={report.age}
            />
          );
        })
      ) : (
        <Typography color="GrayText">No active reports yet.</Typography>
      )}
    </Paper>
  );
}

export default function HomePage() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 2,
              borderRadius: "20px",
              backgroundColor: "#F2F4F4",
            }}
          >
            <Typography variant="h3">GATHER</Typography>
            <Box sx={{ my: 1, width: { xs: "75%", md: "50%" } }}>
              <Typography sx={{ mb: 1 }} variant="body1" color="secondary">
                Gather is a platform where citizens and authorities could
                collaborate to find missing people in the community.
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body1"
                color="primary"
              >
                Manage. Disseminate. Communicate. Locate.
              </Typography>
            </Box>
            {/*ReportWithPhoto*/}
            <ReportWithPhoto />
            {/*Report and manage*/}
            <ReportToManage />
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography sx={{ mb: 2 }} variant="h4">
              Help us bring missing people to their home.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Stack
                    sx={{ mb: 1 }}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <LocalPoliceIcon color="primary" />
                    <Typography variant="h5" color="primary">
                      For Authorities
                    </Typography>
                  </Stack>
                  <Typography variant="body1">
                    Your information will be verified by the administrator.
                    Prepare your credentials to be verified.
                  </Typography>
                  <Button
                    href="/signup/authority"
                    sx={{ mt: 2 }}
                    disableElevation
                    variant="contained"
                  >
                    Create Account
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Stack
                    sx={{ mb: 1 }}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <PeopleIcon color="primary" />
                    <Typography variant="h5" color="primary">
                      For Concerned Citizens
                    </Typography>
                  </Stack>
                  <Typography variant="body1">
                    If you are an individual or organization who wants to Help
                    find missing people.
                  </Typography>
                  <Button
                    href="/signup/citizen"
                    sx={{ mt: 2 }}
                    disableElevation
                    variant="contained"
                  >
                    Create Account
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/*Reports */}
        <Grid item xs={12} md={4}>
          <Reports />
        </Grid>
      </Grid>
    </div>
  );
}

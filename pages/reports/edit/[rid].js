import {
  TextField,
  Typography,
  Button,
  Box,
  Stack,
  InputAdornment,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
  Grid,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";

import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import {
  getSingleReport,
  updateReport,
  uploadReportPhoto,
} from "@/lib/api-lib/api-reports";

export default function EditReport({ data }) {
  const [user, { loading }] = useUser();
  const [image, setImage] = useState({ renderImage: "", file: null });
  const [status, setStatus] = useState(data.status);
  //for snackbar
  const [snackbarValues, setSnackbarValues] = useState({
    open: false,
    message: "",
  });
  const [body, setBody] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    lastSeen: data.lastSeen,
    age: data.age,
    gender: data.gender,
    email: data.email,
    contactNumber: data.contactNumber,
    photo: data.photo,
  });
  const [features, setFeatures] = useState([...data.features]);
  const [value, setValue] = useState({
    facebook: Object.hasOwn(data, "socialMediaAccounts")
      ? data.socialMediaAccounts.facebook
      : "",
    twitter: Object.hasOwn(data, "socialMediaAccounts")
      ? data.socialMediaAccounts.twitter
      : "",
    feature: "",
  });

  if (!user) {
    return <CircularProgress />;
  }

  //Snackbar
  const handleClose = () => {
    setSnackbarValues((prev) => {
      return { ...prev, open: false };
    });
  };

  //Image
  const handleChange = (event) => {
    setImage({
      renderImage: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0],
    });
  };

  //Status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  //Features
  const handleDeleteFeatures = (feature) => {
    setFeatures((prev) => {
      return prev.filter((item) => {
        return item !== feature;
      });
    });
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValue((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleFormChange = (e) => {
    const { value, name } = e.target;
    setBody((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleInputSubmit = (typeOfInput) => {
    if (typeOfInput === "account") {
      setAccounts((prev) => {
        return [...prev, value.account];
      });
    } else if (typeOfInput === "features") {
      setFeatures((prev) => {
        return [...prev, value.feature];
      });
    }

    setValue({
      account: "",
      feature: "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    //Upload photo to cloud
    //Add the public id to photo property in update
    if (image.file) {
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("upload_preset", "report-photos");
      //Upload photo
      const photoUpload = await uploadReportPhoto(formData);

      body.photo = photoUpload.public_id;
    }

    const update = {
      ...body,
      updatedBy: user._id,
      updatedAt: new Date(),
      status: status,
      socialMediaAccounts: { facebook: value.facebook, twitter: value.twitter },
      features: [...features],
    };
    //update report
    const message = await updateReport(data._id, update);
    setSnackbarValues({ open: true, message: message.message });
  };
  const actions = (
    <React.Fragment>
      <Button
        href={`/reports/${data._id}`}
        color="secondary"
        size="small"
        onClick={handleClose}
      >
        BACK
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const reportedDateAndTime = `${new Date(
    data.reportedAt
  ).toDateString()} ${new Date(data.reportedAt).toLocaleTimeString()}`;
  const updatedDateAndTime = data.updatedAt
    ? `${new Date(data.updatedAt).toDateString()} ${new Date(
        data.updatedAt
      ).toLocaleTimeString()}`
    : null;

  return (
    <>
      <div>
        <Snackbar
          open={snackbarValues.open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackbarValues.message}
          action={actions}
        />
        <form onSubmit={handleFormSubmit}>
          <Typography variant="h5">Report</Typography>
          <Box sx={{ my: 2 }}>
            <Typography variant="body2">
              Reported missing on <strong>{reportedDateAndTime}</strong>
            </Typography>
            {updatedDateAndTime && (
              <Typography variant="body2">
                Report updated on <strong>{updatedDateAndTime}</strong>
              </Typography>
            )}
          </Box>
          {user && user.type === "authority" && (
            <Box sx={{ my: 3, width: "300px" }}>
              <FormControl fullWidth>
                <InputLabel>Set Status</InputLabel>
                <Select
                  value={status}
                  label="Set Status"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {/*Save button*/}
          <Button
            sx={{ mb: 3 }}
            size="small"
            variant="contained"
            onClick={handleFormSubmit}
          >
            Save
          </Button>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography sx={{ mb: 2 }} variant="h6">
                  Photo
                </Typography>
                {data.photo ? (
                  <ReportPhoto publicId={data.photo} />
                ) : (
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    src={
                      image.renderImage === ""
                        ? "/assets/placeholder.png"
                        : image.renderImage
                    }
                  />
                )}
                <br />
                <br />
                <Stack direction="row" spacing={1}>
                  <Button component="label" size="small" variant="outlined">
                    Choose File
                    <input hidden type="file" onChange={handleChange} />
                  </Button>
                </Stack>
                {/*Image file name*/}
                {image.file && <Typography>{image.file.name}</Typography>}
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography sx={{ mb: 2 }} variant="h6">
                  Basic Information
                </Typography>
                <Stack
                  sx={{ mb: 2 }}
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                >
                  <TextField
                    fullWidth
                    label="First name"
                    onChange={handleFormChange}
                    value={body.firstName}
                    id="firstName"
                    name="firstName"
                    type="text"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Last name"
                    onChange={handleFormChange}
                    value={body.lastName}
                    id="lastName"
                    name="lastName"
                    type="text"
                    variant="outlined"
                  />
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Age"
                    onChange={handleFormChange}
                    value={body.age}
                    id="age"
                    name="age"
                    type="age"
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Gender"
                    onChange={handleFormChange}
                    value={body.gender}
                    id="gender"
                    name="gender"
                    type="text"
                    variant="outlined"
                  />
                </Stack>
                <TextField
                  sx={{ mt: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  label="Last seen"
                  onChange={handleFormChange}
                  value={body.lastSeen}
                  id="lastSeen"
                  name="lastSeen"
                  type="text"
                  variant="outlined"
                />
              </Paper>
              {/*Contact info */}
              <Paper sx={{ p: 3, mt: 3 }}>
                <Box>
                  <Typography sx={{ mb: 3 }} variant="h6">
                    Contact Information
                  </Typography>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Email"
                      onChange={handleFormChange}
                      value={body.email}
                      id="email"
                      name="email"
                      type="age"
                      variant="outlined"
                    />

                    <TextField
                      fullWidth
                      label="Contact Number"
                      onChange={handleFormChange}
                      value={body.contactNumber}
                      id="contactNumber"
                      name="contactNumber"
                      type="text"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ mb: 3 }} variant="h6">
                    Social Media Accounts
                  </Typography>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Facebook"
                      variant="outlined"
                      name="facebook"
                      value={value.facebook}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FacebookIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Twitter"
                      name="twitter"
                      variant="outlined"
                      value={value.twitter}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TwitterIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Box>
              </Paper>
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography sx={{ mb: 3 }} variant="h6">
                  Features
                </Typography>
                <Stack spacing={2}>
                  {features.length > 0 ? (
                    features.map((feature) => {
                      return (
                        <Box>
                          <Paper elevation={1} sx={{ maxWidth: "300px", p: 2 }}>
                            <Stack
                              direction="row"
                              spacing={5}
                              alignItems="center"
                            >
                              <Box sx={{ maxWidth: "200px" }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    inlineSize: "200px",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {feature}
                                </Typography>
                              </Box>
                              <IconButton
                                onClick={() => {
                                  handleDeleteFeatures(feature);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Paper>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography color="GrayText">
                      Added features will show here
                    </Typography>
                  )}
                </Stack>
                <Stack
                  sx={{ mt: 2 }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    fullWidth
                    label="feature"
                    variant="outlined"
                    name="feature"
                    value={value.feature}
                    onChange={handleInputChange}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleInputSubmit("features");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { rid } = params;

  const data = await getSingleReport(rid);

  if (!data) {
    return {
      redirect: {
        destination: `/reports/${rid}`,
        permanent: false,
      },
    };
  }
  return {
    props: { data },
  };
}

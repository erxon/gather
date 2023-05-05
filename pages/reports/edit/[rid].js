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
  CircularProgress
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from "react";
import { useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import { getSingleReport, updateReport, uploadReportPhoto } from "@/lib/api-lib/api-reports";

export default function EditReport({ data }) {
  const [user, {loading}] = useUser();
  const [image, setImage] = useState({ renderImage: "", file: null });
  const [status, setStatus] = useState(data.status);
  //for snackbar
  const [snackbarValues, setSnackbarValues] = useState({
    open: false,
    message: ''
  })
  const [body, setBody] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    lastSeen: data.lastSeen,
    age: data.age,
    gender: data.gender,
    email: data.email,
    contactNumber: data.contactNumber,
    photo: data.photo
  });
  const [features, setFeatures] = useState([...data.features]);
  const [value, setValue] = useState({
    facebook: Object.hasOwn(data, 'socialMediaAccounts') ? data.socialMediaAccounts.facebook : "",
    twitter: Object.hasOwn(data, 'socialMediaAccounts') ? data.socialMediaAccounts.twitter: "",
    feature: "",
  });

  if (!user){
    return <CircularProgress />
  }

  

  //Snackbar 
  const handleClose = () => {
    setSnackbarValues((prev) => {
      return {...prev, open: false}
    })
  }

  //Image
  const handleChange = (event) => {
    setImage({
      renderImage: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0]
    });
  };

  //Status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  }

  //Features
  const handleDeleteFeatures = (feature) => {
    setFeatures((prev) => {
      return prev.filter((item) => {return item !== feature});
    });
  }

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
    if (image.file){
      const formData = new FormData();
      formData.append('file', image.file)
      formData.append("upload_preset", "report-photos");
      //Upload photo
      const photoUpload = await uploadReportPhoto(formData);

      body.photo = photoUpload.public_id
      
    }
    
    const update = {
      ...body,
      updatedBy: user._id,
      updatedAt: new Date(),
      status: status,
      socialMediaAccounts: {facebook: value.facebook, twitter: value.twitter},
      features: [...features],
    };
    //update report
    const message = await updateReport(data._id, update);
    setSnackbarValues({open: true, message: message.message})
  };
  const actions = (
    <React.Fragment>
      <Button href={`/reports/${data._id}`} color="secondary" size="small" onClick={handleClose}>
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
  const updatedDateAndTime = `${new Date(
    data.updatedAt
  ).toDateString()} ${new Date(data.updatedAt).toLocaleTimeString()}`;

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
          <Typography variant="h6">Report</Typography>
          <Typography variant="body2">
            Reported At: {reportedDateAndTime}
          </Typography>
          <Typography variant="body2">
            Last update: {updatedDateAndTime}
          </Typography>

          {user && user.type === "authority" && (
            <Box sx={{my: 3, width: '300px'}}>
              <FormControl fullWidth>
                <InputLabel>
                  Set Status
                </InputLabel>
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
          
          {data.photo ? (
            <ReportPhoto publicId={data.photo} />
          ) : (
            <img
              style={{
                borderRadius: "20px",
              }}
              src="https://placehold.co/250"
            />
          )}
          <br />
          <br />
          <Stack direction="row" spacing={1}>
            <Button component="label" size="small" variant="outlined">
              Choose File
              <input hidden type="file" onChange={handleChange} />
            </Button>
            <Button variant="contained" onClick={handleFormSubmit}>
              Save
            </Button>
          </Stack>
          {/*Image file name*/}
          {image.file && <Typography>{image.file.name}</Typography>}

          <Box>
            <Box sx={{ my: 3 }}>
              <Typography variant="body1">
                <strong>Basic Information</strong>
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First name"
                onChange={handleFormChange}
                value={body.firstName}
                id="firstName"
                name="firstName"
                type="text"
                variant="filled"
              />
              <TextField
                label="Last name"
                onChange={handleFormChange}
                value={body.lastName}
                id="lastName"
                name="lastName"
                type="text"
                variant="filled"
              />
            </Stack>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="age"
                onChange={handleFormChange}
                value={body.age}
                id="age"
                name="age"
                type="age"
                variant="filled"
              />
              <TextField
                label="Gender"
                onChange={handleFormChange}
                value={body.gender}
                id="gender"
                name="gender"
                type="text"
                variant="filled"
              />
              <TextField
                label="Last seen"
                onChange={handleFormChange}
                value={body.lastSeen}
                id="lastSeen"
                name="lastSeen"
                type="text"
                variant="filled"
              />
            </Stack>
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography sx={{ mb: 3 }} variant="body1">
              <strong>Contact Information</strong>
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                onChange={handleFormChange}
                value={body.email}
                id="email"
                name="email"
                type="age"
                variant="filled"
              />
              <TextField
                label="Contact Number"
                onChange={handleFormChange}
                value={body.contactNumber}
                id="contactNumber"
                name="contactNumber"
                type="text"
                variant="filled"
              />
            </Stack>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 3 }} variant="body1">
              <strong>Social Media Accounts</strong>
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Facebook"
                variant="filled"
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
                label="Twitter"
                name="twitter"
                variant="filled"
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
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ mb: 3 }} variant="body1">
              <strong>Features</strong>
            </Typography>
            <Stack spacing={2}>
              {features.map((feature) => {
                return (
                  <Box>
                    <Paper elevation={1} sx={{ maxWidth: "300px", p: 2 }}>
                      <Stack direction="row" spacing={5} alignItems="center">
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
                        <IconButton onClick={() => {handleDeleteFeatures(feature)}}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Paper>
                  </Box>
                );
              })}
            </Stack>
            <Stack
              sx={{ mt: 2 }}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <TextField
                multiline
                rows={4}
                label="feature"
                variant="filled"
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
          </Box>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { rid } = params;

  const data = await getSingleReport(rid)

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

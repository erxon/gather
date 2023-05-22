import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { useUser } from "@/lib/hooks";
//Material UI
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  IconButton,
  Divider,
  Chip,
  InputAdornment,
  Snackbar,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//Cloudinary
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { useRouter } from "next/router";
export default function ProfilePage() {
  //User
  const [user, { loading, mutate }] = useUser();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/checkAuth").then((response) => {
      response.json().then((data) => {
        if (!data.authenticated) {
          return router.push("/login");
        }
      });
    });
  }, [user]);

  const [userObj, setUserObj] = useState({
    about: "",
    photo: "",
    socialMediaAccounts: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  //Retrieve user
  useEffect(() => {
    // redirect user to login if not authenticated
    if (user) {
      setUserObj({ ...user });
    }
  }, [user, loading]);

  //For Snackbar
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  //Handle close for snackbar
  const handleClose = () => {
    setOpen({
      open: false,

      message: "",
    });
  };
  //Setting visibility for current password and new password
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
  });

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showError, setShowError] = useState({
    forCurPassword: false,
    forNewPassword: false,
  });

  const handlePasswordInputs = (event) => {
    const { value, name } = event.target;
    setPasswordValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleChangePassword = async () => {
    if (passwordValues.newPassword === "") {
      setShowError((prev) => {
        return { ...prev, forNewPassword: !prev.forNewPassword };
      });
    }
    if (passwordValues.currentPassword === "") {
      setShowError((prev) => {
        return { ...prev, forCurPassword: !prev.forCurPassword };
      });
    }
    const body = {
      username: userObj.username,
      newPassword: passwordValues.newPassword,
      curPassword: passwordValues.currentPassword,
      curSalt: userObj.salt,
      curHash: userObj.hash,
    };

    const res = await fetch("/api/utility/checkPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const changePasswordResult = await res.json();
    if (res.status === 200) {
      setOpen({
        open: true,
        message: changePasswordResult.message,
      });
    } else if (res.status === 400) {
      setOpen({
        open: true,
        message: changePasswordResult.error,
      });
    }
  };

  //Handle change for inputs in basic and contact information
  const handleChange = (event) => {
    const { value, name } = event.target;
    setUserObj((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  //Handle change for inputs in social media accounts
  const handleAccountChange = (event) => {
    const { value, name } = event.target;
    setUserObj((prev) => {
      return {
        ...prev,
        socialMediaAccounts: {
          ...prev.socialMediaAccounts,
          [name]: value,
        },
      };
    });
  };
  //handle update
  const handleUpdate = async () => {
    const body = {
      ...userObj,
    };
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const update = await res.json();
    if (update) {
      setOpen({ open: true, message: update.message });
    }
  };

  // if there is no photo in database, render default
  // else render the photo

  let profilePhoto;
  if (userObj.photo) {
    profilePhoto = new CloudinaryImage(userObj.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    })
      .resize(fill().width(60).height(60))
      .roundCorners(max());

    console.log(profilePhoto);
  }

  const [image, setImage] = useState({
    file: {},
    fileName: "",
  });
  const handleImageChange = (event) => {
    console.log(event.target.files[0]);
    if (event.target.files[0]) {
      setImage({
        file: event.target.files[0],
        fileName: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "profile");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    const updatePhoto = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: data.public_id }),
    });
    if (updatePhoto.status === 200) {
      setOpen({
        open: true,
        message: "Profile photo updated",
      });
    }
    setUserObj((prev) => {
      return { ...prev, photo: data.public_id };
    });
    setImage({
      file: {},
      fileName: "",
    });
  };

  return (
    <>
      {/*Display a snackbar*/}
      <Snackbar
        open={open.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={open.message}
      />
      <Box>
        <Stack sx={{mb: 2}} direction="row" spacing={2} alignItems="center">
          <IconButton href="/profile">
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ mb: 3 }} variant="h5">
            Edit profile
          </Typography>
        </Stack>

        {user && (
          <>
            {/*Photo***********/}
            <Paper sx={{ p: 3 }} elevation={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                {userObj.photo ? (
                  <Avatar sx={{ width: 60, height: 60 }}>
                    <AdvancedImage cldImg={profilePhoto} />
                  </Avatar>
                ) : (
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={
                      image.fileName === ""
                        ? "/assets/placeholder.png"
                        : image.fileName
                    }
                  />
                )}
                <form
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleImageSubmit}
                >
                  <Typography color="GrayText" variant="subtitle1">
                    {image.file.name}
                  </Typography>
                  <Button
                    startIcon={<AttachFileIcon />}
                    variant="outlined"
                    component="label"
                    size="small"
                  >
                    File
                    <input
                      hidden
                      name="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      type="file"
                    />
                  </Button>
                  {image.fileName !== "" && (
                    <Button
                      sx={{ ml: 1 }}
                      disableElevation
                      size="small"
                      variant="contained"
                      type="submit"
                    >
                      Save
                    </Button>
                  )}
                </form>
              </Stack>
            </Paper>
            <Grid container sx={{ my: 3 }} spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  {/*********************** Basic Information ********************************/}
                  <Paper sx={{ p: 3 }} elevation={2}>
                    <Stack
                      sx={{ mb: 2 }}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <Typography variant="h6">Basic Information</Typography>
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        sx={{ mt: 2 }}
                        size="small"
                      >
                        Save
                      </Button>
                    </Stack>
                    <Divider />
                    <Stack
                      sx={{ mt: 3 }}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography variant="subtitle1">
                        {user.username}
                      </Typography>
                      <Chip
                        sx={{ mt: 2 }}
                        color="primary"
                        label={user.type}
                        variant="outlined"
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ mt: 3 }}
                    >
                      <TextField
                        variant="outlined"
                        label="First Name"
                        value={userObj.firstName}
                        name="firstName"
                        onChange={handleChange}
                      />
                      <TextField
                        variant="outlined"
                        label="Last Name"
                        name="lastName"
                        value={userObj.lastName}
                        onChange={handleChange}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={userObj.about}
                      onChange={handleChange}
                      label="About"
                      name="about"
                      variant="outlined"
                      sx={{ mt: 3 }}
                    />
                    <br />
                  </Paper>
                </Box>
              </Grid>
              {/*********************** Contact Information ********************************/}
              <Grid item xs={12} md={6}>
                <Box>
                  <Paper sx={{ p: 3 }} elevation={2}>
                    <Stack
                      sx={{ mb: 2 }}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <Typography variant="h6">Contact Information</Typography>
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        size="small"
                      >
                        Save
                      </Button>
                    </Stack>
                    <Divider />
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ mt: 3 }}
                    >
                      <TextField
                        variant="outlined"
                        label="Contact number"
                        name="contactNumber"
                        value={userObj.contactNumber}
                        onChange={handleChange}
                      />
                      <TextField
                        variant="outlined"
                        label="Email"
                        name="email"
                        value={userObj.email}
                        onChange={handleChange}
                      />
                    </Stack>

                    <Typography sx={{ my: 3 }} variant="subtitle1">
                      Social Media Accounts
                    </Typography>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <InsertLinkIcon />
                        <TextField
                          fullWidth
                          label="Facebook Account"
                          variant="outlined"
                          name="facebook"
                          value={userObj.socialMediaAccounts.facebook}
                          onChange={handleAccountChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FacebookIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <InsertLinkIcon />
                        <TextField
                          fullWidth
                          label="Twitter Account"
                          variant="outlined"
                          name="twitter"
                          value={userObj.socialMediaAccounts.twitter}
                          onChange={handleAccountChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TwitterIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
            {/*********************** Change Password ********************************/}
            <Box sx={{ my: 3 }}>
              <Paper sx={{ p: 3 }} elevation={2}>
                <Stack
                  sx={{ mb: 2 }}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="h6">Change Password</Typography>
                  <Button
                    onClick={handleChangePassword}
                    size="small"
                    variant="contained"
                  >
                    Save
                  </Button>
                </Stack>
                <Divider />
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <TextField
                    error={showError.forCurPassword}
                    required
                    variant="outlined"
                    label="Current Password"
                    name="currentPassword"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordInputs}
                    type={visibility.currentPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => {
                              setVisibility((prev) => {
                                return {
                                  ...prev,
                                  currentPassword: !prev.currentPassword,
                                };
                              });
                            }}
                          >
                            {visibility.currentPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    error={showError.forNewPassword}
                    variant="outlined"
                    label="New Password"
                    name="newPassword"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordInputs}
                    type={visibility.newPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => {
                              setVisibility((prev) => {
                                return {
                                  ...prev,
                                  newPassword: !prev.newPassword,
                                };
                              });
                            }}
                          >
                            {visibility.newPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Paper>
            </Box>
          </>
        )}

        <style jsx>{`
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        `}</style>
      </Box>
    </>
  );
}

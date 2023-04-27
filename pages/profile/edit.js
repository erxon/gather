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
  Snackbar
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UploadIcon from "@mui/icons-material/Upload";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//Cloudinary
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { useRouter } from "next/router";
export default function ProfilePage() {
  //User
  const [user, { loading }] = useUser();
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
    about: '',
    photo: '',
    socialMediaAccounts: {
      facebook:"",
      twitter: "",
      instagram: ""
    }
  });

  //Retrieve user
  useEffect(() => {
    // redirect user to login if not authenticated
    if(user){ 
      setUserObj({...user})
    }
    
  }, [user, loading]);


   //For Snackbar
   const [open, setOpen] = useState({
    open: false,
    message: ''
  });
  //Handle close for snackbar
  const handleClose = () => {
    setOpen({
      open: false, 

      message: ''
    });
  }
  //Setting visibility for current password and new password
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false
  });

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [showError, setShowError] = useState({
    forCurPassword: false,
    forNewPassword: false
  });



  const handlePasswordInputs = (event) => {
    const {value, name} = event.target
    setPasswordValues((prev) => {
      return {...prev, [name]: value}
    })
  }

  const handleChangePassword = async () => {
    if (passwordValues.newPassword === ""){
      setShowError((prev)=>{
        return {...prev, forNewPassword: !prev.forNewPassword}
      })
    }
    if (passwordValues.currentPassword === ""){
      setShowError((prev)=>{
        return {...prev, forCurPassword: !prev.forCurPassword}
      })
    }
    const body = {
      username: userObj.username,
      newPassword: passwordValues.newPassword,
      curPassword: passwordValues.currentPassword,
      curSalt: userObj.salt,
      curHash: userObj.hash
    }

    const res = await fetch('/api/utility/checkPassword', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })

    const changePasswordResult = await res.json();
    if(res.status === 200){
      setOpen({
        open: true,
        message: changePasswordResult.message
      })
    } else if (res.status === 400){
      setOpen({
        open: true,
        message: changePasswordResult.error
      })
    }

  }

 
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
    const {value, name} = event.target
    setUserObj((prev) => {
      return {
        ...prev,
        socialMediaAccounts: {
          ...prev.socialMediaAccounts,
          [name]: value
        }
      }
    })
  }
  //handle update
  const handleUpdate = async () => {
    const body = {
      ...userObj
    };
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const update = await res.json();
    if(update){
      setOpen({open: true, message: update.message})
    }
  };

  // if there is no photo in database, render default
  // else render the photo

  let profilePhoto;
  if(userObj.photo){
    profilePhoto = new CloudinaryImage(userObj.photo, {
      cloudName: "dg0cwy8vx",
      apiKey: process.env.CLOUDINARY_KEY,
      apiSecret: process.env.CLOUDINARY_SECRET,
    })
    .resize(
      fill().width(120).height(120)
    ).roundCorners(max());

    console.log(profilePhoto)
  }
  

  const [image, setImage] = useState({file: {}, fileName: "/assets/placeholder.png"});
  const handleImageChange = (event) => {

    setImage({
      file: event.target.files[0],
      fileName: URL.createObjectURL(event.target.files[0])
    })


  }
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
    console.log(data)
    setUserObj((prev) => {
      return {...prev, photo: data.public_id}
    })

  }

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
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginBottom: "16px" }}
        >
          <AccountCircleIcon />
          <Typography variant="h6">Profile</Typography>
        </Stack>

        { user && (
          
          <>
            <Box sx={{ width: "120px" }}>
              <Stack direction="column" spacing={2}>
            {userObj.photo ? 
            (<AdvancedImage cldImg={profilePhoto} />) :  
            <Image
              style={{ borderRadius: "100%" }}
              width="120"
              height="120"
              src={image.fileName}
            />}
                <form method="post" encType="multipart/form-data" onSubmit={handleImageSubmit}>
                  <Button
                    component="label"
                    size="small"
                  >
                    Select file
                    <input hidden name="file" onChange={handleImageChange} accept="image/*" multiple type="file" />
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    type="submit"
                  >
                    Upload
                  </Button>
                </form>
                
              </Stack>
            </Box>
            <Box sx={{ my: 3 }}>
              <Box sx={{ my: 3 }}>
                {/*********************** Basic Information ********************************/}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body1">
                    <strong>Basic Information</strong>
                  </Typography>
                  <IconButton>
                    <ArrowDropDownIcon />
                  </IconButton>
                </Stack>
                <Divider />
                <Stack
                  sx={{ mt: 3 }}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="subtitle1">{user.username}</Typography>
                  <Chip
                    sx={{ mt: 2 }}
                    color="primary"
                    label={user.type}
                    variant="outlined"
                  />
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <TextField
                    variant="filled"
                    label="First Name"
                    size="small"
                    value={userObj.firstName}
                    name="firstName"
                    onChange={handleChange}
                  />
                  <TextField
                    variant="filled"
                    label="Last Name"
                    size="small"
                    name="lastName"
                    value={userObj.lastName}
                    onChange={handleChange}
                  />
                  
                </Stack>
                <TextField 
                    multiline 
                    rows={4} 
                    value={userObj.about} 
                    onChange={handleChange}
                    label="About" 
                    name="about" 
                    variant="filled"
                    sx={{mt: 3}}
                /><br />
                <Button onClick={handleUpdate} sx={{ mt: 2 }} size="small">
                  Save
                </Button>
              </Box>
              {/*********************** Contact Information ********************************/}
              <Box>
                <Typography variant="subtitle1">
                  <strong>Contact Information</strong>
                </Typography>
                <Divider />
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <TextField
                    variant="filled"
                    label="Contact number"
                    size="small"
                    name="contactNumber"
                    value={userObj.contactNumber}
                    onChange={handleChange}
                  />
                  <TextField
                    variant="filled"
                    label="Email"
                    size="small"
                    name="email"
                    value={userObj.email}
                    onChange={handleChange}
                  />
                </Stack>

                <Typography sx={{ mt: 2 }} variant="subtitle2">
                  Social Media Accounts
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    label="Facebook Account"
                    variant="filled"
                    size="small"
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
                  <TextField
                    label="Twitter Account"
                    variant="filled"
                    size="small"
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
                <Button onClick={handleUpdate} sx={{ mt: 2 }} size="small">
                  Save
                </Button>
              </Box>

              {/*********************** Change Password ********************************/}
              <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1">
                  <strong>Change Password</strong>
                </Typography>
                <Divider />
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <TextField
                    error={showError.forCurPassword}
                    required
                    variant="filled"
                    label="Current Password"
                    size="small"
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
                                return {...prev, currentPassword: !prev.currentPassword}
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
                    variant="filled"
                    label="New Password"
                    size="small"
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
                                return {...prev, newPassword: !prev.newPassword}
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
                <Button onClick={handleChangePassword} sx={{ mt: 2 }} size="small">
                  Change password
                </Button>
              </Box>
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

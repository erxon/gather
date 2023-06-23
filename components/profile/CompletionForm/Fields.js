import StackRowLayout from "@/utils/StackRowLayout";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  Button,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useState } from "react";

function FormLayout({ heading, children }) {
  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <Typography variant="h6" sx={{ mb: 2 }}>
        {heading}
      </Typography>
      {children}
    </Paper>
  );
}

function BasicInformation({ values, handleChange }) {
  return (
    <FormLayout heading="Basic information">
      <Stack>
        <StackRowLayout spacing={1}>
          <TextField
            fullWidth
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            label="First name"
          />
          <TextField
            fullWidth
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            label="Last name"
          />
        </StackRowLayout>
        <TextField
          sx={{ mt: 2 }}
          label="About"
          name="about"
          value={values.about}
          onChange={handleChange}
          multiline
          rows={4}
        />
      </Stack>
    </FormLayout>
  );
}

function ContactInformation({ values, handleChange }) {
  return (
    <FormLayout heading="Contact information">
      <StackRowLayout spacing={1}>
        <TextField
          fullWidth
          name="email"
          value={values.email}
          onChange={handleChange}
          label="Email"
        />
        <TextField
          fullWidth
          name="contactNumber"
          value={values.contactNumber}
          onChange={handleChange}
          label="Contact number"
        />
      </StackRowLayout>
    </FormLayout>
  );
}

function SocialMediaAccounts({ values, handleChange }) {
  return (
    <FormLayout heading="Social Media Accounts">
      <Stack sx={{ maxWidth: 350 }} spacing={2}>
        <StackRowLayout spacing={0.5}>
          <InsertLinkIcon />
          <TextField
            fullWidth
            name="facebook"
            value={values.facebook}
            label="Facebook"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FacebookIcon />
                </InputAdornment>
              ),
            }}
          />
        </StackRowLayout>
        <StackRowLayout spacing={0.5}>
          <InsertLinkIcon />
          <TextField
            fullWidth
            name="twitter"
            value={values.twitter}
            label="Twitter"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TwitterIcon />
                </InputAdornment>
              ),
            }}
          />
        </StackRowLayout>
        <StackRowLayout spacing={0.5}>
          <InsertLinkIcon />
          <TextField
            fullWidth
            name="instagram"
            value={values.instagram}
            label="Instagram"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InstagramIcon />
                </InputAdornment>
              ),
            }}
          />
        </StackRowLayout>
      </Stack>
    </FormLayout>
  );
}

export default function Fields({ setAccomplished, user }) {
  const [values, setValues] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
    email: user.email,
    contactNumber: user.contactNumber,
  });

  const [socialMediaAccounts, setSocialMediaAccounts] = useState({
    facebook: user.socialMediaAccounts.facebook,
    twitter: user.socialMediaAccounts.twitter,
    instagram: user.socialMediaAccounts.instagram,
  });

  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSocialMediaInputChange = (event) => {
    const { name, value } = event.target;
    setSocialMediaAccounts({ ...socialMediaAccounts, [name]: value });
  };

  const handleSubmit = async () => {
    console.log(values, socialMediaAccounts);
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.about === "" ||
      values.email === "" ||
      values.contactNumber === ""
    ) {
      //send an error
      setError({
        error: true,
        message: "Please fill all the necessary details",
      });
      return;
    }
    if (
      socialMediaAccounts.facebook === "" &&
      socialMediaAccounts.twitter === "" &&
      socialMediaAccounts.instagram === ""
    ) {
      //send an error
      setError({
        error: true,
        message: "Please give at least one social media account of yours.",
      });
      return;
    }
    //save the form
    setError({
      error: false,
    });

    // update the user
    const updateUser = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        ...values,
        socialMediaAccounts: socialMediaAccounts,
      }),
    });

    if (updateUser.status === 200) {
      setAccomplished((prev) => {
        return { ...prev, form: true };
      });
    }
  };

  return (
    <Box>
      <BasicInformation values={values} handleChange={handleChange} />
      <Box sx={{ mt: 1 }}>
        <ContactInformation values={values} handleChange={handleChange} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <SocialMediaAccounts
          values={socialMediaAccounts}
          handleChange={handleSocialMediaInputChange}
        />
      </Box>
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        {error && (
          <Typography sx={{ mb: 1 }} color="red" variant="body1">
            {error.message}
          </Typography>
        )}
        <Button onClick={handleSubmit} sx={{ mr: 1 }} variant="contained">
          Save
        </Button>
        <Button variant="outlined">Cancel</Button>
      </Paper>
    </Box>
  );
}

import StackRowLayout from "@/utils/StackRowLayout";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  Button,
  Collapse,
  Alert,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useState } from "react";
import DisplayConfirmationModal from "@/components/DisplayConfirmationModal";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import ErrorAlert from "@/components/ErrorAlert";

function FormLayout({ heading, children }) {
  return (
    <Paper sx={{ p: 3 }} variant="outlined">
      <StackRowLayout>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {heading}
        </Typography>
      </StackRowLayout>

      {children}
    </Paper>
  );
}

function BasicInformation({ values, handleChange, isSubmitted }) {
  return (
    <FormLayout heading="Basic information">
      <Stack>
        <Stack direction="row" spacing={1}>
          <TextFieldWithValidation
            label="First name"
            name="firstName"
            value={values.firstName}
            changeHandler={handleChange}
            isSubmitted={isSubmitted}
            isFullWidth={true}
          />
          <TextFieldWithValidation
            label="Last name"
            name="lastName"
            value={values.lastName}
            changeHandler={handleChange}
            isSubmitted={isSubmitted}
            isFullWidth={true}
          />
        </Stack>
        <TextFieldWithValidation
          label="About"
          name="about"
          value={values.about}
          changeHandler={handleChange}
          isSubmitted={isSubmitted}
          isFullWidth={true}
          isMultiline={true}
          rows={4}
          style={{ mt: 2 }}
        />
      </Stack>
    </FormLayout>
  );
}

function ContactInformation({ values, handleChange, isSubmitted }) {
  return (
    <FormLayout heading="Contact information">
      <Stack direction="row" spacing={1}>
        <TextFieldWithValidation
          label="Email"
          name="email"
          value={values.email}
          changeHandler={handleChange}
          isSubmitted={isSubmitted}
          isFullWidth={true}
        />
        <TextFieldWithValidation
          label="Contact Number"
          name="contactNumber"
          value={values.contactNumber}
          changeHandler={handleChange}
          isSubmitted={isSubmitted}
          isFullWidth={true}
        />
      </Stack>
    </FormLayout>
  );
}

function SocialMediaAccounts({ values, handleChange, isSubmitted }) {
  return (
    <FormLayout heading="Social Media Accounts">
      {values.facebook === "" &&
        values.twitter === "" &&
        values.instagram === "" &&
        isSubmitted && (
          <Alert sx={{mb: 2}} severity="error">
            Please add at least <span style={{ fontWeight: "bold" }}>one</span>{" "}
            social media account
          </Alert>
        )}
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

export default function Fields({ setAccomplished, user, mutate }) {
  const [values, setValues] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about ? user.about : "",
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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar({
      open: false,
    });
  };

  const handleModal = () => {
    setOpenModal(false);
  };

  const confirmAccountDelete = async () => {
    //Fetch delete account api
    await fetch("/api/user", {
      method: "DELETE",
    });
    //mutate user
    mutate({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSocialMediaInputChange = (event) => {
    const { name, value } = event.target;
    setSocialMediaAccounts({ ...socialMediaAccounts, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);

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
        message: "Please fill all the necessary details",
      });
      return;
    }
    //save the form
    setError({
      error: false,
    });

    //Validate email

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
      setOpenSnackbar({
        open: true,
        message: "Form successfully saved",
      });
      setAccomplished((prev) => {
        return { ...prev, form: true };
      });
    }
  };

  return (
    <Box>
      <DisplayConfirmationModal
        openModal={openModal}
        handleClose={handleModal}
        onConfirm={confirmAccountDelete}
        title="Confirm account delete."
        body="Are you sure you want to cancel your account creation?"
      />
      <DisplaySnackbar
        message={openSnackbar.message}
        open={openSnackbar.open}
        handleClose={handleSnackbarClose}
      />
      <BasicInformation
        values={values}
        handleChange={handleChange}
        isSubmitted={isSubmitted}
      />
      <Box sx={{ mt: 1 }}>
        <ContactInformation
          values={values}
          handleChange={handleChange}
          isSubmitted={isSubmitted}
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <SocialMediaAccounts
          values={socialMediaAccounts}
          isSubmitted={isSubmitted}
          handleChange={handleSocialMediaInputChange}
        />
      </Box>
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <ErrorAlert
          open={error.error}
          message={error.message}
          close={() => setError({ error: false })}
        />

        <Button onClick={handleSubmit} sx={{ mr: 1 }} variant="contained">
          Save
        </Button>
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant="outlined"
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
}

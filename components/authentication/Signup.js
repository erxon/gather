import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { signup } from "@/lib/api-lib/api-auth";
import { useRouter } from "next/router";

import PasswordField from "@/components/forms/PasswordField";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";

function TypeSelection({ error, type, setType }) {
  const handleChange = (event) => {
    setType(event.target.value);
  };
  return (
    <FormControl error={error} fullWidth>
      <InputLabel id="demo-simple-select-label">Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={type}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value={"citizen"}>Citizen</MenuItem>
        <MenuItem value={"authority"}>Authority</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function Signup() {
  const [user, { mutate }] = useUser();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    rpassword: "",
  });
  const [type, setType] = useState("");
  const [error, setError] = useState({
    title: "",
    show: false,
    message: "",
  });
  const [isFormSubmitted, setFormSubmissionState] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async () => {
    setFormSubmissionState(true);
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.username === "" ||
      values.email === "" ||
      values.password === "" ||
      values.rpassword === "" ||
      type === ""
    ) {
      setError({
        title: "Missing Fields",
        show: true,
        message: "Please fill all required fields.",
      });
      return;
    }
    if (values.password.length < 8) {
      setError({
        title: "Password Error",
        show: true,
        message: "Password should have at least 8 characters.",
      });
      return;
    }

    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      password: values.password,
      email: values.email,
      type: type,
      status: "unverified",
    };

    if (body.password !== values.rpassword) {
      setError({
        title: "Password don't match",
        show: true,
        message: "Please check your passwords.",
      });
      return;
    }
    //Signup user
    const res = await signup(body);

    if (res.status === 201) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    } else {
      res.text().then((text) => {
        setError({ show: true, message: text });
      });
    }
  };

  useEffect(() => {
    if (user) {
      Router.push("/profile/completion");
    }
  }, [user]);

  return (
    <>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >
            <AccountCircleIcon color="primary" />
            <Typography variant="h5" color="primary">
              Sign up
            </Typography>
          </Stack>
          <TypeSelection error={error.show} type={type} setType={setType} />
          <Stack sx={{ mb: 2, mt: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextFieldWithValidation
                changeHandler={handleChange}
                name="firstName"
                isSubmitted={isFormSubmitted}
                value={values.firstName}
                label="First name"
              />
              <TextFieldWithValidation
                changeHandler={handleChange}
                name="lastName"
                isSubmitted={isFormSubmitted}
                value={values.lastName}
                label="Last name"
              />
            </Stack>
            <TextFieldWithValidation
              isSubmitted={isFormSubmitted}
              style={{ mt: 1 }}
              label="username"
              variant="outlined"
              type="text"
              name="username"
              changeHandler={handleChange}
              value={values.username}
              required
            />
            <TextFieldWithValidation
              isSubmitted={isFormSubmitted}
              style={{ mt: 1 }}
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              changeHandler={handleChange}
              value={values.email}
              required
            />
            <PasswordField
              styles={{ mt: 1 }}
              isSubmitted={isFormSubmitted}
              name="password"
              label="Password"
              value={values.password}
              handleChange={handleChange}
            />
            <PasswordField
              styles={{ mt: 1 }}
              isSubmitted={isFormSubmitted}
              name="rpassword"
              label="Repeat Password"
              value={values.rpassword}
              handleChange={handleChange}
            />
          </Stack>
          <Collapse in={error.show}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError({ show: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
              sx={{ mb: 1 }}
            >
              <AlertTitle>{error.title}</AlertTitle>
              {error.message}
            </Alert>
          </Collapse>
          <Button
            onClick={onSubmit}
            fullWidth
            variant="contained"
            type="submit"
          >
            Signup
          </Button>
        </Paper>
      </Box>
    </>
  );
}

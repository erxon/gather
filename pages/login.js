import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { useUser } from "@/lib/hooks";
import TextField from "@mui/material/TextField";
import {
  Stack,
  Typography,
  Paper,
  Alert,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import PasswordField from "@/components/forms/PasswordField";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    title: "",
    show: false,
    message: "",
  });
  const [isSubmitted, setFormSubmissionState] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    setFormSubmissionState(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.status === 401) {
      setError({ show: true, message: "Login error" });
    }
    if (res.status === 400) {
      setError({ show: true, message: "Empty fields" });
    }
    if (res.status === 200) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    }
  };

  const handleForgotPassword = () => {
    if (values.username === "") {
      setError({ show: true, message: "username is empty" });
      return;
    }
    router.push(`/authentication/forgot-password/${values.username}`);
  };

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push("/dashboard");
  }, [user]);

  return (
    <>
      <Paper
        sx={{
          p: 3,
          margin: "auto",
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          direction="row"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <AccountCircleIcon color="primary" />
          <Typography variant="h5" color="primary">
            Login
          </Typography>
        </Stack>
        <Stack justifyContent="center" spacing={3} useFlexGap sx={{ mb: 1 }}>
          <TextFieldWithValidation
            variant="outlined"
            name="username"
            id="username"
            type="text"
            label="username"
            changeHandler={handleChange}
            value={values.username}
            isSubmitted={isSubmitted}
          />
          <PasswordField
            variant="outlined"
            id="password"
            name="password"
            type="password"
            label="password"
            handleChange={handleChange}
            value={values.password}
            isSubmitted={isSubmitted}
          />
          {
            <Collapse in={error.show}>
              <Alert
                action={
                  <IconButton
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
              >
                {error.message}
              </Alert>
            </Collapse>
          }
        </Stack>
        <Box sx={{ mb: 1 }}>
          <Button sx={{ mr: 1 }} size="small" href="/signup">
            Signup
          </Button>
          <Button onClick={handleForgotPassword} size="small">
            Forgot password?
          </Button>
        </Box>
        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          type="submit"
        >
          Login
        </Button>
      </Paper>
    </>
  );
}

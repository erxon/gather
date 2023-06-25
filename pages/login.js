import React, { useState, useEffect } from "react";
import Router from "next/router";
import { useUser } from "@/lib/hooks";
import TextField from "@mui/material/TextField";
import {Stack, Typography, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

export default function Login() {
  const [user, { mutate }] = useUser();
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
          sx={{ mb: 3 }}
        >
          <AccountCircleIcon />
          <Typography variant="h5">Login</Typography>
        </Stack>
        <form onSubmit={onSubmit}>
          <Stack justifyContent="center" spacing={3} useFlexGap sx={{ mb: 3 }}>
            <TextField
              variant="outlined"
              name="username"
              id="username"
              type="text"
              label="username"
              error={error.show}
            />
            <TextField
              variant="outlined"
              id="password"
              name="password"
              type="password"
              label="password"
              error={error.show}
            />
            {error.show && <Typography variant="subtitle1" color="red">{error.message}</Typography>}
          </Stack>

          <Button fullWidth variant="contained" type="submit">
            Login
          </Button>
        </form>
      </Paper>
    </>
  );
}

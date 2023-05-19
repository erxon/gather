import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { useUser } from "@/lib/hooks";
import TextField from "@mui/material/TextField";
import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Login() {
  const [user, { mutate }] = useUser();

  async function onSubmit(e) {
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
    if (res.status === 200) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    }
  }

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push("/dashboard");
  }, [user]);

  return (
    <>
      <Box sx={{margin: 'auto', textAlign: "center", maxWidth: {xs: '100%', md: '40%'}}}>
        <Stack
          alignItems="center"
          justifyContent="center"
          direction="row"
          spacing={1}
          sx={{mb: 3}}
        >
          <AccountCircleIcon />
          <Typography variant="h5">Login</Typography>
        </Stack>

        <form onSubmit={onSubmit}>
          <Stack
            justifyContent="center"
            spacing={3}
            useFlexGap
            sx={{mb: 3}}
          >
            <TextField
              variant="outlined"
              name="username"
              id="username"
              type="text"
              label="username"
            />
            <TextField
              variant="outlined"
              id="password"
              name="password"
              type="password"
              label="password"
            />
          </Stack>

          <Button fullWidth variant="contained" type="submit">
            Login
          </Button>
        </form>
      </Box>
    </>
  );
}

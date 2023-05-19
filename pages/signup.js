import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Box, Stack, Typography, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { signup } from "@/lib/api-lib/api-auth";

export default function Signup() {
  const [user, { mutate }] = useUser();

  async function onSubmit(e) {
    e.preventDefault();

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
      email: e.currentTarget.email.value,
      type: "authority",
    };

    if (body.password !== e.currentTarget.rpassword.value) {
      setErrorMsg(`The passwords don't match`);
      return;
    }
    //Signup user
    const res = await signup(body);

    if (res.status === 201) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    } else {
      setErrorMsg(await res.text());
    }
  }

  useEffect(() => {
    if (user) {
      Router.push("/profile");
    }
  }, [user]);

  return (
    <>
      <Box
        sx={{
          margin: "auto",
          width: { xs: "100%", md: "40%" },
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <AccountCircleIcon />
          <Typography variant="h5">Sign up</Typography>
        </Stack>
        <form onSubmit={onSubmit}>
          <Stack sx={{ mb: 2 }}>
            <TextField
              label="username"
              variant="outlined"
              id="username"
              type="text"
              name="username"
              margin="dense"
              required
            />
            <TextField
              label="email"
              variant="outlined"
              id="email"
              type="email"
              name="email"
              margin="dense"
              required
            />
            <TextField
              label="password"
              variant="outlined"
              id="password"
              type="password"
              name="password"
              margin="dense"
              required
            />
            <TextField
              label="repeat password"
              variant="outlined"
              id="rpassword"
              type="password"
              name="rpassword"
              margin="dense"
              required
            />
          </Stack>

          <Button fullWidth variant="contained" type="submit">
            Signup
          </Button>
        </form>
      </Box>
    </>
  );
}

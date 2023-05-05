import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useUser } from "@/lib/hooks";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { signup } from "@/lib/api-lib/api-auth";

export default function Signup() {
  const [user, { mutate }] = useUser();
  console.log(user);
  const [errorMsg, setErrorMsg] = useState("");

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
          backgroundColor: "#f2f4f4",
          marginTop: "100px",
          padding: "30px",
          borderRadius: "20px",
          height: "25%",
          padding: {xs: "10%", md:"5%"},
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginBottom: "16px" }}
        >
          <AccountCircleIcon />
          <Typography variant="h6">Signup</Typography>
        </Stack>

        <form onSubmit={onSubmit}>
          <Stack
            sx={{
              '& .MuiTextField-root': { width:{xs: "100%", md: "50%"} },
              mb: '10px'
            }}
          >
            <TextField 
              label="username"
              variant="filled" 
              id="username" 
              type="text" 
              name="username"
              margin="dense"
               />
            <TextField 
              label="email"
              variant="filled" 
              id="email" 
              type="email" 
              name="email"
              margin="dense"
               />
            <TextField 
              label="password"
              variant="filled" 
              id="password" 
              type="password" 
              name="password"
              margin="dense"
               />
            <TextField 
              label="repeat password"
              variant="filled" 
              id="rpassword" 
              type="password" 
              name="rpassword"
              margin="dense"
               />
          </Stack>

          <Button variant="contained" type="submit">
            Signup
          </Button>
        </form>
      </Box>
    </>
  );
}

import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { useUser } from "@/lib/hooks";
import TextField from "@mui/material/TextField";
import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Login() {
  const [user, { mutate }] = useUser();
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      const userObj = await res.json();
      // set user to useSWR state
      mutate(userObj);
    } else {
      setErrorMsg("Incorrect username or password. Try better!");
    }
  }

  useEffect(() => {
    // redirect to home if user is authenticated
    if (user) Router.push("/dashboard");
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
          padding: '5%'
        }}
      >
        <Stack 
            alignItems="center" 
            direction="row" 
            spacing={1}
            sx={{marginBottom: '16px'}}
            >
            <AccountCircleIcon />
            <Typography variant="h6">Login</Typography>
        </Stack>
        
        <form onSubmit={onSubmit}>
          <Stack 
            direction={{xs: 'column', md: 'row'}}
            spacing={2}
            useFlexGap
            sx={{marginBottom: '16px'}}
            >
            <TextField
              variant="filled"
              size="small"
              name="username"
              id="username"
              type="text"
              label="username"
              
            />
            <TextField
              variant="filled"
              size="small"
              id="password"
              name="password"
              type="password"
              label="password"
            />
          </Stack>

          <Button variant="contained" type="submit">
            Login
          </Button>
        </form>
      </Box>
    </>
  );
}

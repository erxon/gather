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
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    rpassword: "",
  });
  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async () => {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      rpassword === ""
    ) {
      setError({ show: true, message: "Missing fields" });
      return;
    }

    const body = {
      username: values.username,
      password: values.password,
      email: values.email,
      type: "authority",
    };

    if (body.password !== values.rpassword) {
      setError({ show: true, message: `Password don't match` });
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
        <Paper sx={{p: 3}}>
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
          <Stack sx={{ mb: 2 }}>
            <Box>
              <TextField />
              <TextField />
            </Box>
            <TextField
              label="username"
              variant="outlined"
              id="username"
              type="text"
              name="username"
              margin="dense"
              onChange={handleChange}
              error={error.show}
              required
            />
            <TextField
              label="email"
              variant="outlined"
              id="email"
              type="email"
              name="email"
              margin="dense"
              onChange={handleChange}
              error={error.show}
              required
            />
            <TextField
              label="password"
              variant="outlined"
              id="password"
              type="password"
              name="password"
              margin="dense"
              onChange={handleChange}
              error={error.show}
              required
            />
            <TextField
              label="repeat password"
              variant="outlined"
              id="rpassword"
              type="password"
              name="rpassword"
              margin="dense"
              onChange={handleChange}
              error={error.show}
              required
            />
          </Stack>
          {error.show && (
            <Typography sx={{ mb: 2 }} color="red">
              {error.message}
            </Typography>
          )}
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

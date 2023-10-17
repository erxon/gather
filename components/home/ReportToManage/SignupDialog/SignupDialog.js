import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Typography,
  Box,
  Collapse,
  Alert,
  AlertTitle,
  IconButton,
  Button
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { signup } from "@/lib/api-lib/api-auth";
import { createReport } from "@/lib/api-lib/api-reports";
import SignupForm from "./SignupForm";

export default function SignupDialog({ open, setOpen, report }) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    rpassword: "",
  });

  const [error, setError] = useState({
    title: "",
    show: false,
    message: "",
  });

  const [isFormSubmitted, setFormSubmissionState] = useState(false);

  const handleSubmit = async () => {
    setFormSubmissionState(true);

    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.username === "" ||
      values.email === "" ||
      values.password === "" ||
      values.rpassword === ""
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
      type: "citizen",
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
    const signupResponse = await signup(body);

    if (signupResponse.status === 201) {
      //update the report and save
      const user = await signupResponse.json();

      const reportRequestBody = {
        ...report,
        username: user.username,
        account: user.userId,
      };

      const reportResponseData = await createReport(reportRequestBody);
      window.location.replace(
        `/reports/complete-report/${reportResponseData.data._id}`
      );

      setOpen(false);
    } else {
      res.text().then((text) => {
        setError({ show: true, message: text });
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Finish your report</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ mb: 2 }}>
            Finish your report by signing up
          </Typography>
        </DialogContentText>
        <Grid container spacing={1}>
          <Grid
            sx={{
              border: "0.5px solid #ebedec",
              borderBottom: 0,
              borderTop: 0,
              borderLeft: 0,
              pr: 1,
            }}
            item
            xs={12}
            md={6}
          >
            <Typography sx={{ mb: 1 }} variant="h6">
              Your report
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>
                {report.firstName} {report.middleName} {report.lastName}{" "}
                {report.qualifier}
              </Typography>
              <Typography>
                {report.age} years old, {report.gender}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography>Last seen</Typography>
              <Typography variant="body2">{report.lastSeen}</Typography>
            </Box>
            <Box>
              <Typography>Details</Typography>
              <Typography variant="body2">{report.details}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <SignupForm
              values={values}
              setValues={setValues}
              isFormSubmitted={isFormSubmitted}
            />
          </Grid>
        </Grid>
        <Collapse sx={{ mt: 1 }} in={error.show}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Proceed</Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

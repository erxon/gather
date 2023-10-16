import {
  Paper,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Collapse,
  Alert,
  AlertTitle,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import TextFieldWithValidation from "../forms/TextFieldWithValidation";
import PasswordField from "../forms/PasswordField";
import ErrorAlert from "../ErrorAlert";
import { createReport } from "@/lib/api-lib/api-reports";
import { Router, useRouter } from "next/router";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Signup from "../authentication/Signup";
import { signup } from "@/lib/api-lib/api-auth";

function CreateReportForm({
  open,
  setOpen,
  setOpenSignupDialog,
  values,
  setValues,
  alert,
  setAlert,
  gender,
  setGender,
  setSubmissionState,
  isSubmitted,
}) {
  const router = useRouter();
  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    setSubmissionState(true);
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.age === "" ||
      values.lastSeen === "" ||
      values.details === ""
    ) {
      setAlert({ open: true, message: "Please fill all the required fields." });
      return;
    }
    const body = {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      qualifier: values.qualifier,
      lastSeen: values.lastSeen,
      age: values.age,
      details: values.details,
      gender: gender,
      status: "pending",
    };

    //Create new report
    // const data = await createReport(body);
    setOpen(false);
    setOpenSignupDialog(true);

    // if (data) {
    //   router.push(`/reports/create-account/${data.data._id}`);
    // }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {" "}
      <DialogTitle>Create Report</DialogTitle>
      <DialogContent>
        <Stack sx={{ mb: 3 }} direction="row" spacing={1}>
          <TextFieldWithValidation
            id="age"
            label="Age"
            name="age"
            variant="outlined"
            type="text"
            isSubmitted={isSubmitted}
            value={values.age}
            changeHandler={handleChange}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              onChange={(event) => {
                setGender(event.target.value);
              }}
              value={gender}
              label="Gender"
            >
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Stack
          sx={{ mb: 2 }}
          direction={{ xs: "column", md: "row" }}
          spacing={1}
        >
          {/*First name*/}
          <TextFieldWithValidation
            id="firstName"
            label="First Name"
            variant="outlined"
            name="firstName"
            type="text"
            isSubmitted={isSubmitted}
            value={values.firstName}
            isFullWidth={true}
            changeHandler={handleChange}
          />
          {/*Middle name*/}
          <TextFieldWithValidation
            id="middleName"
            label="Middle Name"
            variant="outlined"
            name="middleName"
            type="text"
            isSubmitted={isSubmitted}
            value={values.middleName}
            isFullWidth={true}
            changeHandler={handleChange}
          />
          {/*Last name*/}
          <TextFieldWithValidation
            id="lastName"
            label="Last Name"
            variant="outlined"
            name="lastName"
            type="text"
            isSubmitted={isSubmitted}
            value={values.lastName}
            isFullWidth={true}
            changeHandler={handleChange}
          />
          <TextField
            id="qualifier"
            label="Qualifier"
            variant="outlined"
            name="qualifier"
            value={values.qualifier}
            onChange={handleChange}
            sx={{ maxWidth: 175 }}
          />
        </Stack>
        {/*Last seen*/}
        <TextFieldWithValidation
          id="lastSeen"
          label="Last Seen"
          variant="outlined"
          name="lastSeen"
          type="text"
          style={{ mb: 1 }}
          isSubmitted={isSubmitted}
          value={values.lastSeen}
          isFullWidth={true}
          changeHandler={handleChange}
        />
        <Typography sx={{ my: 1 }} color="GrayText">
          Please state as much details as needed for your report. Adequate
          information will help investigators or authorities find the person.
        </Typography>
        <TextFieldWithValidation
          id="details"
          label="Details"
          variant="outlined"
          name="details"
          type="text"
          style={{ mb: 1 }}
          isSubmitted={isSubmitted}
          value={values.details}
          isFullWidth={true}
          isMultiline={true}
          rows={4}
          changeHandler={handleChange}
        />
        <ErrorAlert
          open={alert.open}
          message={alert.message}
          close={() => setAlert({ open: false })}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={handleSubmit}>
          Report
        </Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function SignupForm({ values, setValues, error, isFormSubmitted }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <>
      <Box>
        <Typography variant="h6" color="primary">
          Sign up
        </Typography>
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
      </Box>
    </>
  );
}

function SignupDialog({ open, setOpen, report }) {
  const router = useRouter();

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
      const user = await signupResponse.json()

      const reportRequestBody = {
        ...report,
        username: user.username,
        account: user.userId
      };

      const reportResponseData = await createReport(reportRequestBody);
      window.location.replace(`/reports/complete-report/${reportResponseData.data._id}`);

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

export default function ReportToManage() {
  const [gender, setGender] = useState("");
  const [isSubmitted, setSubmissionState] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });
  const [values, setValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    qualifier: "",
    lastSeen: "",
    details: "",
    age: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [signupDialog, setOpenSignupDialog] = useState(false);

  return (
    <>
      <SignupDialog
        open={signupDialog}
        setOpen={setOpenSignupDialog}
        report={{ ...values, gender: gender }}
      />
      <CreateReportForm
        open={openDialog}
        setOpen={setOpenDialog}
        values={values}
        setValues={setValues}
        gender={gender}
        setGender={setGender}
        alert={alert}
        setAlert={setAlert}
        isSubmitted={isSubmitted}
        setSubmissionState={setSubmissionState}
        setOpenSignupDialog={setOpenSignupDialog}
      />
      <Paper sx={{ p: 3 }}>
        <Stack sx={{ height: 140 }} alignItems="flex-start">
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountBoxIcon fontSize="medium" />
            <Typography variant="h5">Report Profile</Typography>
          </Stack>
          <Typography sx={{ my: 1, height: "100%" }} variant="body1">
            Create a profile for your report. This will help you and the
            authorities manage missing person report.
          </Typography>
          <Button onClick={() => setOpenDialog(true)}>Report</Button>
        </Stack>
      </Paper>
    </>
  );
}

//Handle submission of Report and Manage form

import {
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import DisplaySnackbar from "../DisplaySnackbar";
import TextFieldWithValidation from "../forms/TextFieldWithValidation";
import ErrorAlert from "../ErrorAlert";
import { useSWRConfig } from "swr";

export default function AddReportForm({ handleClose, username }) {
  const { mutate } = useSWRConfig();
  const [values, setValues] = useState({
    age: "",
    firstName: "",
    lastName: "",
    lastSeen: "",
  });
  const [gender, setGender] = useState("");
  const [isSubmitted, setSubmittedState] = useState(false);
  const [openSnackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ open: false });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    setSubmittedState(true);
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.age === "" ||
      values.lastSeen === "" ||
      gender === ""
    ) {
      setAlert({
        open: true,
        message: "Please fill all fields.",
      });
      return;
    }
    const addReport = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        gender: gender,
        username: username,
        status: "pending",
      }),
    });

    const addReportResult = await addReport.json();

    //If report is created successfully, send notification
    if (addReport.status === 200) {
      await fetch("/api/notification/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "pending",
          reportId: addReportResult.data._id,
          firstName: values.firstName,
          lastName: values.lastName,
          reporter: username,
        }),
      });
      setValues({ age: "", firstName: "", lastName: "", lastSeen: "" });
      setSubmittedState(false)
    } else if (addReport.status === 400) {
      setAlert({
        open: true,
        message: addReportResult.error,
      });
    }
    //Display Snackbar

    mutate(`/api/reports/user/${username}`);

    setSnackbar({
      open: true,
      message: addReportResult.message,
    });
  };

  return (
    <div>
      <DisplaySnackbar
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={handleSnackbarClose}
      />
      <Paper variant="outlined" sx={{ p: 3, maxWidth: 400 }}>
        <Stack sx={{ mb: 3 }} direction="row" spacing={1}>
          <TextFieldWithValidation
            label="Age"
            name="age"
            changeHandler={handleChange}
            value={values.age}
            isSubmitted={isSubmitted}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              error={isSubmitted && gender === ""}
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
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ mb: 1 }}
          spacing={1}
        >
          <TextFieldWithValidation
            isFullWidth={true}
            name="firstName"
            label="First Name"
            value={values.firstName}
            changeHandler={handleChange}
            isSubmitted={isSubmitted}
          />
          <TextFieldWithValidation
            isFullWidth={true}
            name="lastName"
            label="Last Name"
            value={values.lastName}
            changeHandler={handleChange}
            isSubmitted={isSubmitted}
          />
        </Stack>
        <TextFieldWithValidation
          isFullWidth={true}
          name="lastSeen"
          label="Last Seen"
          value={values.lastSeen}
          changeHandler={handleChange}
          isSubmitted={isSubmitted}
        />
        <Divider sx={{ my: 2 }} />
        <ErrorAlert
          open={alert.open}
          message={alert.message}
          close={() => {
            setAlert({ open: false });
          }}
        />
        <Button variant="contained" size="small" onClick={handleSubmit}>
          Add Report
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Paper>
    </div>
  );
}

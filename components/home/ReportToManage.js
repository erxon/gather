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
} from "@mui/material";

import { useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import TextFieldWithValidation from "../forms/TextFieldWithValidation";
import ErrorAlert from "../ErrorAlert";
import { createReport } from "@/lib/api-lib/api-reports";
import { useRouter } from "next/router";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

function CreateReportForm({
  open,
  setOpen,
  values,
  setValues,
  alert,
  setAlert,
  gender,
  setGender,
  setSubmissionState,
  isSubmitted,
}) {
  const router = useRouter()
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
    const data = await createReport(body);

    if (data) {
      router.push(`/reports/create-account/${data.data._id}`);
    }
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

export default function ReportToManage() {
  const router = useRouter();
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

  return (
    <>
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

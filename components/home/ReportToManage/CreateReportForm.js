import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Typography,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import ErrorAlert from "@/components/ErrorAlert";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

export default function CreateReportForm({
  open,
  setOpen,
  setOpenDataPrivacyDialog,
  values,
  setValues,
  alert,
  setAlert,
  gender,
  setGender,
  lastSeenDateTime,
  setLastSeenDateTime,
  setSubmissionState,
  isSubmitted,
}) {
  

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleDateTimeChange = (event) => {
    setLastSeenDateTime(event)
  }


  const validateForm = () => {
    if (
      values.firstName === "" ||
      values.lastName === "" ||
      values.age === "" ||
      values.lastSeen === "" ||
      values.details === ""
    ) {
      setAlert({ open: true, message: "Please fill all the required fields." });
      return;
    } else {
      setOpen(false);
      setOpenDataPrivacyDialog(true);
    }
  };

  const handleSubmit = () => {
    setSubmissionState(true);
    validateForm();
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {" "}
      <DialogTitle>Create Report</DialogTitle>
      <DialogContent>
        <Stack sx={{ my: 3 }} direction="row" spacing={1}>
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
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
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
        <Typography sx={{ my: 1 }} color="GrayText">
          Please specify the approximate location or time the person was last seen
        </Typography>
        {/*Last seen*/}
        <Stack>
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker onChange={handleDateTimeChange} value={lastSeenDateTime} defaultValue={dayjs()} />
          </LocalizationProvider>
        </Stack>
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

import { Paper, Typography, Stack, Button } from "@mui/material";
import { useState } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DataPrivacyDialog from "../../reports/DataPrivacyDialog";
import CreateReportForm from "./CreateReportForm";
import SignupDialog from "./SignupDialog/SignupDialog";
import dayjs from "dayjs";

export default function ReportToManage() {
  const [gender, setGender] = useState("");
  const [lastSeenDateTime, setLastSeenDateTime] = useState(dayjs()); 
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
  const [openDataPrivacyDialog, setOpenDataPrivacyDialog] = useState(false);

  const handleDataPrivacyConfirmation = () => {
    setOpenSignupDialog(true)
    setOpenDataPrivacyDialog(false)
  }
  return (
    <>
      <SignupDialog
        open={signupDialog}
        setOpen={setOpenSignupDialog}
        report={{ ...values, gender: gender, lastSeenDateTime: lastSeenDateTime.toString() }}
      />
      <DataPrivacyDialog
        open={openDataPrivacyDialog}
        setOpen={setOpenDataPrivacyDialog}
        onConfirm={handleDataPrivacyConfirmation}
      />
      <CreateReportForm
        open={openDialog}
        setOpen={setOpenDialog}
        values={values}
        setValues={setValues}
        gender={gender}
        setGender={setGender}
        lastSeenDateTime={lastSeenDateTime}
        setLastSeenDateTime={setLastSeenDateTime}
        alert={alert}
        setAlert={setAlert}
        isSubmitted={isSubmitted}
        setSubmissionState={setSubmissionState}
        setOpenDataPrivacyDialog={setOpenDataPrivacyDialog}
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
          <Button variant="contained" onClick={() => setOpenDialog(true)}>Report</Button>
        </Stack>
      </Paper>
    </>
  );
}

//Handle submission of Report and Manage form


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
  Divider
} from "@mui/material";

import { useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";


export default function ReportToManage() {
  const [gender, setGender] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      lastSeen: e.currentTarget.lastSeen.value,
      age: e.currentTarget.age.value,
      gender: gender,
      status: "pending",
    };
    //Create new report
    const data = await createReport(body);

    if (data) {
      Router.push(`/reports/create-account/${data.data._id}`);
    }
  };
  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5">Report and manage</Typography>
        <Typography sx={{ my: 2 }} variant="body1">
          Manage, and keep updated on the report you have filed.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack sx={{ mb: 3 }} direction="row" spacing={1} alignItems="center">
            <TextField
              id="age"
              label="Age"
              name="age"
              variant="outlined"
              type="text"
              size="small"
              required
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
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
          <Stack sx={{ mb: 2 }} direction="row" spacing={1} alignItems="center">
            {/*First name*/}
            <TextField
              id="firstName"
              label="First Name"
              variant="outlined"
              name="firstName"
              type="text"
              size="small"
              fullWidth
              required
            />
            {/*Last name*/}
            <TextField
              id="lastName"
              label="Last Name"
              variant="outlined"
              name="lastName"
              type="text"
              size="small"
              fullWidth
              required
            />
          </Stack>
          {/*Last seen*/}
          <TextField
            id="lastSeen"
            label="Last Seen"
            variant="outlined"
            name="lastSeen"
            type="text"
            size="small"
            fullWidth
            required
          />
          <Button
            startIcon={<ArticleIcon />}
            size="small"
            sx={{ my: 2 }}
            type="submit"
            variant="contained"
          >
            Report
          </Button>
        </form>
      </Paper>
    </>
  );
}

//Handle submission of Report and Manage form

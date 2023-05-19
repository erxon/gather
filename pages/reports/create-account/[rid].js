import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import {
  Chip,
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ReportPhoto from "@/components/photo/ReportPhoto";
import { sendNotification } from "@/lib/api-lib/api-notifications";
import {
  getSingleReport,
  updateReportOnSignup,
} from "@/lib/api-lib/api-reports";
//Signup user
//Update the report

export default function CreateAccount({ data }) {
  //Initialize user using useUser hook
  const [user, { mutate }] = useUser();
  //Control input fields
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };
  //Handle submit for signup and report update.
  const handleSubmit = async () => {
    //Signup the user first
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        type: "citizen",
      }),
    });
    //Get the data
    const userObj = await res.json();

    //If the res.status is 201, add the username and account of the user in the report
    if (res.status === 201) {
      //update report (Add try catch)
      const response = await updateReportOnSignup(data._id, {
        username: userObj.username,
        account: userObj.userId,
      });
      console.log(response);
      //send notification to the Notifications dashboard (Add try catch)
      await sendNotification({
        firstName: data.firstName,
        lastName: data.lastName,
        lastSeen: data.lastSeen,
        reportId: data._id,
        reporter: userObj.username,
      });
      //Update user
      mutate(userObj);
      // Router.push(`/reports/edit/${response.data._id}`)
    }
  };

  //if the user is authenticated, redirect to "/myreport" page
  useEffect(() => {
    if (user) {
      Router.push("/myreport");
    }
  }, [user]);

  const reportedAt = new Date(data.reportedAt);
  return (
    <>
    <Box sx={{margin: 'auto', width: {xs: '100%', md: '50%'}}}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5">Create your account</Typography>
      </Box>
      
      {data.photo ? (
        <ReportPhoto publicId={data.photo} />
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" sx={{mb: 1}}>Your report</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="h4">
                {data.firstName} {data.lastName}
              </Typography>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={data.status}
              />
            </Box>
            <Box>
              <Stack spacing={0.5}>
                <Typography variant="body1">{data.lastSeen}</Typography>
                <Typography variant="body2">
                  {data.gender}, {data.age} years old
                </Typography>
                <Stack>
                  <Typography variant="body2">
                    {reportedAt.toDateString()}{" "}
                    {reportedAt.toLocaleTimeString()}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography sx={{ mb: 2 }} variant="h6">
          Signup
        </Typography>
        <TextField
          variant="outlined"
          label="username"
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <br />
        <TextField
          margin="dense"
          variant="outlined"
          label="email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <br />
        <TextField
          margin="dense"
          variant="outlined"
          label="password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <br />
        <Button
          sx={{ mt: 2 }}
          fullWidth
          variant="contained"
          onClick={handleSubmit}
        >
          Signup
        </Button>
      </Paper>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { rid } = context.params;
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
}

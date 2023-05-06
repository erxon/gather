import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import { Chip, Typography, Stack, Box, TextField, Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ReportPhoto from "@/components/photo/ReportPhoto";
import { sendNotification } from "@/lib/api-lib/api-notifications";
import { getSingleReport, updateReportOnSignup } from "@/lib/api-lib/api-reports";
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
      console.log(response)
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
      <Typography variant="h6">Report</Typography>
      <Typography variant="body1">
        To manage this report, you need to create an account.
      </Typography>
      {data.photo ? (
        <ReportPhoto publicId={data.photo} />
      ) : (
        <Box sx={{ my: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5">
              {data.firstName} {data.lastName}
            </Typography>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={data.status}
            />
          </Stack>
          <Stack
            sx={{ mb: 2 }}
            direction="row"
            alignItems="center"
            spacing={0.5}
          >
            <Typography variant="body2">{data.lastSeen}</Typography>
            <PlaceIcon color="primary" />
          </Stack>

          <Typography variant="body2">
            {data.gender}, {data.age} years old
          </Typography>
          <Stack>
            <Typography variant="body2">
              {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
            </Typography>
          </Stack>
        </Box>
      )}
      <Box>
        <Typography sx={{ mb: 2 }} variant="h6">
          Signup
        </Typography>
        <TextField
          variant="filled"
          size="small"
          label="username"
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
        />
        <br />
        <TextField
          margin="dense"
          variant="filled"
          size="small"
          label="email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <br />
        <TextField
          margin="dense"
          variant="filled"
          size="small"
          label="password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
        />
        <br />
        <Button
          sx={{ mt: 2 }}
          size="small"
          variant="contained"
          onClick={handleSubmit}
        >
          Signup
        </Button>
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

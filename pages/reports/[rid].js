/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/

import Router from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";

//Share Buttons
import FacebookButton from "@/components/socialMediaButtons/FacebookButton";
import TwitterButton from "@/components/socialMediaButtons/TwitterButton";

import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function ReportPage({ data }) {
  const reportedAt = new Date(data.reportedAt);
  const [user, { mutate }] = useUser();
  const [authorized, isAuthorized] = useState(false);
  //Checks if the user is authorized
  useEffect(() => {
    if (!user) {
      return;
    } else {
      if (user.username === data.username || user.type === "authority") {
        isAuthorized(true);
      } else {
        isAuthorized(false);
      }
    }
  }, [user]);
  //Delete report
  const handleDelete = async () => {
    const res = await deleteReport(data._id);
    console.log(res);
    if (res === 200) {
      Router.push("/reportDashboard");
    }
  };
  console.log(data);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1"> Reported by </Typography>{" "}
        {data.reporter && (
          <Box>
            <Typography variant="body2">
              {data.reporter.firstName} {data.reporter.lastName}
            </Typography>
            <Typography variant="body2">
              {data.reporter.contactNumber}
            </Typography>
            <Typography variant="body2">{data.reporter.email}</Typography>
          </Box>
        )}
        {Object.hasOwn(data, "username") && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2">
              <Link href={`/reports/edit/${data.account}`}>
                {data.username}
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
      {authorized && (
        <Button
          sx={{ mb: 2 }}
          variant="outlined"
          startIcon={<EditIcon />}
          href={`/reports/edit/${data._id}`}
          size="small"
        >
          Edit
        </Button>
      )}
      <Grid container spacing={2}>
        {/*Basic Information */}

        <Grid item xs={12} md={8}>
          <Box>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4">
                    {data.firstName} {data.lastName}
                  </Typography>
                  {data.status === "pending" && (
                    <Typography color="GrayText">
                      This case is not yet verified
                    </Typography>
                  )}
                  <Typography sx={{ mt: 2 }} variant="body2">
                    Reportedly missing: <br />
                    {reportedAt.toDateString()}{" "}
                    {reportedAt.toLocaleTimeString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon />
                      <Typography variant="body1">
                        {data.age} years old, {data.gender}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PlaceIcon />
                      <Typography variant="body1">{data.lastSeen}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <EmailIcon />

                      {data.email ? (
                        <Typography variant="body1">{data.email} </Typography>
                      ) : (
                        <Typography color="GrayText" variant="body1">
                          Edit this report to add an email
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  {data.photo ? (
                    <ReportPhoto publicId={data.photo} />
                  ) : (
                    <img
                      style={{ maxWidth: "100%", height: "auto" }}
                      src="/assets/placeholder.png"
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
            {/*Features, Email, Social Media Accounts */}
            <Paper sx={{ p: 3, my: 2 }}>
              <Typography variant="h6">Features</Typography>
              {data.features.length > 0 ? (
                data.features.map((feature) => {
                  return <Typography>{feature}</Typography>;
                })
              ) : (
                <Typography color="GrayText">
                  Edit this report to add features
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography sx={{ mb: 2 }} variant="h6">
                Social Media Accounts
              </Typography>
              {data.socialMediaAccounts ? (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FacebookIcon />
                    {data.socialMediaAccounts.facebook != "" ? (
                      <Typography>
                        {data.socialMediaAccounts.facebook}
                      </Typography>
                    ) : (
                      <Typography color="GrayText">
                        Link a Facebook account
                      </Typography>
                    )}
                  </Stack>
                  <Stack
                    sx={{ mt: 1 }}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <TwitterIcon />
                    {data.socialMediaAccounts.twitter != "" ? (
                      <Typography>
                        {data.socialMediaAccounts.twitter}
                      </Typography>
                    ) : (
                      <Typography color="GrayText">
                        Link a Twitter account
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Typography color="GrayText">
                  Edit this report to add social media accounts of the missing
                </Typography>
              )}
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          {data.status === "active" && authorized && (
            <Paper sx={{ p: 3 }}>
              <Typography sx={{ mb: 2 }} variant="h6">
                Share
              </Typography>
              <Stack spacing={2}>
                <FacebookButton />
                <TwitterButton />
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;
  //Get single report
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
};

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
  Chip,
  CircularProgress,
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
import Image from "next/image";
import calculateTimeElapsed from "@/utils/calculateTimeElapsed";

export default function ReportPage({ data }) {
  const [user, { mutate, loading }] = useUser();
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
  }, [user, data.username, loading]);
  if(loading) return <CircularProgress />

  //Delete report
  const handleDelete = async () => {
    const res = await deleteReport(data._id);
    console.log(res);
    if (res === 200) {
      Router.push("/reportDashboard");
    }
  };
  const reportedAt = new Date(data.reportedAt);
  const timeElapsed = calculateTimeElapsed(reportedAt);

  return (
    <>
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
              <Link href={`/profile/${data.account}`}>{data.username}</Link>
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
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                      {data.firstName} {data.lastName}
                    </Typography>
                    <Chip label={data.status} size="small" color="secondary" />
                  </Box>
                  {data.status === "pending" && (
                    <Typography color="GrayText">
                      This case is not yet verified
                    </Typography>
                  )}
                  <Typography sx={{ mt: 2 }}>{timeElapsed}</Typography>
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
                          {user && user.username === data.username
                            ? "Edit this report to add an email"
                            : "No email to show"}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  {data.photo ? (
                    <ReportPhoto
                      publicId={data.photo}
                    />
                  ) : (
                    <Image
                      width={100}
                      height={100}
                      alt="placeholder"
                      src="/assets/placeholder.png"
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
            {/*Features, Email, Social Media Accounts */}
            <Paper sx={{ p: 3, my: 2 }}>
              <Typography variant="h6">Features</Typography>
              {data.features && data.features.length > 0 ? (
                data.features.map((feature) => {
                  return <Typography key={feature}>{feature}</Typography>;
                })
              ) : (
                <Typography color="GrayText">
                  {user && user.username === data.username
                    ? "Edit this report to add features"
                    : "No features added yet"}
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
                        {user && user.username === data.username
                          ? "Link a Facebook account"
                          : "No Facebook account linked"}
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
                        {user && user.username === data.username
                          ? "Link a twitter account"
                          : "No twitter account linked"}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ) : (
                <Typography color="GrayText">
                  {user && user.username === data.username
                    ? "Edit this report to add social media accounts"
                    : "No social media accounts to show"}
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
                <FacebookButton name={data.firstName} url={`https://gather-plum.vercel.app/reports/${data._id}`} />
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;
  
  //Get single report
  const data = await getSingleReport(rid);
  console.log(data)
  return {
    props: { data },
  };
};

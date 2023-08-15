/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/

import Router from "next/router";
import { useEffect, useState } from "react";
import { fetcher, useUser } from "@/lib/hooks";
import ReportPhoto from "@/components/photo/ReportPhoto";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Paper,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  CardActions,
} from "@mui/material";
import { getSingleReport, deleteReport } from "@/lib/api-lib/api-reports";
import SectionHeader from "@/utils/SectionHeader";
import useSWR from "swr";

//Share Buttons
import FacebookButton from "@/components/socialMediaButtons/FacebookButton";

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import Image from "next/image";
import calculateTimeElapsed from "@/utils/calculateTimeElapsed";
import { useRouter } from "next/router";

import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import TabLayout from "@/components/reports/TabLayout";

function ReferencePhotos({ reportId }) {
  const { data, error, isLoading } = useSWR(
    `/api/photos/report/${reportId}`,
    fetcher
  );
  if (error)
    return <Typography>Something went wrong fetching photo.</Typography>;
  if (isLoading) return <CircularProgress />;
  return (
    <Box>
      <Typography variant="body1">Reference Photos</Typography>
      {data ? (
        data.images.map((image) => {
          return (
            <ReportPhotoSmall
              key={image._id}
              publicId={`report-photos/${image.publicId}`}
            />
          );
        })
      ) : (
        <Typography color="GrayText">
          Please add reference photos. This will help our system to accurately
          match the report to photos being submitted.
        </Typography>
      )}
    </Box>
  );
}

function Reporter({ account }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`/api/user/${account}`, fetcher);

  if (error)
    return <Typography>Something went wrong fetching the user.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <div>
      <Card sx={{ display: "flex", alignItems: "flex-start", p: 1 }}>
        <CardActions>
          <IconButton
            onClick={() => {
              router.push(`/profile/${account}`);
            }}
          >
            <ProfilePhotoAvatar publicId={data.user.photo} />
          </IconButton>
        </CardActions>
        <CardContent>
          <Typography sx={{ fontWeight: "bold" }}>
            {data.user.firstName} {data.user.lastName}
          </Typography>
          <Chip size="small" label={data.user.type} />
          <Typography sx={{ mt: 1 }} variant="body2">
            {data.user.username}
          </Typography>
          <Typography variant="body2">{data.user.email}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function SocialMediaShareButtons({ firstName, id }) {
  return (
    <Paper sx={{ p: 3, mb: 1 }}>
      <SectionHeader icon={<PublicOutlinedIcon />} title="Share" />
      <Box sx={{ mt: 2 }}>
        <FacebookButton
          name={firstName}
          url={`https://gather-plum.vercel.app/reports/${id}`}
        />
      </Box>
    </Paper>
  );
}

function ReportDetails({ details }) {
  return (
    <Paper sx={{ p: 3, mb: 1 }}>
      <SectionHeader icon={<NotesOutlinedIcon />} title="Details" />
      <Typography variant="body1" sx={{ my: 2 }}>
        {details}
      </Typography>
      <Button size="small">View all</Button>
    </Paper>
  );
}

function Features({ features, username, user }) {
  return (
    <Paper sx={{ p: 3, mb: 1 }}>
      <SectionHeader
        icon={<FormatListBulletedOutlinedIcon />}
        title="Features"
      />
      {features && features.length > 0 ? (
        features.map((feature) => {
          return <Typography key={feature}>{feature}</Typography>;
        })
      ) : (
        <Typography sx={{ my: 2 }} color="GrayText">
          {user && user.username === username
            ? "Edit this report to add features"
            : "No features added yet"}
        </Typography>
      )}
    </Paper>
  );
}

function SocialMediaAccounts({ socialMediaAccounts, username, user }) {
  return (
    <Paper sx={{ p: 3 }}>
      <SectionHeader
        icon={<GroupOutlinedIcon />}
        title="Social Media Accounts"
      />
      {socialMediaAccounts ? (
        <Box sx={{ my: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FacebookIcon />
            {socialMediaAccounts.facebook != "" ? (
              <Typography>{socialMediaAccounts.facebook}</Typography>
            ) : (
              <Typography color="GrayText">
                {user && user.username === username
                  ? "Link a Facebook account"
                  : "No Facebook account linked"}
              </Typography>
            )}
          </Stack>
          <Stack sx={{ mt: 1 }} direction="row" alignItems="center" spacing={1}>
            <TwitterIcon />
            {socialMediaAccounts.twitter != "" ? (
              <Typography>{socialMediaAccounts.twitter}</Typography>
            ) : (
              <Typography color="GrayText">
                {user && user.username === username
                  ? "Link a twitter account"
                  : "No twitter account linked"}
              </Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Typography color="GrayText">
          {user && user.username === username
            ? "Edit this report to add social media accounts"
            : "No social media accounts to show"}
        </Typography>
      )}
    </Paper>
  );
}

export default function ReportPage({ data }) {
  const router = useRouter();
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

  if (loading) return <CircularProgress />;

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
      <TabLayout reportId={data._id} index={0}>
        <Box>
          {authorized && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                router.push(`/reports/edit/${data._id}`);
              }}
              size="small"
            >
              Edit
            </Button>
          )}

          <Grid container sx={{ mt: 1 }} spacing={2}>
            {/*Basic Information */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      {data.photo ? (
                        <ReportPhoto publicId={data.photo} />
                      ) : (
                        <Image
                          width={150}
                          height={150}
                          style={{ objectFit: "cover" }}
                          alt="placeholder"
                          src="/assets/placeholder.png"
                        />
                      )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {data.firstName && data.lastName.length
                            ? `${data.firstName} ${data.lastName}`
                            : "Unknown"}
                        </Typography>
                        <Chip
                          label={data.status}
                          size="small"
                          color="primary"
                        />
                      </Stack>
                      {data.status === "active" && (
                        <Typography variant="subtitle2" component="label">
                          This is an active report, and already verified by
                          authorities
                        </Typography>
                      )}
                      {data.status === "pending" && (
                        <Typography color="GrayText">
                          This case is not yet verified
                        </Typography>
                      )}
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Its been{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {timeElapsed}
                        </span>{" "}
                        since{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {data.firstName}{" "}
                        </span>
                        reportedly missing{" "}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        Reportedly missing on:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {" "}
                          {reportedAt.toDateString()}{" "}
                          {reportedAt.toLocaleTimeString()}
                        </span>
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Stack
                          sx={{ mb: 0.75 }}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <PersonIcon />
                          {data.age && data.gender ? (
                            <Typography variant="body1">
                              {data.age} years old, {data.gender}
                            </Typography>
                          ) : (
                            <Typography variant="body1" color="GrayText">
                              Unknown age and gender.
                            </Typography>
                          )}
                        </Stack>
                        <Stack
                          sx={{ mb: 0.75 }}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <PlaceIcon />
                          {data.reporter ? (
                            <Typography variant="body1">
                              {data.reporter.location}
                            </Typography>
                          ) : (
                            <Typography variant="body1">
                              {data.lastSeen}
                            </Typography>
                          )}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EmailIcon />
                          {data.email ? (
                            <Typography variant="body1">
                              {data.email}{" "}
                            </Typography>
                          ) : (
                            <Typography color="GrayText" variant="body1">
                              {user && user.username === data.username
                                ? "Edit this report to add an email"
                                : "No email to show"}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <ReferencePhotos reportId={data._id} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              {/*Reporter information */}
              <Reporter account={data.account} />
              <Box sx={{ mt: 4 }}>
                {/***********Social Media Share Buttons***********/}
                {data.status === "active" && authorized && (
                  <SocialMediaShareButtons
                    firstName={data.firstName}
                    id={data.id}
                  />
                )}
                {/***********Report Details***********/}
                <ReportDetails details={data.details} />
                {/***********Features***********/}
                <Features
                  features={data.features}
                  username={data.username}
                  user={user}
                />
                {/***********Social Media Accounts***********/}
                <SocialMediaAccounts
                  socialMediaAccounts={data.socialMediaAccounts}
                  username={data.username}
                  user={user}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </TabLayout>
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { rid } = params;

  //Get single report
  const data = await getSingleReport(rid);
  console.log(data);
  return {
    props: { data },
  };
};

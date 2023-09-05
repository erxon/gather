/*
This page renders a single report using report ID.
It checks if the user owns the report or if the user.type is authority.
If so, the user could edit or delete the report.
*/
import React from "react";
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
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
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reference Photos
      </Typography>
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
      <Card
        variant="outlined"
        sx={{ display: "flex", alignItems: "flex-start", p: 1 }}
      >
        <CardActions>
          <IconButton
            onClick={() => {
              router.push(`/profile/${account}`);
            }}
          >
            {data.photo ? (
              <ProfilePhotoAvatar publicId={data.user.photo} />
            ) : (
              <Image
                style={{ borderRadius: "100%" }}
                width="56"
                height="56"
                src="/assets/placeholder.png"
              />
            )}
          </IconButton>
        </CardActions>
        <CardContent>
          <Typography sx={{ fontWeight: "bold" }}>
            {data.user.firstName} {data.user.lastName}
          </Typography>
          <Chip sx={{ mr: 1 }} size="small" label={data.user.type} />
          <Chip size="small" label={data.user.status} />
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

function ReportProcessing({ currentUser, report, users }) {
  const [assign, assignTo] = useState(currentUser._id);
  const [status, setStatus] = useState(report.status);
  const [result, setResult] = useState(report.result);
  const [stateWhenFound, setStateWhenFound] = useState(report.state);
  const [noteContent, setNoteContent] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const snackbarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          setSnackbar({
            open: false,
            message: "",
          });
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleNotes = (event) => {
    setNoteContent(event.target.value);
  };

  const handleAssignment = (event) => {
    console.log(event.target.value);
    assignTo(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleResultChange = (event) => {
    setResult(event.target.value);
  };

  const handleStateWhenFound = (event) => {
    setStateWhenFound(event.target.value);
  };

  const handleSave = async () => {
    // const updates = {
    //   edittedBy: currentUser._id,
    //   reportId: report._id,
    //   note: note,
    //   assignedTo: assign,
    //   status: status,
    //   result: result,
    //   stateWhenFound: stateWhenFound,
    // };

    const newNote = {
      content: noteContent,
      createdAt: new Date(),
      user: currentUser._id,
    };

    report.notes.push(newNote);

    //Update report
    const updateReport = await fetch(`/api/reports/${report._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: report.notes,
        status: status,
        result: result,
        state: stateWhenFound,
        assignedTo: assign,
      }),
    });

    const updateReportResult = await updateReport.json();

    const createLog = await fetch("/api/reports/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: report._id,
        oldState: JSON.stringify(updateReportResult.data),
        changes: JSON.stringify(updateReportResult.update),
      }),
    });

    if (createLog.status === 200) {
      setSnackbar({
        open: true,
        message: "Updated successfully",
      });
      setNoteContent("");
      setStatus(updateReportResult.data.status);
      assignTo(updateReportResult.data.assignedTo);
      setResult(updateReportResult.data.result);
      setResult(updateReportResult.data.result);
      setStateWhenFound(updateReportResult.data.state);
    } else {
      setSnackbar({
        open: true,
        message: "Something went wrong",
      });
    }
  };

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar({
            open: false,
            message: "",
          });
        }}
        message={snackbar.message}
        action={snackbarAction}
      />
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2}>
              {currentUser.photo ? (
                <ProfilePhotoAvatar publicId={currentUser.photo} />
              ) : (
                <Image
                  style={{ borderRadius: "100%" }}
                  width="56"
                  height="56"
                  src="/assets/placeholder.png"
                />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography sx={{ mb: 1 }} variant="body2">
                  {currentUser.username}
                </Typography>
                <Chip label={currentUser.type} size="small" />
              </Box>
            </Stack>
          </Box>
        </Box>
        <TextField
          value={noteContent}
          onChange={handleNotes}
          fullWidth
          rows={4}
          multiline
          placeholder="Note"
        />
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={3}>
            {/*List users*/}
            <FormControl size="small" fullWidth>
              <InputLabel id="select_user">Assign to</InputLabel>
              <Select
                label="Assign to"
                labelId="select_user"
                value={assign}
                onChange={handleAssignment}
              >
                {users
                  .filter((user) => {
                    return user.type === "authority";
                  })
                  .map((user) => {
                    return (
                      <MenuItem value={user._id}>
                        <Typography>
                          {user.firstName} {user.lastName}
                          {user._id === currentUser._id && (
                            <span
                              style={{
                                fontWeight: "bold",
                                fontStyle: "italic",
                              }}
                            >
                              {" "}
                              you
                            </span>
                          )}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            {/*Status*/}
            <FormControl size="small" fullWidth>
              <InputLabel id="set_status">Set status</InputLabel>
              <Select
                labelId="set_status"
                label="Set Status"
                value={status}
                onChange={handleStatusChange}
              >
                <MenuItem value={"pending"}>Pending</MenuItem>
                <MenuItem value={"under verification"}>
                  Under verification
                </MenuItem>
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"close"}>Close</MenuItem>
                <MenuItem value={"archive"}>Archive</MenuItem>
              </Select>
            </FormControl>
            {status === "close" && (
              <FormControl size="small" fullWidth>
                <InputLabel id="result">Result</InputLabel>
                <Select
                  labelId="result"
                  label="Result"
                  value={result}
                  onChange={handleResultChange}
                >
                  <MenuItem value={"found"}>Found</MenuItem>
                  <MenuItem value={"not found"}>Not Found</MenuItem>
                </Select>
              </FormControl>
            )}
            {result === "found" && (
              <FormControl size="small" fullWidth>
                <InputLabel id="state_when_found">State when found</InputLabel>
                <Select
                  labelId="state_when_found"
                  label="State when found"
                  value={stateWhenFound}
                  onChange={handleStateWhenFound}
                >
                  <MenuItem value={"deceased"}>Deceased</MenuItem>
                  <MenuItem value={"alive"}>Alive</MenuItem>
                </Select>
              </FormControl>
            )}
            {/* Save */}
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Stack>
          <Typography sx={{ mb: 1, mt: 1 }}>
            Search database for existing report.
          </Typography>
          <Button size="small" startIcon={<SearchIcon />} variant="contained">
            Search
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

function ReportProcessingInitializer({ currentUser, report }) {
  const { data, isLoading, error } = useSWR("/api/users", fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  return (
    <ReportProcessing
      currentUser={currentUser}
      report={report}
      users={data.users}
    />
  );
}

export default function ReportPage({ data }) {
  const router = useRouter();
  const [user, { mutate, loading }] = useUser();
  const [authorized, isAuthorized] = useState(false);
  const [logs, setLogs] = useState([{}]);
  const [arrowDown, isArrowDown] = useState(true);
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
          <Box sx={{ mt: 3 }}>
            <Typography>Editted by: </Typography>
            <Typography>September 4, 2023</Typography>
          </Box>
          {user.type === "authority" &&
            user.role === "reports administrator" && (
              <ReportProcessingInitializer currentUser={user} report={data} />
            )}
          {/*Basic Information */}
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>
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
                    {/*Name*/}
                    {/*******************************************/}
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                      {data.firstName && data.lastName.length
                        ? `${data.firstName} ${data.lastName}`
                        : "Unknown"}
                    </Typography>
                    {/*Status*/}
                    {/*******************************************/}
                    <Chip label={data.status} size="small" />
                  </Stack>
                  {/*Note*/}
                  {/*******************************************/}
                  {data.status === "active" && (
                    <Typography variant="body2" component="label">
                      This is an active report, and already verified by
                      authorities
                    </Typography>
                  )}
                  {data.status === "pending" && (
                    <Typography variant="body2" color="GrayText">
                      This case is not yet verified
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Its been{" "}
                    <span style={{ fontWeight: "bold" }}>{timeElapsed}</span>{" "}
                    since{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {data.firstName}{" "}
                    </span>
                    reportedly missing{" "}
                  </Typography>
                  <Typography variant="body2">
                    Reportedly missing on:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {" "}
                      {reportedAt.toDateString()}{" "}
                      {reportedAt.toLocaleTimeString()}
                    </span>
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ mb: 2 }}>Reported by: </Typography>
                  <Reporter account={data.account} />
                </Box>
              </Stack>
            </Paper>
            <Grid container sx={{ mt: 3 }} spacing={1}>
              <Grid item xs={12} md={6}>
                {/*Reference photos*/}
                {/*******************************************/}
                <Paper sx={{ p: 3 }}>
                  <ReferencePhotos reportId={data._id} />
                </Paper>

                {/*Information*/}
                {/*******************************************/}
                <Paper sx={{ p: 3, mt: 2 }}>
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
                      <Typography variant="body1">{data.lastSeen}</Typography>
                    )}
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
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                {/*Social Media Share Buttons*/}
                {/*******************************************/}
                {data.status === "active" && authorized && (
                  <SocialMediaShareButtons
                    firstName={data.firstName}
                    id={data.id}
                  />
                )}
                {/*Report Details*/}
                {/*******************************************/}

                <ReportDetails details={data.details} />

                {/*Features*/}
                {/*******************************************/}
                <Features
                  features={data.features}
                  username={data.username}
                  user={user}
                />

                {/*Social Media Accounts*/}
                {/*******************************************/}
                <SocialMediaAccounts
                  socialMediaAccounts={data.socialMediaAccounts}
                  username={data.username}
                  user={user}
                />
              </Grid>
            </Grid>
          </Box>
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

import calculateTimeElapsed from "@/utils/calculateTimeElapsed";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookButton from "@/components/socialMediaButtons/FacebookButton";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import InfoIcon from "@mui/icons-material/Info";
import SectionHeader from "@/utils/SectionHeader";
import ReportPhoto from "@/components/photo/ReportPhoto";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
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
  CardMedia,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import SmallMap from "@/components/map/SmallMap";

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
        <Grid container spacing={0.5}>
          {data.images.map((image) => {
            return (
              <Grid item key={image._id}>
                <ReportPhotoSmall
                  publicId={`report-photos/${image.publicId}`}
                />
              </Grid>
            );
          })}
        </Grid>
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
    <Paper sx={{ p: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Reporter
      </Typography>
      <Card
        variant="outlined"
        sx={{ display: "flex", alignItems: "flex-start", p: 3 }}
      >
        <CardMedia>
          {data.photo ? (
            <ProfilePhotoAvatar publicId={data.user.photo} />
          ) : (
            <Image
              alt="placeholder image for profile photo"
              style={{ borderRadius: "100%" }}
              width="56"
              height="56"
              src="/assets/placeholder.png"
            />
          )}
        </CardMedia>
        <Box>
          <CardContent sx={{ p: 0, ml: 2 }}>
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
          <CardActions>
            <Button>Profile</Button>
          </CardActions>
        </Box>
      </Card>
    </Paper>
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

function ExistingPhoto({ photoId }) {
  const { data, isLoading, error } = useSWR(`/api/photos/${photoId}`, fetcher);

  if (error)
    return (
      <Typography variant="body2">
        Something went wrong fetching the photo
      </Typography>
    );
  if (isLoading) return <CircularProgress />;

  return <ReportPhoto publicId={`query-photos/${data.image}`} />;
}

function DisplayReportPhoto({ photoId, photo }) {
  if (photo) {
    return <ReportPhoto publicId={photo} />;
  } else if (photoId) {
    return <ExistingPhoto photoId={photoId} />;
  } else {
    return <Image width={200} height={250} src="/assets/placeholder.png" />;
  }
}

export default function ReportInformation({ authorized, data, user }) {
  const reportedAt = new Date(data.reportedAt);
  const timeElapsed = calculateTimeElapsed(reportedAt);

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <DisplayReportPhoto photoId={data.photoId} photo={data.photo} />
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
                This is an active report, and already verified by authorities
              </Typography>
            )}
            {data.status === "pending" && (
              <Typography variant="body2" color="GrayText">
                This case is not yet verified
              </Typography>
            )}
            <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
              <Stack direction="row" alignItems="flex-start" spacing={1}>
                <InfoIcon color="primary" />
                {data.status === "archive" || data.status === "close" ? (
                  <Box>
                    <Typography variant="body2">
                      This report is now closed
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mt: 1 }}
                    >
                      Summary
                    </Typography>
                    <Typography variant="body2">
                      The report was created on{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date(data.reportedAt).toDateString()}
                      </span>{" "}
                      and was closed on{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date(data.updatedAt).toDateString()}
                      </span>
                    </Typography>
                    <Typography variant="body2">
                      The person was {data.result} {data.state}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
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
                )}
              </Stack>
            </Paper>
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PlaceIcon fontSize="small" />
                {data.reporter ? (
                  <Typography variant="body2">
                    {data.reporter.location}
                  </Typography>
                ) : (
                  <Typography variant="body2">{data.lastSeen}</Typography>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon fontSize="small" />
                {data.email ? (
                  <Typography variant="body2">{data.email} </Typography>
                ) : (
                  <Typography variant="body2">
                    {user && user.username === data.username
                      ? "Edit this report to add an email"
                      : "No email to show"}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon fontSize="small" />
                {data.age && data.gender ? (
                  <Typography variant="body2">
                    {data.age} years old, {data.gender}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="GrayText">
                    Unknown age and gender.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Paper>
      {/*Current location of the person in the report*/}
      {data.location && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Current Location</Typography>
          <SmallMap
            lng={data.location.longitude}
            lat={data.location.latitude}
          />
        </Paper>
      )}
      {/*Reference photos*/}
      {/*******************************************/}
      <Paper sx={{ p: 3, mt: 2 }}>
        <ReferencePhotos reportId={data._id} />
      </Paper>
      <Grid container sx={{ mt: 3 }} spacing={1}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Reporter account={data.account} />
          </Box>
          {/*Information*/}
          {/*******************************************/}
        </Grid>
        <Grid item xs={12} md={6}>
          {/*Social Media Share Buttons*/}
          {/*******************************************/}
          {data.status === "active" && authorized && (
            <SocialMediaShareButtons firstName={data.firstName} id={data.id} />
          )}
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
  );
}

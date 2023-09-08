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
import SectionHeader from "@/utils/SectionHeader";
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
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";

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

export default function ReportInformation({ authorized, data, user }) {
  const reportedAt = new Date(data.reportedAt);
  const timeElapsed = calculateTimeElapsed(reportedAt);

  return (
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
                This is an active report, and already verified by authorities
              </Typography>
            )}
            {data.status === "pending" && (
              <Typography variant="body2" color="GrayText">
                This case is not yet verified
              </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
              Its been <span style={{ fontWeight: "bold" }}>{timeElapsed}</span>{" "}
              since{" "}
              <span style={{ fontWeight: "bold" }}>{data.firstName} </span>
              reportedly missing{" "}
            </Typography>
            <Typography variant="body2">
              Reportedly missing on:{" "}
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
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
            <SocialMediaShareButtons firstName={data.firstName} id={data.id} />
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
  );
}

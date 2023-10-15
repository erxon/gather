import ReportPhoto from "@/components/photo/ReportPhoto";
import ReportPhotoLarge from "@/components/photo/ReportPhotoLarge";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import { fetcher } from "@/lib/hooks";
import { ampmTimeFormat } from "@/utils/helpers/ampmTimeFormat";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Button,
  Card,
  CardMedia,
  CardActionArea,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  InputAdornment,
  Tooltip,
  CardActions,
  CardContent,
  Chip,
} from "@mui/material";
import { Router, useRouter } from "next/router";
import useSWR from "swr";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";
import IconText from "@/utils/components/IconText";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import SmallMap from "@/components/map/SmallMap";
import StackRowLayout from "@/utils/StackRowLayout";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";

function ReportMatched({ reportId }) {
  const router = useRouter();
  const { data, isLoading, error } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  const { photo, firstName, lastName, reportedAt, lastSeen, age, gender } =
    data;

  const date = new Date(reportedAt);
  const time = ampmTimeFormat(date);
  return (
    <div>
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: "bold" }}>
        Match found
      </Typography>
      <CardActionArea onClick={() => router.push(`/reports/${reportId}`)}>
        <Card
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", height: 100 }}
        >
          <CardMedia>
            {photo && <ReportPhotoSmall publicId={photo} />}
          </CardMedia>
          <CardContent>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "GrayText" }}>
              {date.toDateString()} {time}
            </Typography>
            <Typography variant="body2" sx={{ color: "GrayText" }}>
              {lastSeen}
            </Typography>
            <Typography variant="body2" sx={{ color: "GrayText" }}>
              {age}, {gender}
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </div>
  );
}

function Reporter({ reporter }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar sx={{ width: 56, height: 56 }}>
        <PersonIcon fontSize="large" />
      </Avatar>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {reporter.firstName} {reporter.lastName}
        </Typography>
        <IconText
          icon={<PhoneIcon fontSize="small" htmlColor="GrayText" />}
          text={reporter.contactNumber}
          textStyle={{ color: "GrayText" }}
        />
        <IconText
          icon={<EmailIcon fontSize="small" htmlColor="GrayText" />}
          text={reporter.email}
          textStyle={{ color: "GrayText" }}
        />
      </Box>
    </Stack>
  );
}

function Report({ photo }) {
  const { data, isLoading, error } = useSWR(`/api/photos/${photo}`, fetcher);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;

  return (
    <Box
      sx={{
        height: 250,
        textAlign: "center",
        bgcolor: "#ebebeb",
        borderRadius: "10px",
      }}
    >
      {data && <QueryPhotoLarge publicId={data.image} />}
    </Box>
  );
}

function ShareDialog({ open, setOpen, photoId }) {
  const [tooltipTitle, setTooltipTitle] = useState("copy");
  const url = process.env.API_URL || "http://localhost:3000";
  const handleCopy = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(`${url}/found-person/${photoId}`);
    setTooltipTitle("copied");
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          defaultValue={`${url}/found-person/${photoId}`}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment>
                <Tooltip title={tooltipTitle}>
                  <IconButton size="small" onClick={handleCopy}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function PossibleMatch({ possibleMatch }) {
  const { data, error, isLoading } = useSWR(
    `/api/reports/${possibleMatch}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;

  const {
    firstName,
    middleName,
    lastName,
    qualifier,
    reportedAt,
    status,
    photo,
  } = data;

  const date = new Date(reportedAt);
  const elapsedTime = computeElapsedTime(date);

  return (
    <Card variant="outlined" sx={{ display: "flex", height: 100 }}>
      <CardMedia>
        <ReportPhotoSmall publicId={photo} />
      </CardMedia>
      <CardContent>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {lastName}, {firstName} {middleName} {qualifier}
        </Typography>
        <Typography variant="body2">Reported {elapsedTime}</Typography>
        <Chip size="small" label={status} />
      </CardContent>
    </Card>
  );
}

export default function Page({ data }) {
  const [openShareDialog, setOpenShareDialog] = useState(false);

  return (
    <div>
      <ShareDialog
        photoId={data._id}
        open={openShareDialog}
        setOpen={setOpenShareDialog}
      />
      <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="h6">Summary</Typography>
        <IconButton onClick={() => setOpenShareDialog(true)}>
          <ShareIcon />
        </IconButton>
      </Stack>
      <Box sx={{ mb: 3, p: 2 }}>
        <Reporter reporter={data} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Report photo={data.photoUploaded} />
          </Paper>
          {data.possibleMatch && (
            <Paper sx={{ my: 2, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Possible Match
              </Typography>
              <PossibleMatch possibleMatch={data.possibleMatch} />
            </Paper>
          )}
          <Paper sx={{ p: 2, mt: 1 }}>
            <Stack
              sx={{ mb: 2 }}
              direction="row"
              alignItems="center"
              spacing={0.75}
            >
              <LocationOnIcon />
              <Typography variant="h6">Last known location</Typography>
            </Stack>
            <SmallMap
              lng={data.position.longitude}
              lat={data.position.latitude}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Updates
            </Typography>
            <Typography variant="body2" sx={{mb: 2}}>
              Found Person Code: <span style={{fontWeight: "bold"}}>{data.code}</span>
            </Typography>
            {data.match ? (
              <ReportMatched reportId={data.match} />
            ) : (
              <Typography>No updates yet</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { photoId } = params;
  const url = process.env.API_URL || "http://localhost:3000";
  const response = await fetch(
    `${url}/api/reporters/uploaded-photo/${photoId}`
  );

  const data = await response.json();

  return {
    props: { data: data },
  };
}

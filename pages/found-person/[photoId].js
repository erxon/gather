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
} from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";
import IconText from "@/utils/components/IconText";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QueryPhoto from "@/components/photo/QueryPhoto";
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import QueryPhotoSmall from "@/components/photo/QueryPhotoSmall";
import { useState } from "react";

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
        <Card variant="outlined" sx={{ display: "flex", height: 100 }}>
          <CardMedia>
            {photo && <ReportPhotoSmall publicId={photo} />}
          </CardMedia>
          <Box sx={{ ml: 2, pt: 1, pb: 1 }}>
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
          </Box>
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
      <QueryPhotoLarge publicId={data.image} />
    </Box>
  );
}

function ShareDialog({ open, setOpen, photoId }) {
  const [tooltipTitle, setTooltipTitle] = useState("copy");
  const handleCopy = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(
      `http://localhost:3000/found-person/${photoId}`
    );
    setTooltipTitle("copied");
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          defaultValue={`http://localhost:3000/found-person/${photoId}`}
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

export default function () {
  const router = useRouter();
  const { photoId } = router.query;
  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photoId}`,
    fetcher
  );
  const [openShareDialog, setOpenShareDialog] = useState(false);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong.</Typography>;
  //match found
  //no match found (added to DB)
  return (
    <div>
      <ShareDialog
        photoId={photoId}
        open={openShareDialog}
        setOpen={setOpenShareDialog}
      />
      <Paper sx={{ p: 3 }}>
        <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="h6">Summary</Typography>
          <IconButton onClick={() => setOpenShareDialog(true)}>
            <ShareIcon />
          </IconButton>
        </Stack>
        <Box sx={{ mb: 3 }}>
          <Reporter reporter={data} />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Report photo={photoId} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Updates</Typography>
            {data.match ? (
              <ReportMatched reportId={data.match} />
            ) : (
              <Typography>No updates yet</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

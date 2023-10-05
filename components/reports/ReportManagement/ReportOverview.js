import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import { fetcher } from "@/lib/hooks";
import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
  CardContent,
  Stack,
  Button,
  CardActions,
  Chip,
  Paper,
  Grid,
} from "@mui/material";
import Image from "next/image";
import useSWR from "swr";

import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import { useRouter } from "next/router";
import ReportPhotoLarge from "@/components/photo/ReportPhotoLarge";
import ReportPhoto from "@/components/photo/ReportPhoto";
import AddIcon from "@mui/icons-material/Add";

function Report({ report }) {
  const router = useRouter();
  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          alignItems: { xs: "center", md: "flex-start" },
          flexDirection: "column",
          mb: 2,
          p: 2,
          maxWidth: 300,
        }}
        variant="outlined"
      >
        <CardMedia>
          {report.photo ? (
            <ReportPhotoSmall publicId={report.photo} />
          ) : (
            <Image
              alt="placeholder"
              src="/assets/placeholder.png"
              width={100}
              height={100}
            />
          )}
        </CardMedia>
        <CardContent
          sx={{
            p: 0,
            textAlign: { xs: "center", sm: "row", md: "left" },
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>
              {report.firstName} {report.lastName}
            </Typography>
            <Chip label={report.status} size="small" />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <LocationOnIcon color="disabled" />
            <Typography color="GrayText" variant="body2">
              {report.lastSeen ? report.lastSeen : "Unknown"}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <PersonIcon color="disabled" />
            <Typography color="GrayText" variant="body2">
              {report.age ? report.age : "Unknown age"},{" "}
              {report.gender ? report.gender : "Unknown gender"}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ p: 0, mt: 2 }}>
          <Button
            onClick={() => {
              router.push(`/reports/${report._id}`);
            }}
            size="small"
          >
            View
          </Button>
          <Button
            onClick={() => {
              router.push(`/reports/edit/${report._id}`);
            }}
            size="small"
            sx={{ mr: 1 }}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default function ReportOverview({ username }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `/api/reports/user/${username}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching report.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h5">
        Your Reports
      </Typography>
      <Button
        onClick={() => router.push("/reports/create-report")}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ my: 2 }}
      >
        New Report
      </Button>
      <Grid container spacing={1}>
        {data.data.length > 0 &&
          data.data.map((report, index) => {
            if (index > 1) return;
            return (
              <Grid item key={report._id} xs={12} md={6}>
                <Report report={report} key={report._id} />
              </Grid>
            );
          })}
      </Grid>
      {data.data.length > 0 && (
        <Button sx={{ mt: 1 }} size="small">
          View all
        </Button>
      )}
    </Paper>
  );
}

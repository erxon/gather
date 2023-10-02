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

function Report({ report }) {
  const router = useRouter();
  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row", md: "row" },
          mb: 2,
          p: 1,
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
              width={150}
              height={150}
            />
          )}
        </CardMedia>
        <Box>
          <CardContent
            sx={{ textAlign: { xs: "center", sm: "row", md: "left" } }}
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
        </Box>
      </Card>
      <Button
        onClick={() => {
          router.push(`/reports/${report._id}`);
        }}
        size="small"
        sx={{ mr: 1 }}
      >
        View
      </Button>
      <Button
        onClick={() => {
          router.push(`/reports/edit/${report._id}`);
        }}
        size="small"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
    </Box>
  );
}

export default function ReportOverview({ username }) {
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
        Your Report
      </Typography>
      {data.data &&
        data.data.map((report) => {
          return <Report report={report} key={report._id} />;
        })}
    </Paper>
  );
}

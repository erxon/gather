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

function Report({ report }) {
  const router = useRouter();
  return (
    <Box>
      <Paper sx={{ p: 1 }}>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            flexDirection: { xs: "column", sm: "row", md: "row" },
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
                {report.lastSeen}
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
                {report.age}, {report.gender}
              </Typography>
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                router.push(`/reports/${report._id}`);
              }}
              size="small"
              variant="contained"
            >
              View
            </Button>
            <Button
              onClick={() => {
                router.push(`/reports/edit/${report._id}`);
              }}
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          </CardActions>
        </Card>
        <Box variant="outlined" sx={{ p: 1, mt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FeedOutlinedIcon />
            <Typography sx={{ fontWeight: "bold" }}>Updates</Typography>
          </Stack>
          <Box>
            <Typography sx={{ my: 1 }} variant="body2" color="GrayText">
              Updates will appear here
            </Typography>
          </Box>
        </Box>
      </Paper>
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
    <Box>
      {data.data.map((report) => {
        return <Report report={report} key={report._id} />;
      })}
    </Box>
  );
}

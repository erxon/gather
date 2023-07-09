import { useRouter } from "next/router";
import { fetcher } from "@/lib/hooks";
import useSWR from "swr";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import QueryPhoto from "@/components/photo/QueryPhoto";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import StackRowLayout from "@/utils/StackRowLayout";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function Photo({ photoUploaded }) {
  const { data, error, isLoading } = useSWR(
    `/api/photos/${photoUploaded}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching photo.</Typography>;
  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <QueryPhoto publicId={data.image} />
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const { photoUploaded } = router.query;

  const { data, error, isLoading } = useSWR(
    `/api/reporters/uploaded-photo/${photoUploaded}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching reporter.</Typography>;
  if (isLoading) return <CircularProgress />;

  const reportedDate = new Date(data.createdAt);
  const dateString = reportedDate.toDateString();
  const timeString = reportedDate.toLocaleTimeString();

  return (
    <Box>
      <Card sx={{ display: "flex", flexDirection: {xs: "column", md: "row"}, alignItems: "center", p: 3, maxWidth: 700}}>
        <CardMedia sx={{textAlign: "center"}}>
          <Photo photoUploaded={photoUploaded} />
          <Typography color="GrayText" variant="body2">
            Uploaded {computeElapsedTime(data.createdAt)}
          </Typography>
        </CardMedia>
        <CardContent>
          <Typography sx={{ mb: 0.5, fontWeight: "bold" }} variant="h5">
            {data.firstName} {data.lastName}
            <span>
              <Typography variant="subtitle2">Uploader</Typography>
            </span>
          </Typography>
          <Stack
            sx={{ mb: 0.25 }}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <PhoneIcon color="disabled" />
            <Typography color="GrayText" variant="body2">
              {data.contactNumber} {data.email}
            </Typography>
          </Stack>
          <StackRowLayout spacing={1}>
            <CalendarTodayIcon color="disabled" />
            <Typography color="GrayText" variant="body2">
              {dateString} at {timeString}
            </Typography>
          </StackRowLayout>
        </CardContent>
      </Card>
    </Box>
  );
}

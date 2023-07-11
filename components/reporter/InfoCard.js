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

export default function InfoCard(props) {
  return (
    <Box>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          p: 3,
          maxWidth: 700,
        }}
      >
        <CardMedia sx={{ textAlign: "center" }}>
          <Photo photoUploaded={props.photoUploaded} />
          <Typography color="GrayText" variant="body2">
            Uploaded {computeElapsedTime(props.createdAt)}
          </Typography>
        </CardMedia>
        <CardContent>
          <Typography sx={{ mb: 0.5, fontWeight: "bold" }} variant="h5">
            {props.firstName} {props.lastName}
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
              {props.contactNumber} {props.email}
            </Typography>
          </Stack>
          <StackRowLayout spacing={1}>
            <CalendarTodayIcon color="disabled" />
            <Typography color="GrayText" variant="body2">
              {props.dateString} at {props.timeString}
            </Typography>
          </StackRowLayout>
        </CardContent>
      </Card>
    </Box>
  );
}

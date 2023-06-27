import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";
import Image from "next/image";
import Authenticate from "@/utils/authority/Authenticate";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import ReportPhoto from "@/components/photo/ReportPhoto";

import IconTypography from "@/utils/layout/IconTypography";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StackRow from "@/utils/StackRow";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";

function DisplayReportDetails({ reportId, distance }) {
  const router = useRouter()
  const { data, error, isLoading } = useSWR(
    `/api/reports/${reportId}`,
    fetcher
  );
  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;
  if (data) {
    return (
      <Box>
        <Paper
          sx={{
            p: 3,
          }}
          variant="outlined"
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {data.photo ? (
              <ReportPhoto publicId={data.photo} />
            ) : (
              <Image
                width={150}
                height={150}
                src="/assets/placeholder.png"
                alt="placeholder"
              />
            )}
            <Box>
              <Typography>Distance {Math.round(distance * 100)}%</Typography>
              <Typography variant="h6">
                {data.firstName} {data.lastName}
              </Typography>
              <IconTypography
                customStyles={{ mb: 0.5 }}
                Icon={<PlaceIcon />}
                content={data.lastSeen}
              />
              <IconTypography
                Icon={<PersonIcon />}
                content={`${data.gender}, ${data.age}`}
                customStyles={{ mb: 0.5 }}
              />
              <Button
                onClick={() => {router.push(`/reports/${reportId}`)}}
                size="small"
                variant="contained"
              >
                View
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    );
  }
}

function GetReport({ photoId, distance }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);

  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;
  if (data) {
    return (
      <DisplayReportDetails reportId={data.reportId} distance={distance} />
    );
  }
}

function FindMatches({ queryPhotoId }) {
  const [isReset, setReset] = useState(false);
  const { data, error, isLoading, mutate } = useSWRImmutable(
    `/api/face-recognition/${queryPhotoId}`,
    fetcher
  );

  if (error)
    return <Typography>Something went wrong fetching matches.</Typography>;
  if (isLoading) return <CircularProgress />;

  const handleReset = async (id) => {
    const reset = await fetch(`/api/face-recognition/reset/${id}`, {
      method: "DELETE",
    });

    await reset.json();

    mutate({});
  };
  const handleReload = async () => {
    setReset(true);
    const reload = await fetch("/api/face-recognition/reload", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId: queryPhotoId }),
    });

    const result = await reload.json();

    mutate(result.data);
    setReset(false);
  };

  return (
    <Box>
      {data && (
        <Box sx={{ mb: 2 }}>
          <Button
            disabled={isReset}
            onClick={() => handleReset(data._id)}
            variant="outlined"
            size="small"
          >
            Clear
          </Button>
          <IconButton sx={{ml: 1}} disabled={isReset} onClick={handleReload}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Box>
      )}

      {isReset && <LinearProgress sx={{mb: 1}} />}
      {data.matches ? (
        data.matches.map((match) => {
          return (
            <GetReport
              key={match._label}
              photoId={match._label}
              distance={match._distance}
            />
          );
        })
      ) : (
        <Typography>No matches found</Typography>
      )}
    </Box>
  );

  // return <ReportCardHorizontal distance={"Distance: 10%"} />;
}

function RenderMatches({ queryPhotoId }) {
  const router = useRouter();
  const { data, error, isLoading } = useSWRImmutable(
    `/api/photos/${queryPhotoId}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    return (
      <Box>
        <StackRow styles={{ mb: 1 }}>
          <IconButton onClick={() => router.push("/authority/photos")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">Matches</Typography>
        </StackRow>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography sx={{ mb: 1.5 }} variant="h6">
                Photo
              </Typography>
              <QueryPhoto publicId={data.image} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography sx={{ mb: 1.5 }} variant="h6">
                Possible matches
              </Typography>
              <FindMatches queryPhotoId={data.image} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default function Page() {
  const router = useRouter();
  const { photoId } = router.query;
  return (
    <Authenticate>
      <RenderMatches queryPhotoId={photoId} />
    </Authenticate>
  );
}

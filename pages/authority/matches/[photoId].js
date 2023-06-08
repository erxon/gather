import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import Image from "next/image";
import ReportCardHorizontal from "@/components/reports/ReportCardHorizontal";
import Authenticate from "@/utils/authority/Authenticate";
import { useRouter } from "next/router";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { fetcher } from "@/lib/hooks";
import QueryPhoto from "@/components/photo/QueryPhoto";
import { useState, useEffect } from "react";
import Head from "@/components/Head";
import RefreshIcon from "@mui/icons-material/Refresh";

function Photo({ queryPhotoId }) {
  return <QueryPhoto publicId={queryPhotoId} />;
}

function Report({ photoId, distance }) {
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading) return <CircularProgress />;
  if (data) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Distance: {`${Math.round(distance * 100)}%`}</Typography>
        <Typography>Report: {data.reportId}</Typography>
        <Typography>{data.missingPerson}</Typography>
      </Paper>
    );
  }
}

function FindMatches({ queryPhotoId }) {
  const { data, error, isLoading } = useSWRImmutable(
    `http://localhost:8000/matches/${queryPhotoId}`,
    fetcher
  );
  if (error) return <Typography>Something went wrong</Typography>;
  if (isLoading)
    return (
      <Box>
        <CircularProgress /> <Typography>Looking for matches...</Typography>
      </Box>
    );
  if (data) {
    return (
      <Box>
        {data ? (
          data.matches.map((match) => {
            return <Report photoId={match._label} distance={match._distance} />;
          })
        ) : (
          <Typography>No matches found</Typography>
        )}
      </Box>
    );
  }
  // return <ReportCardHorizontal distance={"Distance: 10%"} />;
}

function RenderMatches({ queryPhotoId }) {
  const { data, error, isLoading } = useSWR(
    `/api/photos/${queryPhotoId}`,
    fetcher
  );
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) {
    return (
      <Box>
        <Head
          title="Matches"
          component={
            <Button startIcon={<RefreshIcon />}>
              Reload
            </Button>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography sx={{ mb: 1.5 }} variant="h6">Photo</Typography>
              <Photo queryPhotoId={data.image} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }} variant="outlined">
              <Typography sx={{ mb: 1.5 }} variant="h6">Possible matches</Typography>
              <FindMatches queryPhotoId={data.image} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default function Matches() {
  const router = useRouter();
  const { photoId } = router.query;
  return (
    <Authenticate>
      <RenderMatches queryPhotoId={photoId} />
    </Authenticate>
  );
}

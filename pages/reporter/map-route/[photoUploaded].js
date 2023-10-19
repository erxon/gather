import { useState, useEffect } from "react";
import Map from "@/components/map/Map";
import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import QueryPhoto from "@/components/photo/QueryPhoto";
import QueryPhotoLarge from "@/components/photo/QueryPhotoLarge";
import useSWR from "swr";
import { fetcher } from "@/lib/hooks";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import StackRowLayout from "@/utils/StackRowLayout";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";

function DisplayPhoto({ photoUploaded }) {
  const { data, isLoading, error } = useSWR(
    `/api/photos/${photoUploaded}`,
    fetcher
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;

  return <QueryPhotoLarge publicId={data.image} />;
}

function DisplayMap({ data, position, reporterLocation }) {
  const router = useRouter();
  const date = new Date(data.createdAt);
  const elapsedTime = computeElapsedTime(date);

  const routeHandler = () => {
    router.push("/reports/create-report");
  };

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <StackRowLayout spacing={1}>
          <RouteOutlinedIcon />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Route
          </Typography>
        </StackRowLayout>
      </Box>

      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DisplayPhoto photoUploaded={data.photoUploaded} />
            <Box sx={{ mt: 1 }}>
              <StackRowLayout spacing={0.5}>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Reported by: </span>
                  {data.firstName} {data.lastName}
                </Typography>
                <Typography color="GrayText">{elapsedTime}</Typography>
              </StackRowLayout>
              <Button
                fullWidth
                onClick={routeHandler}
                startIcon={<EditIcon />}
                sx={{ mt: 1 }}
              >
                Update
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Map
              reporters={[{ ...data }]}
              userLocation={{
                lat: position.latitude,
                lng: position.longitude,
              }}
              destination={reporterLocation}
              height="500px"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Page({ data }) {
  const [position, setCurrentPosition] = useState();
  const reporterLocation = [data.position.longitude, data.position.latitude];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position.coords);
      },
      () => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  if (!position) return <CircularProgress />;

  return (
    <DisplayMap
      position={position}
      data={data}
      reporterLocation={reporterLocation}
    />
  );
}

export async function getServerSideProps(context) {
  const { photoUploaded } = context.params;
  const url = process.env.API_URL || "http://localhost:3000";
  const request = await fetch(
    `${url}/api/reporters/uploaded-photo/${photoUploaded}`
  );
  const data = await request.json();

  return {
    props: { data },
  };
}

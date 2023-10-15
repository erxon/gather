import React, { useRef, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Divider,
  Pagination,
} from "@mui/material";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import useSWRImmutable from "swr/immutable";
import { fetcher, useUser } from "@/lib/hooks";
import { useRouter } from "next/router";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StackRowLayout from "@/utils/StackRowLayout";
import Photo from "@/components/reporter/Photo";
import Authenticate from "@/utils/authority/Authenticate";
import Head from "@/components/Head";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import Map from "@/components/map/Map";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Page({ data }) {
  const [userLocation, setUserLocation] = useState({
    lng: null,
    lat: null,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <Authenticate>
      <DisplayMap userLocation={userLocation} data={data} />
    </Authenticate>
  );
}

function DisplayMap({ data, userLocation }) {
  const [destination, setDestination] = useState(null);
  const [page, setPage] = useState(1);
  const reporters = [...data.data];

  const pageLength = reporters.length - 2;

  const handlePage = (event, value) => {
    setPage(value);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <Head icon={<PersonPinCircleOutlinedIcon />} title="Reports" />
        <Paper sx={{p: 3}}>
          <Pagination page={page} onChange={handlePage} size="small" count={pageLength} />
          {reporters
            .slice(page - 1, page + 2)
            .reverse()
            .map((reporter) => {
              return (
                <Reporter
                  userLocation={userLocation}
                  key={reporter._id}
                  reporter={reporter}
                  setDestination={setDestination}
                />
              );
            })}
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Map
          userLocation={userLocation}
          reporters={data.data}
          destination={destination}
          height={"100vh"}
        />
      </Grid>
    </Grid>
  );
}

function Reporter({ reporter, setDestination, userLocation }) {
  // const { data, error, isLoading } = useSWRImmutable(
  //   `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${reporter.position.longitude},${reporter.position.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
  //   fetcher
  // );

  // if (error) return <Typography>Something went wrong.</Typography>;
  // if (isLoading) return <CircularProgress />;

  const handleViewRoute = async () => {
    setDestination([reporter.position.longitude, reporter.position.latitude]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2}>
        <Photo photoUploaded={reporter.photoUploaded} />
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {reporter.firstName} {reporter.lastName}
            <span>
              <Typography color="GrayText" variant="subtitle2" sx={{ m: 0 }}>
                Reporter
              </Typography>
            </span>
          </Typography>
          <StackRowLayout spacing={1}>
            <DirectionsCarIcon color="primary" />
            <Typography variant="body2">Driving |</Typography>
            <Typography variant="body2">
              {/* {data && Math.round(data.routes[0].duration / 60)} mins */}
            </Typography>
          </StackRowLayout>
          <Button sx={{ mt: 1 }} onClick={handleViewRoute} size="small">
            View route
          </Button>
        </Box>
      </Stack>
      <Divider />
    </Box>
  );
}

export async function getServerSideProps() {
  const url = process.env.API_URL || "http://localhost:3000";
  const getReporters = await fetch(`${url}/api/reporters`);

  const data = await getReporters.json();

  return {
    props: { data },
  };
}

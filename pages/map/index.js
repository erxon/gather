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
  IconButton,
  Collapse,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ContentLayout from "@/utils/layout/ContentLayout";

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

function Reporters({ reporters, currentLocation, setDestination }) {
  const [page, setPage] = useState(1);

  const handlePage = (event, value) => {
    setPage(value);
  };

  const pageLength = reporters.length - 2;

  return (
    <div>
      {reporters.length > 0 ? (
        <Box>
          {reporters.length > 3 && (
            <Pagination
              page={page}
              onChange={handlePage}
              size="small"
              count={pageLength}
            />
          )}
          {reporters
            .slice(page - 1, page + 2)
            .reverse()
            .map((reporter) => {
              return (
                <div key={reporter._id}>
                  <Reporter
                    userLocation={currentLocation}
                    key={reporter._id}
                    reporter={reporter}
                    setDestination={setDestination}
                  />
                  <Divider />
                </div>
              );
            })}
        </Box>
      ) : (
        <Box>
          <Typography color="GrayText">
            There we&apos;re no reports yet
          </Typography>
        </Box>
      )}
    </div>
  );
}

function ReportersMobile({ reporters, currentLocation, setDestination }) {
  const [show, setShow] = useState(false);

  const handleDropdown = () => {
    setShow(!show);
  };

  return (
    <Paper
      sx={{
        display: { xs: "block", md: "none" },
        p: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6">Reporters</Typography>
        <IconButton onClick={handleDropdown}>
          {show ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
      </Stack>
      <Collapse in={show}>
        <Reporters
          reporters={reporters}
          currentLocation={currentLocation}
          setDestination={setDestination}
        />
      </Collapse>
    </Paper>
  );
}

function DisplayMap({ data, userLocation }) {
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(userLocation);

  const reporters = [...data.data];

  return (
    <ContentLayout>
      <Grid container spacing={1}>
        <Grid item xs={12} md={5} sm={12}>
          <Stack direction="column" alignItems="center" spacing={1}>
            <Paper
              sx={{
                display: { xs: "none", md: "block" },
                p: 2,
              }}
            >
              <Typography variant="h6">Reporters</Typography>
              <Reporters
                reporters={reporters}
                currentLocation={currentLocation}
                setDestination={setDestination}
              />
            </Paper>
            <ReportersMobile
              reporters={reporters}
              currentLocation={currentLocation}
              setDestination={setDestination}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={7} sm={12}>
          <Paper sx={{ p: 3 }}>
            <Map
              userLocation={currentLocation}
              setCurrentLocation={setCurrentLocation}
              reporters={data.data}
              destination={destination}
              height="500px"
            />
          </Paper>
        </Grid>
      </Grid>
    </ContentLayout>
  );
}

function Reporter({ reporter, setDestination, userLocation }) {
  const { data, error, isLoading } = useSWRImmutable(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${reporter.position.longitude},${reporter.position.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    fetcher
  );

  if (error) return <Typography>Something went wrong.</Typography>;
  if (isLoading)
    return (
      <ContentLayout>
        <CircularProgress />
      </ContentLayout>
    );

  const handleViewRoute = async () => {
    setDestination([reporter.position.longitude, reporter.position.latitude]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2}>
        <Photo photoUploaded={reporter.photoUploaded} />
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {reporter.firstName} {reporter.lastName}
            <span>
              <Typography color="GrayText" variant="body2" sx={{ m: 0 }}>
                Reporter
              </Typography>
            </span>
          </Typography>
          <StackRowLayout spacing={1}>
            <DirectionsCarIcon color="primary" />
            <Typography variant="body2">Driving |</Typography>
            <Typography variant="body2">
              {data && data.routes && Math.round(data.routes[0].duration / 60)}{" "}
              mins
            </Typography>
          </StackRowLayout>
          <Button sx={{ mt: 1 }} onClick={handleViewRoute} size="small">
            View route
          </Button>
        </Box>
      </Stack>
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

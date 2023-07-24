import React, { useRef, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  CircularProgress,
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

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export default function Page({ data }) {
  return (
    <Authenticate>
      <DisplayMap data={data} />
    </Authenticate>
  );
}

function DisplayMap({ data }) {
  const [destination, setDestination] = useState(null);
  const reporters = [...data.data]

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <Head icon={<PersonPinCircleOutlinedIcon />} title="Reports" />
        {reporters.reverse().map((reporter) => {
          return (
            <Reporter
              key={reporter._id}
              reporter={reporter}
              setDestination={setDestination}
            />
          );
        })}
      </Grid>

      <Grid item xs={12} md={8}>
        {/* <Map data={data} destination={destination} /> */}
      </Grid>
    </Grid>
  );
}

function Reporter({ reporter, setDestination }) {
  // const { data, error, isLoading } = useSWRImmutable(
  //   `https://api.mapbox.com/directions/v5/mapbox/driving/120.911,14.292;${reporter.position.longitude},${reporter.position.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
  //   fetcher
  // );

  // if (error) return <Typography>Something went wrong.</Typography>;
  // if (isLoading) return <CircularProgress />;

  // const handleViewRoute = async () => {
  //   setDestination([reporter.position.longitude, reporter.position.latitude]);
  // };
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
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
              {/* {Math.round(data.routes[0].duration / 60)} mins */}
              30 mins
            </Typography>
          </StackRowLayout>
          {/* <Button sx={{ mt: 1 }} onClick={handleViewRoute} size="small">
            View route
          </Button> */}
        </Box>
      </Stack>
    </Paper>
  );
}

function Map({ data, destination }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const instructions = useRef(null);
  const [lng, setLng] = useState(120.911);
  const [lat, setLat] = useState(14.2921);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    console.log("map loaded");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/120.9110,14.2921;${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
      // add turn instructions here at the end
    }
    if (destination) {
      getRoute(destination);
    }

    new mapboxgl.Marker({
      color: "#00adb5",
    })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
        <h3>You are here</h3>
        `)
      ) // add popup
      .addTo(map.current);
    data.data.map((reporter) => {
      const date = new Date(reporter.createdAt);
      const timeElapsed = computeElapsedTime(date);
      new mapboxgl.Marker()
        .setLngLat([reporter.position.longitude, reporter.position.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
        <h3>There is a missing person reported here.</h3>
        <p>Reported by: ${reporter.firstName} ${reporter.lastName} ${timeElapsed}</p>
        `)
        ) // add popup
        .addTo(map.current);
    });
  }, [destination, data.data, lat, lng, zoom]);

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on("move", () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });
  return (
    <div>
      <Box ref={instructions}></Box>
      <Box ref={mapContainer} sx={{ m: 0, height: "100vh" }}></Box>
    </div>
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

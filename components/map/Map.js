import { Box, Typography } from "@mui/material";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRef, useState, useEffect } from "react";
import computeElapsedTime from "@/utils/helpers/computeElapsedTime";
import SearchBox from "@/components/map/SearchBox";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({
  userLocation,
  setCurrentLocation,
  reporters,
  destination,
  height,
  width,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const instructions = useRef(null);
  const [lng, setLng] = useState(userLocation.lng);
  const [lat, setLat] = useState(userLocation.lat);
  const [zoom, setZoom] = useState(12);
  let marker;

  useEffect(() => {
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
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
            "line-color": "#32a852",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
      // add turn instructions here at the end
    }

    if (destination) {
      map.current.on("load", () => {
        getRoute(destination);
      });
    }

    marker = new mapboxgl.Marker({
      color: "#00adb5",
    })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(`
          <h3>You are here</h3>
          `)
      ) // add popup
      .addTo(map.current);
    reporters.map((reporter) => {
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
  }, [
    destination,
    reporters,
    userLocation.lat,
    userLocation.lng,
    lat,
    lng,
    zoom,
  ]);

  const handleSearch = (lng, lat) => {
    map.current.flyTo({ center: [lng, lat] });
    setLng(lng);
    setLat(lat);
    setCurrentLocation({ lng: lng, lat: lat });
    marker.setLngLat([lng, lat]).addTo(map.current);
  };

  return (
    <div>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          zIndex: 1,
          right: 3,
          top: 100,
        }}
      >
        <SearchBox onRetrieve={handleSearch} />
      </Box>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          zIndex: 1,
          ml: 3,
          top: 175,
        }}
      >
        <SearchBox onRetrieve={handleSearch} />
      </Box>
      <Box ref={mapContainer} sx={{ width: "100vw", height: height }}></Box>
    </div>
  );
}

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { Box } from "@mui/material";
import SearchBox from "./SearchBox";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapWithSearchBox(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = new mapboxgl.Marker({ draggable: true });
  const [lng, setLng] = useState(props.lng);
  const [lat, setLat] = useState(props.lat);
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    marker.setLngLat([lng, lat]).addTo(map.current);
  });

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on("move", () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // }, []);

  useEffect(() => {
    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      setLng(lngLat.lng);
      setLat(lngLat.lat);
      props.setNewPosition(lngLat);
    });
  });

  const handleSearch = (lng, lat) => {
    marker.remove();
    map.current.flyTo({ center: [lng, lat] });
    setLng(lng);
    setLat(lat);
    marker.setLngLat([lng, lat]).addTo(map.current);
  };

  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <SearchBox onRetrieve={handleSearch} />
      </Box>
      <Box ref={mapContainer} sx={{ borderRadius: "10px", height: 300 }}></Box>
    </div>
  );
}

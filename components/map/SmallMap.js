import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import style from "@/public/style/map.module.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJpY3NvbjIwMjMiLCJhIjoiY2xpMW1sOXpuMHh6MTNqbXZ3Z2g3aTN2YyJ9.TN5fPsJaGbfWEUbbvbSp5A";

export default function SmallMap(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(props.lng);
  const [lat, setLat] = useState(props.lat);
  const [zoom, setZoom] = useState(18);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div>
      <div ref={mapContainer} className={style.mapContainer} />
    </div>
  );
}

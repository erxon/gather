import { Box, Button } from "@mui/material";
import Layout from "./Layout";
import { useState, useEffect } from "react";
import SmallMap from "@/components/map/SmallMap";
import MapWithSearchBox from "@/components/map/MapWithSearchBox";

export default function UpdateLocation() {
  const [currentPosition, setCurrentPostition] = useState(null);
  const [newPosition, setNewPosition] = useState();

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPostition(position.coords);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const updateLocation = () => {
    console.log(newPosition)
  };

  return (
    <Layout head="Update Location">
      {currentPosition && (
        <MapWithSearchBox
          lng={currentPosition.longitude}
          lat={currentPosition.latitude}
          setNewPosition={setNewPosition}
        />
      )}
      <Button sx={{ mt: 2 }} onClick={updateLocation}>
        Update
      </Button>
    </Layout>
  );
}

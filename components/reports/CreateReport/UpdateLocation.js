import { Alert, Box, Button, Collapse, Typography } from "@mui/material";
import Layout from "./Layout";
import { useState, useEffect } from "react";
import SmallMap from "@/components/map/SmallMap";
import MapWithSearchBox from "@/components/map/MapWithSearchBox";
import DisplaySnackbar from "@/components/DisplaySnackbar";

export default function UpdateLocation({ setUpdatedPosition, isSubmitted, updatedPosition }) {
  const [currentPosition, setCurrentPostition] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar({ open: false });
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPostition({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const updateLocation = () => {
    setUpdatedPosition(currentPosition);
    setOpenSnackbar({
      open: true,
      message: "Position updated",
    });
  };

  return (
    <div>
      <DisplaySnackbar
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={handleSnackbarClose}
      />
      <Layout head="Update Location">
        {currentPosition && (
          <MapWithSearchBox
            lng={currentPosition.longitude}
            lat={currentPosition.latitude}
            setNewPosition={setCurrentPostition}
          />
        )}
        <Collapse sx={{mt: 2}} in={isSubmitted && !updatedPosition}>
          <Alert severity="error">Position was not yet updated</Alert>
        </Collapse>
        <Button sx={{ mt: 2 }} onClick={updateLocation}>
          Update
        </Button>
      </Layout>
    </div>
  );
}

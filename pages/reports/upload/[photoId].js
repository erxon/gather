import { useRouter } from "next/router";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";
import { fetcher } from "@/lib/hooks";
import SmallMap from "@/components/map/SmallMap";

export default function Upload() {
  const router = useRouter();
  const { photoId } = router.query;
  const { data, error, isLoading } = useSWR(`/api/photos/${photoId}`, fetcher);
  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Something went wrong</Typography>;
  if (data) return <Form publicId={data.image} photoId={photoId} />;
}

function Form({ publicId, photoId }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [submitted, isSubmitted] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setCurrentPosition(position.coords);
      },
      () => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const myImage = new CloudinaryImage(`query-photos/${publicId}`, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(250).height(250));

  //uploaded photo
  //reporter information
  //report information
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      photoUploaded: photoId,
      location: e.target.location.value,
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      contactNumber: e.target.contactNumber.value,
      longitude: currentPosition.longitude,
      latitude: currentPosition.latitude,
      email: e.target.email.value,
    };
    console.log(JSON.stringify(body));
    await fetch("/api/reports/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    isSubmitted(true);
  };

  return (
    <>
      {submitted ? (
        <div>
          <Typography variant="body1">
            Thank you for informing us about this missing person. Authorities
            will contact you at any given moment to verify this report.
          </Typography>
        </div>
      ) : (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <AdvancedImage cldImg={myImage} width="100%" height="auto" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>
                <Button
                  size="small"
                  disableElevation
                  variant="contained"
                  type="submit"
                  sx={{ mb: 2 }}
                >
                  Submit
                </Button>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography sx={{ mb: 3 }} variant="h6">
                    Please provide some of your information
                  </Typography>
                  <Stack
                    sx={{ mb: 2 }}
                    spacing={1}
                    direction={{ xs: "column", md: "row" }}
                    alignItems="center"
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="First name"
                      type="text"
                      name="firstName"
                      required
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Last name"
                      type="text"
                      name="lastName"
                      required
                    />
                  </Stack>
                  <Stack
                    sx={{ mb: 2 }}
                    spacing={1}
                    direction={{ xs: "column", md: "row" }}
                    alignItems="center"
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Contact number"
                      type="text"
                      name="contactNumber"
                      required
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email"
                      type="text"
                      name="email"
                      required
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Location"
                    type="text"
                    name="location"
                    required
                  />
                </Paper>
              </form>
              {currentPosition && (
                <SmallMap
                  lng={currentPosition.longitude}
                  lat={currentPosition.latitude}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

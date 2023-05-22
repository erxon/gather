import { useRouter } from "next/router";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import PlaceIcon from "@mui/icons-material/Place";

export default function Upload() {
  const router = useRouter();
  const { imgsurl } = router.query;
  const [submitted, isSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [gender, setGender] = useState("");

  const publicId = `my-uploads/${imgsurl}`;
  const myImage = new CloudinaryImage(publicId, {
    cloudName: "dg0cwy8vx",
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
  }).resize(fill().width(250).height(250));

  //uploaded photo
  //reporter information
  //report information
  const handleGenderSelect = (event) => {
    setGender(event.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      photo: publicId,
      rFirstName: e.target.rFirstName.value,
      rLastName: e.target.rLastName.value,
      rRelationToMissing: e.target.rRelationToMissing.value,
      rContactNumber: e.target.rContactNumber.value,
      rEmail: e.target.rEmail.value,
      mpFirstName: e.target.mpFirstName.value,
      mpLastName: e.target.mpLastName.value,
      mpAge: e.target.mpAge.value,
      mpGender: gender,
      mpLastSeen: e.target.mpLastSeen.value,
    };
    const res = await fetch("/api/reports/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setReportId(data.data._id);
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
          <Typography sx={{ mt: 3 }} variant="body2">
            If you want to manage this report with the authorities, signup for
            an account.
          </Typography>
          <Button
            sx={{ my: 2 }}
            disableElevation
            size="small"
            variant="contained"
            href={`/reports/create-account/${reportId}`}
          >
            Manage Report
          </Button>
        </div>
      ) : (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <AdvancedImage cldImg={myImage} width="100%" height="auto" />
                <Typography variant="body2">Not found in database</Typography>
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
                      name="rFirstName"
                      required
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Last name"
                      type="text"
                      name="rLastName"
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
                      name="rContactNumber"
                      required
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email"
                      type="text"
                      name="rEmail"
                      required
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Relation to missing"
                    type="text"
                    name="rRelationToMissing"
                    required
                  />
                </Paper>
                <Paper sx={{ p: 3 }}>
                  <Typography sx={{ mb: 3 }} variant="h6">
                    Report
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
                      name="mpFirstName"
                      required
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="last name"
                      type="text"
                      name="mpLastName"
                      required
                    />
                  </Stack>
                  <Stack
                    spacing={1}
                    direction={{ xs: "column", md: "row" }}
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Age"
                      type="text"
                      name="mpAge"
                      required
                    />
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        value={gender}
                        onChange={handleGenderSelect}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="outlined"
                    label="last seen"
                    type="text"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <PlaceIcon />
                        </InputAdornment>
                      ),
                    }}
                    name="mpLastSeen"
                    required
                  />
                </Paper>
              </form>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

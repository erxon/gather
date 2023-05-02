import { useRouter } from "next/router";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { useState } from "react";
import { Button, TextField, Typography, Box, Grid } from "@mui/material";

export default function Upload() {
  const router = useRouter();
  const { imgsurl } = router.query;
  const [submitted, isSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);

  const publicId = `my-uploads/${imgsurl}`;
  const myImage = new CloudinaryImage(publicId, {
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
      photo: publicId,
      rFirstName: e.target.rFirstName.value,
      rLastName: e.target.rLastName.value,
      rRelationToMissing: e.target.rRelationToMissing.value,
      rContactNumber: e.target.rContactNumber.value,
      rEmail: e.target.rEmail.value,
      mpFirstName: e.target.mpFirstName.value,
      mpLastName: e.target.mpLastName.value,
      mpAge: e.target.mpAge.value,
      mpGender: e.target.mpGender.value,
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

  const boxStyles = {
    backgroundColor: "#F2F4F4",
    padding: "28px 30px 28px 30px",
    borderRadius: "20px",
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
        <Box sx={boxStyles}>
          <div>
            <div>
              <AdvancedImage cldImg={myImage} />
              <Typography variant="body2">Not found in database</Typography>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <Grid container sx={{ my: 3 }} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: "400px" }}>
                    <Typography variant="body1">
                      Please provide some of your information
                    </Typography>
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="First name"
                      type="text"
                      name="rFirstName"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="Last name"
                      type="text"
                      name="rLastName"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="Relation to missing"
                      type="text"
                      name="rRelationToMissing"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="Contact number"
                      type="text"
                      name="rContactNumber"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="Email"
                      type="text"
                      name="rEmail"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ maxWidth: "400px" }}>
                    <Typography variant="body1">Report</Typography>
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="First name"
                      type="text"
                      name="mpFirstName"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="last name"
                      type="text"
                      name="mpLastName"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="age"
                      type="text"
                      name="mpAge"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="gender"
                      type="text"
                      name="mpGender"
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      size="small"
                      label="last seen"
                      type="text"
                      name="mpLastSeen"
                    />
                  </Box>
                </Grid>
              </Grid>
              <Button size="small" disableElevation variant="contained" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </Box>
      )}
    </>
  );
}

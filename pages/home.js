import Router from "next/router";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import { useUser } from "@/lib/hooks";
import { useRouter } from "next/router";
import { sendNotification } from "@/utils/notificationClient";



export default function HomePage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  
  //Handle submission of Report and Manage form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      lastSeen: e.currentTarget.lastSeen.value,
      age: e.currentTarget.age.value,
      gender: e.currentTarget.gender.value,
      status: "pending",
    };

    //Call a function to notify authorities about the new report
    

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data) {
      Router.push(`/reports/create-account/${data.data._id}`);
    }
  };

  //Handle change in image element to display the preview
  //of the image before uploading
  const handleChange = (changeEvent) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };

  //Handle uploading of an image
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    console.log(data);
    const publicId = data.public_id.substring(11, 31);
    if (data) {
      Router.push(`/reports/upload/${publicId}`);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f2f4f4",
          marginTop: "100px",
          padding: "30px",
          borderRadius: "20px",
          height: "50%",
        }}
      >
        <Box>
          <form
            method="post"
            onChange={handleChange}
            onSubmit={handleImageSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack
                  spacing={1}
                  alignItems="center"
                  direction="row"
                  sx={{ marginBottom: "16px" }}
                >
                  <InsertPhotoIcon />
                  <Typography variant="h6">Report with Photo</Typography>
                </Stack>
                <Typography variant="body1">
                  Report a missing person with an image. The image will be
                  searched in the collections of images from past reports.
                </Typography>
                <p>
                  <input type="file" name="file" />
                </p>
              </Grid>
              <Grid item xs={12} md={6}>
                <img
                  style={{ width: "auto", height: "250px" }}
                  src={imageSrc}
                />
                {imageSrc && !uploadData && (
                  <p>
                    <Button type="submit" variant="contained" size="small">
                      upload files
                    </Button>
                  </p>
                )}
                {uploadData && (
                  <code>
                    <pre>{JSON.stringify(uploadData, null, 2)}</pre>
                  </code>
                )}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: "5%" }}>
        <Grid item xs={12} md={6}>
          {/*Recent Report*/}
          <Box
            sx={{
              backgroundColor: "#f2f4f4",
              padding: "5%",
              borderRadius: "20px",
            }}
          >
            <Stack
              spacing={1}
              alignItems="center"
              direction="row"
              sx={{ marginBottom: "16px" }}
            >
              <DataSaverOffIcon />
              <Typography variant="h6">Data</Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          {/*Report a Case*/}
          <Box
            sx={{
              backgroundColor: "#f2f4f4",
              padding: "5%",
              borderRadius: "20px",
            }}
          >
            <Stack
              spacing={1}
              alignItems="center"
              direction="row"
              sx={{ marginBottom: "16px" }}
            >
              <ArticleIcon />
              <Typography variant="h6">Report and manage</Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ marginTop: "5px" }}
                id="firstName"
                label="First Name"
                variant="outlined"
                name="firstName"
                type="text"
                size="small"
                fullWidth
                required
              />
              <TextField
                sx={{ marginTop: "5px" }}
                id="lastName"
                label="Last Name"
                variant="outlined"
                name="lastName"
                type="text"
                size="small"
                fullWidth
                required
              />
              <TextField
                sx={{ marginTop: "5px" }}
                id="lastSeen"
                label="Last Seen"
                variant="outlined"
                name="lastSeen"
                type="text"
                size="small"
                fullWidth
                required
              />

              <TextField
                sx={{ marginTop: "5px" }}
                id="age"
                label="Age"
                name="age"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                required
              />

              <TextField
                sx={{ marginTop: "5px" }}
                id="gender"
                label="Gender"
                name="gender"
                variant="outlined"
                type="text"
                size="small"
                fullWidth
                required
              />
              <Button
                sx={{ marginTop: "5px" }}
                type="submit"
                variant="contained"
              >
                Report
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

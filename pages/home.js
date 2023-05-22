import Router from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Data from "@/components/Data";


import { createReport, uploadReportPhoto } from "@/lib/api-lib/api-reports";

export default function HomePage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [gender, setGender] = useState('');

  //Handle submission of Report and Manage form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      lastSeen: e.currentTarget.lastSeen.value,
      age: e.currentTarget.age.value,
      gender: gender,
      status: "pending",
    };
    //Create new report
    const data = await createReport(body);

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

    //Upload photo
    const data = await uploadReportPhoto(formData);

    console.log(data);
    const publicId = data.public_id.substring(11, 31);
    if (data) {
      Router.push(`/reports/upload/${publicId}`);
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                mb: 3,
              }}
              elevation={2}
            >


              {/*Report with Photo*/}
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
                      
                      <Typography variant="h5">Report with Photo</Typography>
                    </Stack>
                    <Typography variant="body1">
                      Report a missing person with only an image at hand.
                    </Typography>
                    <Button
                      startIcon={<AttachFileIcon />}
                      sx={{ mt: 2 }}
                      variant="contained"
                      component="label"
                      size="small"
                    >
                      Select file
                      <input hidden type="file" name="file" />
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <img
                      style={{ maxWidth: "100%", height: "auto" }}
                      src={imageSrc}
                    />
                    {imageSrc && !uploadData && (
                      <p>
                        <Button
                          startIcon={<FileUploadIcon />}
                          type="submit"
                          variant="contained"
                          size="small"
                        >
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
            </Paper>

            {/*Report and manage***********/}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5">Report and manage</Typography>
              <Typography sx={{ my: 2 }} variant="body1">
                Manage, and keep updated on the report you have filed.
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack
                  sx={{ mb: 3 }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <TextField
                    id="age"
                    label="Age"
                    name="age"
                    variant="outlined"
                    type="text"
                    size="small"
                    required
                  />
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      onChange={(event) => {
                        setGender(event.target.value);
                      }}
                      value={gender}
                      label="Gender"
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Stack
                  sx={{ mb: 2 }}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {/*First name*/}
                  <TextField
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    type="text"
                    size="small"
                    fullWidth
                    required
                  />
                  {/*Last name*/}
                  <TextField
                    id="lastName"
                    label="Last Name"
                    variant="outlined"
                    name="lastName"
                    type="text"
                    size="small"
                    fullWidth
                    required
                  />
                </Stack>
                {/*Last seen*/}
                <TextField
                  id="lastSeen"
                  label="Last Seen"
                  variant="outlined"
                  name="lastSeen"
                  type="text"
                  size="small"
                  fullWidth
                  required
                />
                <Button
                  startIcon={<ArticleIcon />}
                  size="small"
                  sx={{ my: 2 }}
                  type="submit"
                  variant="contained"
                >
                  Report
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>

            {/*Data*/}
            <Box>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack
                  spacing={1}
                  alignItems="center"
                  direction="row"
                  sx={{ marginBottom: "16px" }}
                >
                  <Typography variant="h6">Data</Typography>
                </Stack>
                <Data />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

import { Stack, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { uploadReportPhoto } from "@/lib/api-lib/api-reports";
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function UploadReferencePhotos({ mpName, reportId, getPhotoId }) {
    const uploadToDatabase = async (photoData) => {
      const uploadedPhoto = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoData),
      });
      return uploadedPhoto;
    };
  
    const generateAlertContent = (status, message) => {
      if (status === 400) {
        return {
          open: true,
          severity: "error",
          message: message,
        };
      } else if (status === 200) {
        return {
          open: true,
          severity: "success",
          message: message,
        };
      }
    };
  
    const [photos, setPhotos] = useState([]);
    const [isDisabled, disableButton] = useState({
      photo1: false,
      photo2: false,
      photo3: false,
    });
  
    //Snackbar, for feedback
    const [snackbar, setSnackbar] = useState({
      open: false,
      severity: "",
      message: "",
    });
  
    const [uploaded, isUploaded] = useState(false);
  
    const handleSnackbarClose = () => {
      setSnackbar({ open: false, severity: "", message: "" });
    };
  
    //Display Photo
    const handleChange = (event) => {
      console.log(event.target.files[0]);
  
      //Include validation
      //if the size of the photo exceeds 100000, return a message
      if (event.target.files[0].size > 10000000) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "The file exceeds 100mb",
        });
        return;
      } else {
        const reader = new FileReader();
  
        reader.onload = function (onLoadEvent) {
          setPhotos([
            ...photos,
            {
              [event.target.name]: onLoadEvent.target.result,
              fileName: event.target.files[0].name,
            },
          ]);
        };
        disableButton({ ...isDisabled, [event.target.name]: true });
  
        reader.readAsDataURL(event.target.files[0]);
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      let snackbarContent = {};
      let uploadedPhotos = [];
  
      //Upload photo to Cloudinary
      const form = event.currentTarget;
  
      for(let i = 0; i < 3; i++){
        for (const file of form.elements[i].files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "report-photos");
          const data = await uploadReportPhoto(formData);
          uploadedPhotos.push({publicId: data.public_id.substring(14, 34), fileName: file.name})
        }
      }
  
      //Save photo to Photo database
      const photosData = {
        images: [...uploadedPhotos],
        type: 'reference',
        reportId: reportId,
        missingPerson: mpName,
      };
     
  
      // //Store response message
      const upload = await uploadToDatabase(photosData);
      const newPhotos = await upload.json();
  
      snackbarContent = generateAlertContent(upload.status, newPhotos.message);
  
      setSnackbar(snackbarContent);
      isUploaded(true);
      // Link the photo to report
      getPhotoId(newPhotos.data._id);
      setSnackbar(snackbarContent)
    };
  
    return (
      <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
        {/*Snackbar*/}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
  
        <Typography variant="h6" fontWeight={500}>
          Missing person photos
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }} fontWeight={500}>
          This photos will be used as references for face recognition system.
        </Typography>
        {/*Display photo preview before upload*/}
        {/* {photo.src !== "" && (
          <Box>
            <Box
              sx={{
                borderRadius: "10px",
                border: "0.5px solid grey",
                width: 150,
                height: 150,
              }}
            >
              <Image
                style={{ objectFit: "contain" }}
                src={photo.src}
                width={150}
                height={150}
                alt={photo.fileName}
              />
            </Box>
            <Typography variant="subtitle1" color="secondary">
              {photo.fileName}
            </Typography>
          </Box>
        )} */}
  
        {/* If the photo is already uploaded, remove the form */}
        {!uploaded ? (
          <form onChange={handleChange} onSubmit={handleSubmit}>
            <Stack direction="column" alignItems="left" spacing={1}>
              <Button
                disabled={isDisabled.photo1}
                startIcon={<AttachFileIcon />}
                component="label"
                size="small"
                variant="contained"
              >
                Select Image 1
                <input
                  hidden
                  type="file"
                  name="photo1"
                  accept="image/png, image/jpeg"
                />
              </Button>
              <Button
                disabled={isDisabled.photo2}
                startIcon={<AttachFileIcon />}
                component="label"
                size="small"
                variant="contained"
              >
                Select Image 2
                <input
                  hidden
                  type="file"
                  name="photo2"
                  accept="image/png, image/jpeg"
                />
              </Button>
              <Button
                disabled={isDisabled.photo3}
                startIcon={<AttachFileIcon />}
                component="label"
                size="small"
                variant="contained"
              >
                Select Image 3
                <input
                  hidden
                  type="file"
                  name="photo3"
                  accept="image/png, image/jpeg"
                />
              </Button>
              {photos.length === 3 && (
                <Button type="submit" size="small" variant="contained">
                  Upload
                </Button>
              )}
            </Stack>
          </form>
        ) : (
          <Typography variant="body1" sx={{ mt: 2.5 }} color="secondary">
            Photo is already uploaded
          </Typography>
        )}
      </Paper>
    );
  }
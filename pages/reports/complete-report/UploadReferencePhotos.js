//Utilities
import isPhotoValid from "@/utils/photo/isPhotoValid";

//Hooks
import { useState } from "react";

//Material UI Components
import {
  Paper,
  Stack,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

//Material UI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FileUploadGuidelines from "@/components/FileUploadGuidelines";
import referencePhotoUploadProcess from "@/utils/file-upload/referencePhotoUploadProcess";

export default function UploadReferencePhotos({
  mpName,
  reportId,
  setSnackbar,
  setUploaded,
  uploaded,
}) {
  const [photos, setPhotos] = useState([]);
  const [isDisabled, disableButton] = useState({
    photo1: false,
    photo2: false,
    photo3: false,
  });
  const [isLoading, setLoading] = useState(false);

  //Display Photo
  const readFile = (event) => {
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
    reader.readAsDataURL(event.target.files[0]);
  };

  const checkFile = (event, validatedPhoto) => {
    if (validatedPhoto.valid) {
      readFile(event);
      disableButton({ ...isDisabled, [event.target.name]: true });
    } else {
      setSnackbar({ open: true, message: validatedPhoto.message });
    }
  };

  const handleChange = (event) => {
    const validatePhoto = isPhotoValid(event.target.files[0]);
    checkFile(event, validatePhoto);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const numberOfFiles = 3;
    const form = event.currentTarget;
    const updateReportResponseData = await referencePhotoUploadProcess(
      form,
      reportId,
      mpName,
      numberOfFiles
    );

    setUploaded((prev) => {
      return { ...prev, isReferencePhotosUploaded: true };
    });
    setSnackbar({ open: true, message: updateReportResponseData.message });
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={1}>
        {uploaded && <CheckCircleIcon color="primary" />}
        <Typography variant="body1" fontWeight={500}>
          Reference photos
        </Typography>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <FileUploadGuidelines
          content="It is recommended that you upload at least 3 photos of the missing
            person as a reference for Face Recognition. Each should have a unique
            appearance from the others. They may vary in angle, distance, or
            setting."
        />
        <FileUploadGuidelines content="This will help us give accurate results in Face Search." />
        <FileUploadGuidelines content="File size should be less than 5 MB" />
      </Box>
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
                accept="image/png image/jpeg"
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
                accept="image/png image/jpeg"
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
                accept="image/png image/jpeg"
              />
            </Button>
            {photos.length === 3 &&
              (!isLoading ? (
                <Button type="submit" size="small" variant="contained">
                  Upload
                </Button>
              ) : (
                <div>
                  <Stack
                    direction="row"
                    justifyItems="center"
                    alignItems="center"
                    spacing={1}
                  >
                    <CircularProgress />
                    <Typography color="GrayText">Uploading</Typography>
                  </Stack>
                </div>
              ))}
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

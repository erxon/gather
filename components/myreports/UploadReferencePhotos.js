import {
  Stack,
  Button,
  Typography,
  Box,
  Snackbar,
  CircularProgress,
  Paper,
  IconButton,
  DialogActions,
  Avatar,
} from "@mui/material";
import { useState } from "react";
import { uploadReportPhoto } from "@/lib/api-lib/api-reports";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { mutate } from "swr";
import Image from "next/image";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function UploadReferencePhotos({
  mpName,
  reportId,
  handleClose,
  setIsLoading,
}) {
  const uploadToDatabase = async (images) => {
    const uploadedPhoto = await fetch(`/api/photos/report/${reportId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: images }),
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
  const [currentPhoto, setCurrentPhoto] = useState({ src: "", file: null });

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
    if (!event.target.files[0]) return;

    //Include validation
    //if the size of the photo exceeds 100000, return a message
    if (event.target.files[0].size > 500000) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "The file exceeds 100mb",
      });
      return;
    } else {
      const reader = new FileReader();

      reader.onload = function (onLoadEvent) {
        setCurrentPhoto({
          src: onLoadEvent.target.result,
          file: event.target.files[0],
        });
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClose();
    setIsLoading(true);
    let snackbarContent = {};
    let uploadedPhotos = [];

    for (let i = 0; i < photos.length; i++) {
      const file = photos[i].file;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "report-photos");
      const data = await uploadReportPhoto(formData);
      uploadedPhotos.push({
        publicId: data.public_id.substring(14, 34),
        fileName: file.name,
      });
    }

    // //Store response message
    const upload = await uploadToDatabase(uploadedPhotos);
    const newPhotos = await upload.json();
    const response = await fetch(
      `/api/imagga-face-recognition/${newPhotos.data._id}`
    );
    const faceIDs = await response.json();
    //index face ids
    await fetch("/api/imagga-face-recognition/save", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person: { [faceIDs.result.reportId]: faceIDs.result.faceIDs },
      }),
    });

    snackbarContent = generateAlertContent(upload.status, newPhotos.message);

    setSnackbar(snackbarContent);
    isUploaded(true);

    // Link the photo to report
    setSnackbar(snackbarContent);
    setIsLoading(false);
  };

  const handleAdd = () => {
    setPhotos((prev) => {
      return [...prev, currentPhoto];
    });
    setCurrentPhoto({ src: "", file: null });
    console.log(photos);
  };

  const handleCancel = () => {
    setCurrentPhoto({ src: "", file: null });
  };

  return (
    <Box sx={{ p: 3, mb: 3 }}>
      {/*Snackbar*/}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        {snackbar.message}
      </Snackbar>
      {/* If the photo is already uploaded, remove the form */}
      {currentPhoto.file && (
        <Paper
          sx={{ p: 0.5, display: "flex", alignItems: "center" }}
          variant="outlined"
        >
          <Image
            src={currentPhoto.src}
            width={75}
            height={75}
            style={{ objectFit: "contain" }}
          />
          <Typography sx={{ ml: 1 }} variant="body2" color="GrayText">
            {currentPhoto.file.name}
          </Typography>
          <IconButton onClick={handleAdd} sx={{ ml: 1 }} color="primary">
            <AddCircleIcon />
          </IconButton>
          <IconButton onClick={handleCancel} sx={{ ml: 1 }}>
            <CloseOutlinedIcon />
          </IconButton>
        </Paper>
      )}

      {!uploaded ? (
        <Stack direction="column" alignItems="left" spacing={2}>
          <Button startIcon={<AttachFileIcon />} component="label" size="small">
            Select Image
            <input
              onChange={handleChange}
              hidden
              type="file"
              name="file"
              accept="image/png, image/jpeg"
            />
          </Button>
          {photos.length > 0 &&
            photos.map((photo, index) => {
              return (
                <Stack
                  sx={{ mb: 1 }}
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Avatar src={photo.src} />
                  <Typography variant="body2">{photo.file.name}</Typography>
                </Stack>
              );
            })}
          <Button
            disabled={!photos.length > 0}
            onClick={handleSubmit}
            size="small"
            variant="contained"
          >
            Upload
          </Button>
        </Stack>
      ) : (
        <Typography variant="body1" sx={{ mt: 2.5 }} color="secondary">
          Photo is already uploaded
        </Typography>
      )}
    </Box>
  );
}

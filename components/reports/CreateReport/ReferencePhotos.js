import { useState } from "react";
import Layout from "./Layout";
import {
  Button,
  Paper,
  Grid,
  IconButton,
  Box,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import StackRowLayout from "@/utils/StackRowLayout";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import fileProcessing from "@/utils/file-upload/fileProcessing";
import ErrorAlert from "@/components/ErrorAlert";
import ReferencePhotoUploadGuidelines from "../ReferencePhotoUploadGuidelines";

export default function ReferencePhotos({
  setReferencePhotos,
  referencePhotos,
  isSubmitted,
}) {
  const [photo, setPhoto] = useState({
    src: "",
    file: null,
  });
  const [error, setError] = useState({
    open: false,
    message: "",
  });

  const selectFileHandler = (event) => {
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setPhoto({
          src: onLoadEvent.target.result,
          file: file,
        });
      },
      (message) => {
        setError({
          open: true,
          message: message,
        });
      }
    );
  };

  const cancelSelectedFile = () => {
    setPhoto({
      src: "",
      file: null,
    });
  };

  const addFileToReferencePhotos = () => {
    setReferencePhotos([
      ...referencePhotos,
      { index: referencePhotos.length, ...photo },
    ]);
    setPhoto({
      src: "",
      file: null,
    });
  };

  const removeFileFromReferencePhotos = (index) => {
    setReferencePhotos(
      referencePhotos.filter((photo) => {
        return photo.index !== index;
      })
    );
  };

  const closeError = () => {
    setError({
      open: false,
      message: "",
    });
  };

  return (
    <Layout
      head="Reference Photos"
    >
      <Box sx={{maxWidth: 400, mb: 2}}>
        <ReferencePhotoUploadGuidelines />
      </Box>
      <Box>
        <Paper
          variant="outlined"
          sx={{
            height: 200,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {photo.file ? (
            <Image
              src={photo.src}
              style={{objectFit: "cover"}}
              alt="reference photo"
              width="200"
              height="200"
            />
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <IconButton sx={{ mb: 1 }} component="label">
                <AddPhotoAlternateIcon color="primary" />
                <input
                  onChange={selectFileHandler}
                  hidden
                  type="file"
                  accept=".jpeg, .jpg, .png"
                />
              </IconButton>
              <Typography>Select a photo</Typography>
            </Box>
          )}
        </Paper>
        <ErrorAlert
          open={error.open}
          message={error.message}
          close={closeError}
        />
        <Collapse in={isSubmitted && referencePhotos.length < 3}>
          <Alert severity="error">Insufficient number of images</Alert>
        </Collapse>
        {photo.file && (
          <Box sx={{ mt: 1 }}>
            <StackRowLayout spacing={1}>
              <Typography variant="body2">{photo.file.name}</Typography>
              <IconButton
                onClick={addFileToReferencePhotos}
                size="small"
                color="primary"
              >
                <FileUploadIcon />
              </IconButton>
              <IconButton
                onClick={cancelSelectedFile}
                size="small"
                color="secondary"
              >
                <CancelIcon />
              </IconButton>
            </StackRowLayout>
          </Box>
        )}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {referencePhotos.map((photo) => {
            return (
              <Grid key={photo.file.name} item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <StackRowLayout spacing={1}>
                    <Image src={photo.src} style={{objectFit: "cover"}} width="60" height="60" />
                    <Box sx={{ width: "100%" }}>
                      <Typography variant="body2">{photo.file.name}</Typography>
                    </Box>
                    <IconButton
                      onClick={() => removeFileFromReferencePhotos(photo.index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StackRowLayout>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Layout>
  );
}

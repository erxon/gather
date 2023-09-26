import { useState } from "react";
import Layout from "./Layout";
import {
  Button,
  Paper,
  Grid,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import Image from "next/image";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import StackRowLayout from "@/utils/StackRowLayout";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ReferencePhotos(setIsCompleted) {
  //Upload photo
  //Train face-recognition API

  const [photo, setPhoto] = useState({
    src: "",
    file: null,
  });
  const [referencePhotos, setReferencePhotos] = useState([]);

  const selectFileHandler = (event) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setPhoto({
        src: onLoadEvent.target.result,
        file: event.target.files[0],
      });
    };

    reader.readAsDataURL(event.target.files[0]);
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

  const uploadReferencePhotos = () => {
    console.log(referencePhotos);
  };

  return (
    <Layout head="Reference Photos">
      <Box>
        <Paper
          variant="outlined"
          sx={{
            height: 200,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {photo.file ? (
            <Image
              src={photo.src}
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
        {referencePhotos.length > 0 && (
          <Button sx={{ mt: 1 }} onClick={uploadReferencePhotos}>
            Upload all
          </Button>
        )}
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {referencePhotos.map((photo) => {
            return (
              <Grid key={photo.file.name} item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  <StackRowLayout spacing={1}>
                    <Image src={photo.src} width="60" height="60" />
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

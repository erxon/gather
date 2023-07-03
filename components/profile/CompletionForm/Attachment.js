import { Box, Button, Paper, Typography } from "@mui/material";
import StackRowLayout from "@/utils/StackRowLayout";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import ValidPhoto from "./ValidPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Attachment({ validPhoto, setAccomplished }) {
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(validPhoto ? true : false);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar({
      open: false,
      message: "",
    });
  };

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage({
        file: event.target.files[0],
        fileName: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "valid-photo");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (data.status === 200) {
      const uploadedPhoto = await data.json();
      const storeValidPhoto = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validPhoto: uploadedPhoto.public_id }),
      });

      if (storeValidPhoto.status === 200) {
        setAccomplished((prev) => {
          return { ...prev, validPhoto: true };
        });
        setUploaded(true);
        setOpenSnackbar({
          open: true,
          message: "Image successfully uploaded.",
        });
      }
    }
  };
  return (
    <div>
      <DisplaySnackbar
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={handleSnackbarClose}
      />
      <Paper sx={{ p: 3, mt: 1 }} variant="outlined">
        <Box sx={{ mb: 2 }}>
          <StackRowLayout spacing={1}>
            <Typography variant="h6">Valid ID</Typography>
            {uploaded && <CheckCircleIcon color="success" />}
          </StackRowLayout>
        </Box>
        {/*If user have valid ID, render the image with cloudinary. 
        Else, jsut render the preview of the image to upload*/}
        {uploaded ? (
          <ValidPhoto publicId={validPhoto} />
        ) : image ? (
          <img src={image.fileName} style={{ width: 300, height: 150 }} />
        ) : null}
        <Box sx={{ mt: 1 }}>
          <form onSubmit={handleSubmit}>
            <Button
              startIcon={<AttachFileIcon />}
              size="small"
              variant="outlined"
              component="label"
              sx={{ mr: 1 }}
            >
              Attach File
              <input
                hidden
                name="file"
                type="file"
                accept="image/jpeg image/png"
                onChange={handleChange}
              />
            </Button>
            {image && (
              <Button size="small" type="submit" variant="contained">
                Upload
              </Button>
            )}
          </form>
        </Box>
      </Paper>
    </div>
  );
}

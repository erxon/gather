import { Box, Button, Paper, Typography } from "@mui/material";
import StackRowLayout from "@/utils/StackRowLayout";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import ValidPhoto from "./ValidPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import fileProcessing from "@/utils/file-upload/fileProcessing";

export default function Attachment({ validPhoto, setAccomplished }) {
  const [image, setImage] = useState(null);
  const [isValidPhotoExist, setValidPhotoState] = useState(validPhoto);
  const [uploaded, setUploaded] = useState(false);
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
    if (!event.target.files[0]) return;
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setUploaded(false);
        setImage({
          file: file,
          fileName: URL.createObjectURL(file),
        });
      },
      (message) => {
        setOpenSnackbar({
          open: true,
          message: message,
        });
      }
    );
  };

  const handleSubmit = async (event) => {
    const formData = new FormData();

    formData.append("file", image.file);
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
        setValidPhotoState(uploadedPhoto.public_id);
        setUploaded(true);
        setOpenSnackbar({
          open: true,
          message: "Valid photo successfully uploaded",
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
        <Box sx={{ mb: 1 }}>
          <StackRowLayout spacing={1}>
            <Typography variant="h6">Valid ID</Typography>
            {isValidPhotoExist && <CheckCircleIcon color="success" />}
          </StackRowLayout>
        </Box>
        <Typography sx={{ mb: 1 }} variant="body2">
          Please attach a valid ID of yours (i.e National ID, Voter&apos;s ID, School
          ID, Employee ID, etc.) as a proof of your identity
        </Typography>
        {/*If user have valid ID, render the image with cloudinary. 
        Else, jsut render the preview of the image to upload*/}
        {!image ? (
          !validPhoto ? null : (
            <ValidPhoto publicId={validPhoto} />
          )
        ) : (
          <Image
            src={image.fileName}
            alt="Placeholder"
            width={300}
            height={150}
            style={{ objectFit: "cover" }}
          />
        )}
        <Box sx={{ mt: 1 }}>
          <Button
            startIcon={<AttachFileIcon />}
            size="small"
            component="label"
            sx={{ mr: 1 }}
          >
            Attach File
            <input
              hidden
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={handleChange}
            />
          </Button>
          {image && !uploaded && (
            <Button
              onClick={handleSubmit}
              size="small"
              type="submit"
              variant="contained"
            >
              Upload
            </Button>
          )}
        </Box>
      </Paper>
    </div>
  );
}

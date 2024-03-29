import StackRowLayout from "@/utils/StackRowLayout";
import { Paper, Avatar, Button, Typography, Box } from "@mui/material";
import { useState } from "react";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import fileProcessing from "@/utils/file-upload/fileProcessing";

export default function ProfilePhoto({ photo, setAccomplished }) {
  const [image, setImage] = useState(null);
  const [isPhotoExist, setPhotoState] = useState(photo);
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
          fileName: URL.createObjectURL(event.target.files[0]),
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
    formData.append("upload_preset", "profile");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/dg0cwy8vx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    const updatePhoto = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: data.public_id }),
    });

    if (updatePhoto.status === 200) {
      setAccomplished((prev) => {
        return { ...prev, photo: true };
      });
      setPhotoState(data.public_id);
      setUploaded(true);
      setOpenSnackbar({
        open: true,
        message: "Profile photo updated successfully",
      });
    }
  };

  return (
    <div>
      <DisplaySnackbar
        open={openSnackbar.open}
        message={openSnackbar.message}
        handleClose={handleSnackbarClose}
      />
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <StackRowLayout spacing={1}>
            <Typography variant="h6">Profile photo</Typography>

            {isPhotoExist && <CheckCircleIcon color="success" />}
          </StackRowLayout>
        </Box>
        <StackRowLayout spacing={1}>
          {!image ? (
            !photo ? (
              <Avatar
                sx={{ width: 56, height: 56 }}
                src="/assets/placeholder.png"
              />
            ) : (
              <ProfilePhotoAvatar publicId={photo} />
            )
          ) : (
            <Avatar sx={{ width: 56, height: 56 }} src={image.fileName} />
          )}
          <StackRowLayout spacing={0.5}>
            <Button component="label">
              Select file
              <input
                onChange={handleChange}
                hidden
                type="file"
                accept=".png, .jpeg, .jpg"
                required
              />
            </Button>
            {image && !uploaded && (
              <Button onClick={handleSubmit} type="submit" variant="contained">
                Upload
              </Button>
            )}
          </StackRowLayout>
        </StackRowLayout>
      </Paper>
    </div>
  );
}

import StackRowLayout from "@/utils/StackRowLayout";
import { Paper, Avatar, Button, Typography } from "@mui/material";
import { useState } from "react";
import DisplaySnackbar from "@/components/DisplaySnackbar";
import ProfilePhotoAvatar from "@/components/photo/ProfilePhotoAvatar";

export default function ProfilePhoto({ photo }) {
  console.log(photo);
  const [image, setImage] = useState(null);
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
      setOpenSnackbar({
        open: true,
        message: "Image successfully uploaded.",
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
        <Typography sx={{ mb: 2 }} variant="h6">
          Profile photo
        </Typography>
        <StackRowLayout spacing={2}>
          {!image ? (
            photo === "" ? (
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

          <form onSubmit={handleSubmit}>
            <StackRowLayout spacing={0.5}>
              <Button component="label" variant="contained">
                Photo
                <input
                  onChange={handleChange}
                  hidden
                  name="file"
                  type="file"
                  accept="image/png image/jpeg"
                  required
                />
              </Button>
              {image && (
                <Button type="submit" variant="contained">
                  Upload
                </Button>
              )}
            </StackRowLayout>
          </form>
        </StackRowLayout>
      </Paper>
    </div>
  );
}

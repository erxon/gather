//Utilities
import fileProcessing from "@/utils/file-upload/fileProcessing";

//Material UI Components
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

//Material UI Icons
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

//Components
import Image from "next/image";
import Router from "next/router";

//APIs
import { uploadReportPhoto } from "@/lib/api-lib/api-reports";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function UploadPhotoModal({
  setPhoto,
  photo,
  open,
  setOpen,
  uploadData,
  setUploadData,
  setSnackbar,
}) {
  const handleCancelImage = () => {
    setPhoto({
      src: "",
      file: {},
    });
  };

  const handleChange = (event) => {
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setPhoto({
          src: onLoadEvent.target.result,
          file: file,
        });
        setUploadData(undefined);
      },
      (message) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: message,
        });
      }
    );
  };

  const uploadPhotosToCloudinary = async (file) => {
    //Upload photo to Cloudinary
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "query-photos");

    const cloudUpload = await uploadReportPhoto(formData);
    const publicId = cloudUpload.public_id.substring(13);

    return publicId;
  };

  const uploadToDatabase = async (publicId, photo) => {
    //Upload photo to Database
    const body = {
      type: "query",
      image: publicId,
      fileName: photo.fileName,
    };

    const uploadToDatabase = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const newQueryPhoto = await uploadToDatabase.json();

    return { responseBody: newQueryPhoto, status: uploadToDatabase.status };
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    const publicId = await uploadPhotosToCloudinary(photo.file);
    const response = await uploadToDatabase(publicId, photo);

    if (response.status === 400) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Something went wrong",
      });
    } else {
      Router.push(`/reports/upload/${response.responseBody.data._id}`);
    }
  };

  const imageUploadBox = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Upload image</DialogTitle>
      <DialogContent>
        <form
          method="post"
          onChange={handleChange}
          onSubmit={handleImageSubmit}
        >
          {photo.src ? (
            <Paper variant="outlined" sx={imageUploadBox}>
              <Image width={150} height={150} alt="" src={photo.src} />
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ ...imageUploadBox, width: 150 }}>
              <IconButton component="label" color="primary">
                <AddPhotoAlternateIcon />
                <input
                  hidden
                  type="file"
                  name="file"
                  accept="image/jpeg, image/png"
                />
              </IconButton>
              <Typography variant="body2">Upload file here</Typography>
            </Paper>
          )}
          {photo.src && !uploadData && (
            <p>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0.75,
                }}
              >
                <Typography sx={{ width: "100%" }} variant="body2">
                  {photo.file.name}
                </Typography>
                <IconButton color="primary" type="submit">
                  <FileUploadIcon />
                </IconButton>
                <IconButton onClick={handleCancelImage} color="secondary">
                  <CancelOutlinedIcon />
                </IconButton>
              </Paper>
            </p>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

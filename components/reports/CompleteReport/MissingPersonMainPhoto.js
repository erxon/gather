//Utilities
import isPhotoValid from "@/utils/photo/isPhotoValid";

//Hooks
import { useState } from "react";

//APIs
import { uploadReportPhoto, updateReport } from "@/lib/api-lib/api-reports";

//Material UI Icons
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportPhoto from "@/components/photo/ReportPhoto";

//Material UI Components
import {
  Paper,
  Button,
  Stack,
  Typography,
  IconButton,
  Box,
} from "@mui/material";

//Components
import Image from "next/image";
import FileUploadGuidelines from "@/components/FileUploadGuidelines";
import fileProcessing from "@/utils/file-upload/fileProcessing";

export default function MissingPersonMainPhoto({
  reportId,
  setSnackbar,
  currentPhoto,
  setUploaded,
  uploaded,
}) {
  const [photo, setPhoto] = useState({ src: "", file: null });

  const handleChange = (event) => {
    if (!event.target.files[0]) return;
    setUploaded(false)
    fileProcessing(
      event.target.files[0],
      (onLoadEvent, file) => {
        setPhoto({
          src: onLoadEvent.target.result,
          file: file,
        });
      },
      (message) => {
        setSnackbar({ open: true, message: message });
      }
    );
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", photo.file);
    formData.append("upload_preset", "report-photos");

    const uploadResponseData = await uploadReportPhoto(formData);

    const updateReportResponseData = await updateReport(reportId, {
      photo: uploadResponseData.public_id,
    });

    setUploaded((prev) => {
      return { ...prev, isReportProfilePhotoUploaded: true };
    });
    setSnackbar({ open: true, message: updateReportResponseData.message });
  };

  const handleCancel = () => {
    setPhoto({ src: "", file: null });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack sx={{ mb: 2 }} direction="row" alignItems="center" spacing={1}>
        {uploaded && <CheckCircleIcon color="primary" />}
        <Typography variant="body1" fontWeight={500}>
          Missing Person Profile Photo
        </Typography>
      </Stack>
      <FileUploadGuidelines content="File size should be less than 5 MB" />
      <Paper
        variant="outlined"
        sx={{
          my: 1,
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentPhoto && !photo.file ? (
          <ReportPhoto publicId={currentPhoto} />
        ) : (
          <Box>
            {photo.file ? (
              <Image
                src={photo.src}
                height={250}
                width={200}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Button component="label" size="small">
                Select file
                <input
                  hidden
                  onChange={handleChange}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                />
              </Button>
            )}
          </Box>
        )}
      </Paper>
      {photo.file && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography color="secondary" variant="body2">
            {photo.file.name}
          </Typography>
          {!uploaded ? (
            <Box>
              <IconButton onClick={handleUpload} color="primary" size="small">
                <FileUploadIcon />
              </IconButton>
              <IconButton onClick={handleCancel} size="small">
                <ClearIcon />
              </IconButton>
            </Box>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">Photo uploaded</Typography>
              <CheckCircleIcon color="primary" />
            </Stack>
          )}
        </Stack>
      )}
      {currentPhoto && !photo.file && (
        <Button component="label" size="small">
          Change photo
          <input
            hidden
            onChange={handleChange}
            type="file"
            accept=".jpg, .jpeg, .png"
          />
        </Button>
      )}
    </Paper>
  );
}

import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks";
import {
  Chip,
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";

//Icons
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CircleIcon from "@mui/icons-material/Circle";
import ClearIcon from "@mui/icons-material/Clear";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportPhoto from "@/components/photo/ReportPhoto";
import { sendNotification } from "@/lib/api-lib/api-notifications";
import {
  getSingleReport,
  updateReport,
  updateReportOnSignup,
  uploadReportPhoto,
} from "@/lib/api-lib/api-reports";
import Image from "next/image";
import TextFieldWithValidation from "@/components/forms/TextFieldWithValidation";
import DataPrivacyDialog from "@/components/reports/DataPrivacyDialog";
import isPhotoValid from "@/utils/photo/isPhotoValid";
import ReportPhotoSmall from "@/components/photo/ReportPhotoSmall";
import ReportPhotoLarge from "@/components/photo/ReportPhotoLarge";
//Signup user
//Update the report

function FileUploadGuidelines({ content }) {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={1}>
      <CircleIcon color="primary" fontSize="small" />
      <Typography variant="body2">{content}</Typography>
    </Stack>
  );
}

function UploadReferencePhotos({
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
  const handleChange = (event) => {
    //Include validation
    const validatePhoto = isPhotoValid(event.target.files[0]);
    //if the size of the photo exceeds 100000, return a message
    if (validatePhoto.valid) {
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
      disableButton({ ...isDisabled, [event.target.name]: true });

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSnackbar({ open: true, message: validatePhoto.message });
    }
  };

  const uploadPhotosToCloudinary = async (form) => {
    let uploadedPhotos = [];
    for (let i = 0; i < 3; i++) {
      for (const file of form.elements[i].files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "report-photos");
        const data = await uploadReportPhoto(formData);
        uploadedPhotos.push({
          publicId: data.public_id.substring(14, 34),
          fileName: file.name,
        });
      }
    }

    return uploadedPhotos;
  };

  const uploadToDatabase = async (photoData) => {
    const response = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(photoData),
    });
    const uploadedPhoto = await response.json();

    return uploadedPhoto;
  };

  const getFaceIDs = async (newPhotos) => {
    const response = await fetch(
      `/api/imagga-face-recognition/${newPhotos._id}`
    );
    const faceIDs = await response.json();

    return faceIDs;
  };

  const indexGeneratedFaceIds = async (faceIDs) => {
    await fetch("/api/imagga-face-recognition/save", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        person: { [faceIDs.result.reportId]: faceIDs.result.faceIDs },
      }),
    });
  };

  const uploadFeedback = (status, message) => {
    setSnackbar({
      open: true,
      message: message,
    });
    setUploaded((prev) => {
      return { ...prev, isReferencePhotosUploaded: true };
    });
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    //Upload photo to Cloudinary
    const form = event.currentTarget;
    const uploadedPhotos = await uploadPhotosToCloudinary(form);

    //Save photo to Photo database
    const photosData = {
      images: [...uploadedPhotos],
      type: "reference",
      reportId: reportId,
      missingPerson: mpName,
    };
    const newPhotos = await uploadToDatabase(photosData);

    //create face ids
    const faceIDs = await getFaceIDs(newPhotos.data);
    //index face ids
    await indexGeneratedFaceIds(faceIDs);
    const updateReportResponseData = await updateReport(reportId, {
      referencePhotos: newPhotos.data._id,
    });

    uploadFeedback(newPhotos.message);
    setSnackbar({ open: true, message: updateReportResponseData.message });
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

function ReportProfilePhoto({
  reportId,
  setSnackbar,
  currentPhoto,
  setUploaded,
  uploaded,
}) {
  const [photo, setPhoto] = useState({ src: "", file: null });

  const handleChange = (event) => {
    if (!event.target.files[0]) return;

    const validatePhoto = isPhotoValid(event.target.files[0]);

    if (validatePhoto.valid) {
      const reader = new FileReader();

      reader.onload = (onLoadEvent) => {
        setPhoto({
          src: onLoadEvent.target.result,
          file: event.target.files[0],
        });
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setSnackbar({ open: true, message: validatePhoto.message });
    }
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
          Reference photos
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

function Report({ data }) {
  const reportedAt = new Date(data.reportedAt);
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography fontWeight={500} variant="body1" sx={{ mb: 2 }}>
        Your report
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={400}
            sx={{ mb: 0.5 }}
            color="secondary"
          >
            This report will be verified by authorities.
          </Typography>
          <Chip
            size="small"
            color="secondary"
            variant="filled"
            label={data.status}
          />
        </Box>
        <Box>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceIcon />
              <Typography variant="body1">{data.lastSeen}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon />
              <Typography variant="body2">
                {data.gender}, {data.age} years old
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon />
              <Typography variant="body2">
                {reportedAt.toDateString()} {reportedAt.toLocaleTimeString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Page({ data }) {
  const router = useRouter();
  const [dataPrivacyDialog, setDataPrivacyDialog] = useState(false);
  const [completed, setCompleted] = useState(data.completed);
  const [formsToComplete, setFormsToComplete] = useState({
    isReportProfilePhotoUploaded: !!data.photo,
    isReferencePhotosUploaded: !!data.referencePhotos,
  });
  const [snackbarValues, setSnackbarValues] = useState({
    open: false,
    message: "",
  });

  //if report is already completed, redirect to the report page
  useEffect(() => {
    if (completed) {
      router.push(`/reports/${data._id}`);
    }
  }, [completed]);

  //Handle submit for signup and report update.
  const handleFinish = () => {
    setDataPrivacyDialog(true);
  };

  const handleConfirm = async () => {
    await updateReport(data._id, {
      completed: true,
    });
    setCompleted(true);
    setDataPrivacyDialog(false);
  };

  return (
    <>
      <Snackbar
        open={snackbarValues.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarValues({ open: false })}
        message={snackbarValues.message}
      />
      <DataPrivacyDialog
        open={dataPrivacyDialog}
        setOpen={setDataPrivacyDialog}
        onConfirm={handleConfirm}
      />
      <Box sx={{ margin: "auto", width: { xs: "100%", md: "50%" } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">Finish-up your report</Typography>
        </Box>

        <Report data={data} />
        {/*Report profile photo upload */}
        <ReportProfilePhoto
          setSnackbar={setSnackbarValues}
          reportId={data._id}
          setUploaded={setFormsToComplete}
          uploaded={formsToComplete.isReportProfilePhotoUploaded}
          currentPhoto={data.photo}
        />
        {/*Upload photo*/}
        <UploadReferencePhotos
          mpName={`${data.firstName} ${data.lastName}`}
          reportId={data._id}
          uploaded={formsToComplete.isReferencePhotosUploaded}
          setUploaded={setFormsToComplete}
          setSnackbar={setSnackbarValues}
        />
        <Button
          disabled={
            !(
              formsToComplete.isReferencePhotosUploaded &&
              formsToComplete.isReportProfilePhotoUploaded
            )
          }
          variant="contained"
          onClick={handleFinish}
        >
          Finish
        </Button>
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const { rid } = context.params;
  const data = await getSingleReport(rid);
  return {
    props: { data },
  };
}

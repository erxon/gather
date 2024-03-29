import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Stack,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicInformation from "@/components/reports/CreateReport/BasicInformation";
import ReferencePhotos from "@/components/reports/CreateReport/ReferencePhotos";
import Details from "@/components/reports/CreateReport/Details";
import UpdateLocation from "@/components/reports/CreateReport/UpdateLocation";
import _ from "lodash";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { updateReport, uploadReportPhoto } from "@/lib/api-lib/api-reports";
import { useRouter } from "next/router";
import DataPrivacyDialog from "@/components/reports/DataPrivacyDialog";
import clientFileUpload from "@/utils/api-helpers/clientFileUpload";
import ContentLayout from "@/utils/layout/ContentLayout";

const steps = [
  { label: "Basic information", isComplete: false, isSubmitted: false },
  { label: "Details", isComplete: false, isSubmitted: false },
  { label: "Reference photos", isComplete: false, isSubmitted: false },
  { label: "Update location", isComplete: false, isSubmitted: false },
];
function HorizontalLinearStepper({
  setIsSubmitted,
  activeStep,
  setActiveStep,
  handleCreateReport,
}) {
  const handleNext = () => {
    //if the current form is already completed, move to the next step
    //else, stay in the current form
    if (steps[activeStep].isComplete) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsSubmitted(false);
    } else {
      setIsSubmitted(true);
      return;
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps}>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={() => {
                  handleCreateReport();
                }}
              >
                Finish
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const [openDataPrivacyDialog, setOpenDataPrivacyDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [collections, setCollections] = useState({
    aliases: [],
    prostheticsAndImplants: [],
    medications: [],
    accessories: [],
    smt: [],
    birthDefects: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [photo, setPhoto] = useState({
    src: false,
    file: null,
  });
  const [referencePhotos, setReferencePhotos] = useState([]);
  const [updatedPosition, setUpdatedPosition] = useState(null);
  const [photoAdded, setPhotoAdded] = useState({ added: false, new: false });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formValues, setFormValues] = useState({
    basicInformation: {
      firstName: "",
      lastName: "",
      middleName: "",
      qualifier: "",
      age: 0,
      gender: "",
    },
    details: {
      currentHairColor: "",
      eyeColor: "",
      bloodType: "",
      lastKnownClothing: "",
      socialMediaAccounts: {
        facebook: "",
        twitter: "",
        instagram: "",
      },
    },
  });
  const [uploaded, setUploaded] = useState(false);
  const [dentalAndFingerprint, setDentalAndFingerprint] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  //Validation
  useEffect(() => {
    if (activeStep === 0) {
      const { firstName, lastName, age, gender } = formValues.basicInformation;
      const completed =
        firstName.length > 0 &&
        lastName.length > 0 &&
        gender.length > 0 &&
        !isNaN(Number(age)) &&
        photoAdded.added;

      steps[0].isComplete = completed;
    }
    if (activeStep === 1) {
      const { currentHairColor, eyeColor, lastKnownClothing } =
        formValues.details;

      const completed =
        currentHairColor.length > 0 &&
        eyeColor.length > 0 &&
        lastKnownClothing.length > 0;

      steps[1].isComplete = completed;
    }
    if (activeStep === 2) {
      const completed = referencePhotos.length >= 3;
      steps[2].isComplete = completed;
    }
    if (activeStep === 3) {
      steps[3].isComplete = !!updatedPosition;
    }
  }, [
    activeStep,
    photoAdded.added,
    formValues.basicInformation,
    formValues.details,
    referencePhotos,
    updatedPosition,
  ]);

  const uploadPhoto = async () => {
    try {
      const formData = new FormData();

      formData.append("file", photo.file);
      formData.append("upload_preset", "report-photos");

      const upload = await uploadReportPhoto(formData);
      setSnackbar({ open: true, message: "Missing Person Photo Uploaded" });
      return upload;
    } catch (error) {
      return error;
    }
  };

  const uploadReferencePhotos = async (reportId) => {
    //Upload photos
    try {
      const uploadedReferencePhotos = [];
      //Upload photos to Cloudinary and store the results in uploadedReferencePhotos array
      for (let i = 0; i < referencePhotos.length; i++) {
        const formData = new FormData();
        formData.append("file", referencePhotos[i].file);
        formData.append("upload_preset", "report-photos");
        const data = await uploadReportPhoto(formData);
        uploadedReferencePhotos.push({
          publicId: data.public_id.substring(14, 34),
          fileName: referencePhotos[i].file.name,
        });
      }

      //Attach uploadedReferencePhotos array to photosData
      const photosData = {
        images: [...uploadedReferencePhotos],
        type: "reference",
        reportId: reportId,
        missingPerson: `${formValues.basicInformation.firstName} ${formValues.basicInformation.lastName}`,
      };

      //Upload photosData to database
      const uploadToDatabase = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photosData),
      });

      //Get the result of the upload
      const newPhotos = await uploadToDatabase.json();

      //Get the faceIDs for each faces
      const response = await fetch(
        `/api/imagga-face-recognition/${newPhotos.data._id}`
      );
      const faceIDs = await response.json();

      //Save the faceIDs and Train the face-recognition algorithm
      await fetch("/api/imagga-face-recognition/save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: { [faceIDs.result.reportId]: faceIDs.result.faceIDs },
        }),
      });

      await updateReport(reportId, {
        referencePhotos: newPhotos.data._id,
      });

      setSnackbar({
        open: true,
        message: "Reference Photos successfully uploaded",
      });
    } catch (error) {
      return error;
    }
  };

  const dentalAndFingerprintUpload = async (reportId) => {
    const url = `/api/reports/file-upload/dental-fingerprint-record/${reportId}`;

    const formData = new FormData();
    formData.append("file", dentalAndFingerprint);

    const upload = await clientFileUpload(url, formData);

    if (upload.status === 200) {
      setSnackbar({
        open: true,
        message: "Dental and Fingerprint records uploaded",
      });
    }
  };

  const createReport = async () => {
    try {
      let uploadedPhoto;
      if (photoAdded.new) {
        uploadedPhoto = await uploadPhoto();
      }

      const data = {
        photo: photoAdded.new ? uploadedPhoto.public_id : null,
        photoId: photoAdded.new ? null : selectedImage._id,
        location: updatedPosition,
        ...formValues.basicInformation,
        ...formValues.details,
        ...collections,
      };

      const uploadReport = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await uploadReport.json();

      await uploadReferencePhotos(result.data._id);

      setSnackbar({
        open: true,
        message: "Report successfully created",
      });

      //upload dental and fingerprint records (if included)
      if (dentalAndFingerprint) {
        await dentalAndFingerprintUpload(result.data._id);
      }

      //upload reference photos

      //upload photos to database
      return result;
    } catch (error) {
      return error;
    }
  };

  const handleCreateReport = async () => {
    setActiveStep((prevStep) => prevStep + 1);
    setOpenDataPrivacyDialog(false);

    try {
      const result = await createReport();
      setUploaded(true);
      router.push(`/reports/${result.data._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinish = () => {
    setOpenDataPrivacyDialog(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "" });
  };

  return (
    <div>
      <ContentLayout>
        <Snackbar
          open={snackbar.open}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          autoHideDuration={6000}
        />
        <DataPrivacyDialog
          open={openDataPrivacyDialog}
          setOpen={setOpenDataPrivacyDialog}
          onConfirm={handleCreateReport}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ mb: 3 }} variant="h5">
              Report profile
            </Typography>
            <HorizontalLinearStepper
              handleCreateReport={handleFinish}
              setIsSubmitted={setIsSubmitted}
              isSubmitted={isSubmitted}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </Paper>
          <Paper sx={{ p: 3, maxWidth: 750 }}>
            <Box sx={{ my: 3 }}>
              {activeStep === 0 && (
                <BasicInformation
                  photoAdded={photoAdded}
                  setPhotoAdded={setPhotoAdded}
                  isSubmitted={isSubmitted}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  collections={collections}
                  setCollections={setCollections}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  photo={photo}
                  setPhoto={setPhoto}
                />
              )}
              {activeStep === 1 && (
                <Details
                  isSubmitted={isSubmitted}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  collections={collections}
                  setCollections={setCollections}
                  setDentalAndFingerprint={setDentalAndFingerprint}
                  dentalAndFingerprint={dentalAndFingerprint}
                />
              )}
              {activeStep === 2 && (
                <ReferencePhotos
                  setReferencePhotos={setReferencePhotos}
                  referencePhotos={referencePhotos}
                  isSubmitted={isSubmitted}
                />
              )}
              {activeStep === 3 && (
                <UpdateLocation
                  isSubmitted={isSubmitted}
                  updatedPosition={updatedPosition}
                  setUpdatedPosition={setUpdatedPosition}
                />
              )}
              {activeStep === 4 && (
                <Box>
                  <Typography sx={{ mb: 2 }} variant="h6">
                    Uploading
                  </Typography>

                  {uploaded ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ mb: 1 }}
                      spacing={0.5}
                    >
                      <CheckCircleIcon color="primary" />
                      <Typography>Report Uploaded</Typography>
                    </Stack>
                  ) : (
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ mb: 1 }}
                      spacing={0.5}
                    >
                      <CircularProgress size={24} />
                      <Typography>Processing</Typography>
                    </Stack>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </ContentLayout>
    </div>
  );
}

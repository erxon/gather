import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicInformation from "@/components/reports/CreateReport/BasicInformation";
import ReferencePhotos from "@/components/reports/CreateReport/ReferencePhotos";
import Details from "@/components/reports/CreateReport/Details";
import UpdateLocation from "@/components/reports/CreateReport/UpdateLocation";
import _ from "lodash";
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

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default function Page() {
  const [activeStep, setActiveStep] = useState(0);
  const [collections, setCollections] = useState({
    aliases: [],
    prostheticsAndImplants: [],
    medications: [],
    accessories: [],
    smt: [],
  });
  const [photo, setPhoto] = useState({
    src: "",
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

  useEffect(() => {
    if (activeStep === 0) {
      const { firstName, lastName, middleName, qualifier } =
        formValues.basicInformation;
      const completed =
        firstName.length > 0 &&
        lastName.length > 0 &&
        middleName.length > 0 &&
        qualifier.length > 0 &&
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
    formValues.basicInformation,
    formValues.details,
    referencePhotos,
    updatedPosition,
  ]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper sx={{ p: 3, maxWidth: 750 }}>
        <Typography sx={{ mb: 3 }} variant="h5">
          Create report
        </Typography>
        <HorizontalLinearStepper
          setIsSubmitted={setIsSubmitted}
          isSubmitted={isSubmitted}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
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
            />
          )}
          {activeStep === 1 && (
            <Details
              isSubmitted={isSubmitted}
              formValues={formValues}
              setFormValues={setFormValues}
              collections={collections}
              setCollections={setCollections}
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
        </Box>
      </Paper>
    </Box>
  );
}

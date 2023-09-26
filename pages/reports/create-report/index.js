import {
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import BasicInformation from "@/components/reports/CreateReport/BasicInformation";
import ReferencePhotos from "@/components/reports/CreateReport/ReferencePhotos";
import Details from "@/components/reports/CreateReport/Details";
import UpdateLocation from "@/components/reports/CreateReport/UpdateLocation";

const steps = [
  "Basic information",
  "Details",
  "Reference photos",
  "Update location",
];

function HorizontalLinearStepper({ activeStep, setActiveStep }) {
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
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
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper sx={{ p: 3, maxWidth: 750 }}>
        <Typography sx={{ mb: 3 }} variant="h5">
          Create report
        </Typography>
        <HorizontalLinearStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
        <Box sx={{ my: 3 }}>
          {activeStep === 0 && <BasicInformation />}
          {activeStep === 1 && <Details />}
          {activeStep === 2 && <ReferencePhotos />}
          {activeStep === 3 && <UpdateLocation />}
        </Box>
      </Paper>
    </Box>
  );
}

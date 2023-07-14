//after completion, redirect user to the 'wait for verification page'
import { useUser } from "@/lib/hooks";
import {
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Box,
  Stepper,
  StepLabel,
  Step,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function HorizontalLinearStepper({activeStep, setActiveStep}) {
  const router = useRouter();
  const steps = [
    "Basic information",
    "Phone number verification",
    "Email verification",
  ];

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
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
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

export default function Layout({ children }) {
  const router = useRouter();
  const [user, { loading }] = useUser();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    } else if (user && user.status === "verified") {
      router.push("/dashboard");
    }
  }, [user, loading]);

  if (user) {
    return (
      <div>
        {user && user.status === "unverified" ? (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">Complete your profile</Typography>
            <Box sx={{ mt: 2 }}>
              <HorizontalLinearStepper activeStep={activeStep} setActiveStep={setActiveStep} />
            </Box>
            <Divider sx={{ my: 3 }} />
            {children}
          </Paper>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

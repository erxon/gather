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
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CompletionForm from "@/components/profile/CompletionForm/CompletionForm";
import EmailVerification from "@/components/profile/EmailVerification";
import PhoneNumberVerification from "@/components/profile/PhoneNumberVerification";

function HorizontalLinearStepper({
  isNext,
  setCompleted,
  activeStep,
  setActiveStep,
  setFinished
}) {
  const steps = [
    "Basic information",
    "Email verification",
    "Phone number verification",
  ];

  const handleNext = () => {
    if (activeStep === 2) {
      setFinished(true)
    }
    setCompleted(false);
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
            <Button disabled={!isNext} onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const [user, { loading, mutate }] = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setCompleted] = useState(false);
  const [isFinished, setFinished] = useState(false);

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
              <HorizontalLinearStepper
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setCompleted={setCompleted}
                isNext={isCompleted}
                setFinished={setFinished}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            {activeStep === 0 && (
              <CompletionForm
                setCompleted={setCompleted}
                user={user}
                mutate={mutate}
              />
            )}
            {activeStep === 1 && (
              <EmailVerification
                setCompleted={setCompleted}
                email={user.email}
              />
            )}
            {activeStep === 2 && (
              <PhoneNumberVerification
                contactNumber={user.contactNumber}
                setCompleted={setCompleted}
                setFinished={setFinished}
              />
            )}
            {isFinished && (
              <Typography>
                You are all set, please wait while we verify your account.
              </Typography>
            )}
          </Paper>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

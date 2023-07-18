import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useEffect, useState } from "react";

export default function PhoneNumberVerification({
  contactNumber,
  isContactNumberVerified,
  setCompleted,
  userId,
}) {
  const [openDialog, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "",
  });
  const [successAlert, setSuccessAlert] = useState({
    open: isContactNumberVerified,
    message: isContactNumberVerified ? "Contact number is verified." : "",
  });

  useEffect(() => {
    setCompleted(isContactNumberVerified);
  }, []);

  const handleVerificationCode = (event) => {
    setOtp(event.target.value);
  };
  const checkOtp = async () => {
    const check = await fetch("/api/verification/sms/checkVerification", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `+63${contactNumber}`,
        userId: userId,
        code: otp,
      }),
    });
    const result = await check.json();
    if (check.status === 200) {
      setSuccessAlert({
        open: true,
        message: result.message,
      });
      setCompleted(true);
      setOpen(false);
    } else {
      setError({
        open: true,
        message: result.message
      })
    }
    return;
  };

  const handleVerify = async () => {
    //True if verification is successful
    const verify = await fetch("/api/verification/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: `+63${contactNumber}`,
      }),
    });
    const result = await verify.json();
    console.log(result);
    setOpen(true);
    setCompleted(true);
  };

  const handleDialogClose = () => {
    if (otp === "") {
      setError({ open: true, message: "Please enter 6-digit code." });
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={openDialog}>
        <DialogTitle>Enter verification code</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 3 }}>
            <TextField
              label="6-digit code"
              type="text"
              name="otp"
              value={otp}
              error={error.open}
              helperText={error.message}
              onChange={handleVerificationCode}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={checkOtp}>Enter</Button>
          <Button onClick={handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <LocalPhoneOutlinedIcon />
          <Typography sx={{ mb: 2 }} variant="h6">
            Phone number
          </Typography>
        </Stack>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 0.5 }}>
            Click send verification so we could verify your phone number.
          </Typography>
          <Typography variant="body2">
            Your phone number{" "}
            <span style={{ fontWeight: "bold" }}>+63{contactNumber}</span>
          </Typography>
        </Box>
        {!successAlert.open ? (
          <Button onClick={handleVerify} variant="contained">
            Send Verification
          </Button>
        ) : (
          <Alert severity="success">{successAlert.message}</Alert>
        )}
      </Paper>
    </div>
  );
}

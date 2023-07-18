import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useEffect, useState } from "react";
import DisplaySnackbar from "../DisplaySnackbar";
import { useRouter } from "next/router";

export default function EmailVerification({
  email,
  setCompleted,
  setFinished,
  isEmailVerified,
  userId,
}) {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false);
  const [code, setCode] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
  });
  const [successAlert, setSuccessAlert] = useState({
    open: isEmailVerified,
    message: isEmailVerified ? "Email is verified." : "",
  });

  useEffect(() => {
    if(isEmailVerified){
      setCompleted(true)
      setFinished(true)
    }
  }, [])

  const handleSnackbarClose = () => {
    setOpenSnackbar({
      open: false,
    });
  };

  const handleCodeInput = (event) => {
    setCode(event.target.value);
  };

  const handleSendVerification = async () => {
    const sendVerification = await fetch("/api/verification/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
      }),
    });
    const result = await sendVerification.json();
    if (sendVerification.status === 400) {
      setOpenSnackbar({
        open: true,
        message: result.message,
      });
      return;
    }
    setOpenDialog(true);
  };

  const handleCheckCode = async () => {
    const checkCode = await fetch("/api/verification/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        userId: userId,
        code: code,
      }),
    });

    const result = await checkCode.json();

    if (checkCode.status === 200) {
      router.reload()
    } else {
      setOpenSnackbar({
        open: true,
        message: result.message,
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
      <Dialog open={openDialog}>
        <DialogTitle>Email verification</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="6-digit code"
              name="code"
              value={code}
              onChange={handleCodeInput}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCheckCode}>Enter</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <EmailOutlinedIcon />
          <Typography sx={{ mb: 2 }} variant="h6">
            Email verification
          </Typography>
        </Stack>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 0.5 }}>
            Click send verification so we could verify your email address.
          </Typography>
          <Typography variant="body2">
            Your email <span style={{ fontWeight: "bold" }}>{email}</span>
          </Typography>
        </Box>
        {!successAlert.open ? (
          <Button onClick={handleSendVerification} variant="contained">
            Send Verification
          </Button>
        ) : (
          <Alert severity="success">{successAlert.message}</Alert>
        )}
      </Paper>
    </div>
  );
}

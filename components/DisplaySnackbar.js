import { Snackbar } from "@mui/material";

export default function DisplaySnackbar({ message, open, handleClose }) {
  return (
    <Snackbar
      message={message}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    />
  );
}

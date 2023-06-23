import { Snackbar } from "@mui/material";

export default function DisplaySnackbar({ message, open, handleClose }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      message={message}
      open={open}
      onClose={() => handleClose()}
    />
  );
}

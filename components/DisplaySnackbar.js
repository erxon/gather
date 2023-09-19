import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export default function DisplaySnackbar({ message, open, handleClose }) {
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      message={message}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={action}
    />
  );
}

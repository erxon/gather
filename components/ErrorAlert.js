import { Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ErrorAlert({ open, message, close }) {
  return (
    <Collapse sx={{ mb: 1 }} in={open}>
      <Alert
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={() => {
              close();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        severity="error"
      >
        {message}
      </Alert>
    </Collapse>
  );
}

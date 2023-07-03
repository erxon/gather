import { Box, Modal, Typography, Button } from "@mui/material";

export default function DisplayConfirmationModal({
  openModal,
  handleClose,
  title,
  body,
  onConfirm,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="body1" sx={{fontWeight: 'bold'}}>{title}</Typography>
        <Typography variant="body2">{body}</Typography>
        <Box sx={{mt: 2}}>
          <Button sx={{mr: 1}} size="small" onClick={() => onConfirm()} variant="contained">
            Confirm
          </Button>
          <Button size="small" onClick={() => handleClose()} variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
